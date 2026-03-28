import { ParquetBlob, GeoTableNames } from "@/app/utils/types";
import { GeometryInstance } from "@/app/utils/types";
import {
	createThreeMaterial,
	createBufferGeometryFromMesh,
	batchInstancesByMaterialAndGeometry,
	convertZUpToYUp,
} from "@/lib/geometry-utils";
import { parquetReadObjects } from "hyparquet";
import * as THREE from "three";

const VERTEX_MULTIPLIER = 10000.0;
const MATERIAL_DIVISOR = 255.0;

interface ParquetData {
	vertices: { x: number; y: number; z: number }[];
	indices: number[];
	meshes: { vertex_offset: number; index_offset: number }[];
	materials: {
		index: number;
		red: number;
		green: number;
		blue: number;
		alpha: number;
		roughness: number;
		metallic: number;
	}[];
	transforms: {
		tx: number;
		ty: number;
		tz: number;
		qx: number;
		qy: number;
		qz: number;
		qw: number;
		sx: number;
		sy: number;
		sz: number;
	}[];
	instances: {
		entity_index: number;
		material_index: number;
		mesh_index: number;
		transform_index: number;
	}[];
	entityCategories: string[];
}

async function readParquetFile(
	blob: ParquetBlob,
	columns: string[]
): Promise<Record<string, any>[]> {
	const asyncBuffer = {
		byteLength: blob.parquet.byteLength,
		slice: (start: number, end?: number): ArrayBuffer => {
			const sliced = blob.parquet.slice(start, end);
			const buffer = new ArrayBuffer(sliced.length);
			new Uint8Array(buffer).set(sliced);
			return buffer;
		},
	};
	const data = await parquetReadObjects({
		file: asyncBuffer as any,
		columns,
	});
	return data;
}

async function loadGeometryData(
	parquetFileEntries: ParquetBlob[]
): Promise<ParquetData> {
	const getFile = (name: string) =>
		parquetFileEntries.find((e) => e.filename === name);

	const [
		verticesRaw,
		indicesRaw,
		meshesRaw,
		materialsRaw,
		transformsRaw,
		instancesRaw,
	] = await Promise.all([
		readParquetFile(getFile("VertexBuffer.parquet")!, [
			"VertexX",
			"VertexY",
			"VertexZ",
		]),
		readParquetFile(getFile("IndexBuffer.parquet")!, ["IndexBuffer"]),
		readParquetFile(getFile("Meshes.parquet")!, [
			"MeshVertexOffset",
			"MeshIndexOffset",
		]),
		readParquetFile(getFile("Materials.parquet")!, [
			"MaterialRed",
			"MaterialGreen",
			"MaterialBlue",
			"MaterialAlpha",
			"MaterialRoughness",
			"MaterialMetallic",
		]),
		readParquetFile(getFile("Transforms.parquet")!, [
			"TransformTX",
			"TransformTY",
			"TransformTZ",
			"TransformQX",
			"TransformQY",
			"TransformQZ",
			"TransformQW",
			"TransformSX",
			"TransformSY",
			"TransformSZ",
		]),
		readParquetFile(getFile("Instances.parquet")!, [
			"InstanceEntityIndex",
			"InstanceMaterialIndex",
			"InstanceMeshIndex",
			"InstanceTransformIndex",
		]),
	]);

	const vertices = verticesRaw.map(
		(row: Record<string, number>, index: number) => ({
			x: row.VertexX / VERTEX_MULTIPLIER,
			y: row.VertexY / VERTEX_MULTIPLIER,
			z: row.VertexZ / VERTEX_MULTIPLIER,
		})
	);

	const indices = indicesRaw.map(
		(row: Record<string, number>) => row.IndexBuffer
	);

	const meshes = meshesRaw.map(
		(row: Record<string, number>, index: number) => ({
			vertex_offset: row.MeshVertexOffset,
			index_offset: row.MeshIndexOffset,
		})
	);

	const materials = materialsRaw.map(
		(row: Record<string, number>, index: number) => ({
			index,
			red: row.MaterialRed / MATERIAL_DIVISOR,
			green: row.MaterialGreen / MATERIAL_DIVISOR,
			blue: row.MaterialBlue / MATERIAL_DIVISOR,
			alpha: row.MaterialAlpha / MATERIAL_DIVISOR,
			roughness: row.MaterialRoughness / MATERIAL_DIVISOR,
			metallic: row.MaterialMetallic / MATERIAL_DIVISOR,
		})
	);

	const transforms = transformsRaw.map((row: Record<string, number>) => ({
		tx: row.TransformTX,
		ty: row.TransformTY,
		tz: row.TransformTZ,
		qx: row.TransformQX,
		qy: row.TransformQY,
		qz: row.TransformQZ,
		qw: row.TransformQW,
		sx: row.TransformSX,
		sy: row.TransformSY,
		sz: row.TransformSZ,
	}));

	const instances = instancesRaw.map((row: Record<string, number>) => ({
		entity_index: row.InstanceEntityIndex,
		material_index: row.InstanceMaterialIndex,
		mesh_index: row.InstanceMeshIndex,
		transform_index: row.InstanceTransformIndex,
	}));

	return {
		vertices,
		indices,
		meshes,
		materials,
		transforms,
		instances,
		entityCategories: [],
	};
}

function buildSceneFromParquetData(
	data: ParquetData,
	categoryFilter?: string
): { scene: THREE.Group | null; instanceCount: number } {
	const { vertices, indices, meshes, materials, transforms, instances } = data;

	const materialMap = new Map<number, THREE.MeshStandardMaterial>();
	for (let i = 0; i < materials.length; i++) {
		materialMap.set(i, createThreeMaterial(materials[i]));
	}

	const geometryMap = new Map<number, THREE.BufferGeometry>();
	for (let i = 0; i < meshes.length; i++) {
		const mesh = meshes[i];
		const nextMesh = meshes[i + 1] || null;
		const geometry = createBufferGeometryFromMesh(
			vertices as any,
			indices.map((v, idx) => ({ index: idx, index_value: v })) as any,
			mesh as any,
			nextMesh as any
		);
		geometryMap.set(i, geometry);
	}

	const geometryInstances: GeometryInstance[] = [];
	for (const inst of instances) {
		if (!geometryMap.has(inst.mesh_index)) continue;

		const transform = transforms[inst.transform_index];
		if (!transform) continue;

		const matrix = new THREE.Matrix4();
		const position = new THREE.Vector3(
			transform.tx,
			transform.ty,
			transform.tz
		);
		const quaternion = new THREE.Quaternion(
			transform.qx,
			transform.qy,
			transform.qz,
			transform.qw
		);
		const scale = new THREE.Vector3(transform.sx, transform.sy, transform.sz);
		matrix.compose(position, quaternion, scale);

		geometryInstances.push({
			instanceIndex: geometryInstances.length,
			entityIndex: inst.entity_index,
			meshIndex: inst.mesh_index,
			transformIndex: inst.transform_index,
			materialIndex: inst.material_index,
			LocalId: "",
			GlobalId: "",
			entityName: "",
			category: "",
			vertexOffset: meshes[inst.mesh_index]?.vertex_offset ?? 0,
			indexOffset: meshes[inst.mesh_index]?.index_offset ?? 0,
			transform: matrix,
			material: materialMap.get(inst.material_index)!,
		});
	}

	const batches = batchInstancesByMaterialAndGeometry(
		geometryInstances,
		geometryMap,
		materialMap
	);

	const group = new THREE.Group();

	for (const batch of batches) {
		if (batch.instances.length === 1) {
			const mesh = new THREE.Mesh(batch.geometry, batch.instances[0].material);
			mesh.matrixAutoUpdate = false;
			mesh.matrix.copy(batch.instances[0].transform);
			group.add(mesh);
		} else {
			const instancedMesh = new THREE.InstancedMesh(
				batch.geometry,
				batch.material,
				batch.instances.length
			);
			instancedMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

			for (let i = 0; i < batch.instances.length; i++) {
				instancedMesh.setMatrixAt(i, batch.instances[i].transform);
			}

			instancedMesh.matrixAutoUpdate = false;
			group.add(instancedMesh);
		}
	}

	convertZUpToYUp(group);

	return { scene: group, instanceCount: instances.length };
}

export function useGeometryFromParquet(parquetFileEntries: ParquetBlob[]) {
	const loadGeometry = async (): Promise<{
		scene: THREE.Group | null;
		instanceCount: number;
	}> => {
		const data = await loadGeometryData(parquetFileEntries);
		return buildSceneFromParquetData(data);
	};

	return { loadGeometry };
}
