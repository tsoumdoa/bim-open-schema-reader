import {
	FilteredGeometryResult,
	GeometricalDataCache,
	GeometryInstance,
	IndexData,
	InstanceData,
	MaterialData,
	MeshData,
	TransformData,
	VertexData,
} from "@/app/utils/types";
import * as THREE from "three";

export function createThreeMaterial(
	mat: MaterialData
): THREE.MeshStandardMaterial {
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color(mat.red, mat.green, mat.blue),
		transparent: mat.alpha < 1.0,
		opacity: mat.alpha,
		roughness: mat.roughness,
		side: THREE.DoubleSide,
	});
	(material as unknown as { metallic: number }).metallic = mat.metallic;
	return material;
}

export function createTransformMatrix(t: TransformData): THREE.Matrix4 {
	const matrix = new THREE.Matrix4();
	const position = new THREE.Vector3(t.tx, t.ty, t.tz);
	const quaternion = new THREE.Quaternion(t.qx, t.qy, t.qz, t.qw);
	const scale = new THREE.Vector3(t.sx, t.sy, t.sz);
	matrix.compose(position, quaternion, scale);
	return matrix;
}

export function createBufferGeometryFromMesh(
	vertices: VertexData[],
	indices: IndexData[],
	meshData: MeshData,
	nextMeshData: MeshData | null
): THREE.BufferGeometry {
	const vertexOffset = meshData.vertex_offset;
	const indexOffset = meshData.index_offset;
	const nextIndexOffset = nextMeshData
		? nextMeshData.index_offset
		: indices.length;

	const vertexCount = nextMeshData
		? nextMeshData.vertex_offset - vertexOffset
		: vertices.length - vertexOffset;
	const indexCount = nextIndexOffset - indexOffset;

	const positions = new Float32Array(vertexCount * 3);
	for (let i = 0; i < vertexCount; i++) {
		const v = vertices[vertexOffset + i];
		positions[i * 3] = v.x;
		positions[i * 3 + 1] = v.y;
		positions[i * 3 + 2] = v.z;
	}

	const indexArray = new Uint32Array(indexCount);
	for (let i = 0; i < indexCount; i++) {
		indexArray[i] = indices[indexOffset + i].index_value;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
	geometry.computeVertexNormals();

	return geometry;
}

export function buildInstancedMesh(
	geometry: THREE.BufferGeometry,
	material: THREE.MeshStandardMaterial,
	instances: GeometryInstance[]
): THREE.InstancedMesh {
	const instancedMesh = new THREE.InstancedMesh(
		geometry,
		material,
		instances.length
	);
	instancedMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

	for (let i = 0; i < instances.length; i++) {
		instancedMesh.setMatrixAt(i, instances[i].transform);
	}

	instancedMesh.matrixAutoUpdate = false;
	return instancedMesh;
}

export function createSingleMesh(
	geometry: THREE.BufferGeometry,
	transform: THREE.Matrix4
): THREE.Mesh {
	const mesh = new THREE.Mesh(geometry);
	mesh.matrixAutoUpdate = false;
	mesh.matrix.copy(transform);
	return mesh;
}

export interface BatchedGeometry {
	geometry: THREE.BufferGeometry;
	material: THREE.MeshStandardMaterial;
	instances: GeometryInstance[];
}

export function batchInstancesByMaterialAndGeometry(
	instances: GeometryInstance[],
	geometries: Map<number, THREE.BufferGeometry>,
	materials: Map<number, THREE.MeshStandardMaterial>
): BatchedGeometry[] {
	const batchMap = new Map<string, BatchedGeometry>();
	const materialUuidMap = new Map<number, string>();
	const geometryUuidMap = new Map<number, string>();

	for (const inst of instances) {
		const geom = geometries.get(inst.meshIndex);
		const mat = materials.get(inst.materialIndex);
		if (!geom || !mat) continue;

		if (!geometryUuidMap.has(inst.meshIndex)) {
			geometryUuidMap.set(inst.meshIndex, geom.uuid);
		}
		if (!materialUuidMap.has(inst.materialIndex)) {
			materialUuidMap.set(inst.materialIndex, mat.uuid);
		}

		const geomUuid = geometryUuidMap.get(inst.meshIndex)!;
		const matUuid = materialUuidMap.get(inst.materialIndex)!;
		const key = `${geomUuid}-${matUuid}`;
		let batch = batchMap.get(key);
		if (!batch) {
			batch = {
				geometry: geom,
				material: mat,
				instances: [],
			};
			batchMap.set(key, batch);
		}
		batch.instances.push(inst);
	}

	return Array.from(batchMap.values());
}

export function convertZUpToYUp(group: THREE.Group): void {
	group.rotation.x = -Math.PI / 2;
}

export function rowsToVertexData(rows: (string | number)[][]): VertexData[] {
	return rows.map((row) => ({
		index: Number(row[0] as number),
		x: row[1] as number,
		y: row[2] as number,
		z: row[3] as number,
	}));
}

export function rowsToIndexData(rows: (string | number)[][]): IndexData[] {
	return rows.map((row) => ({
		index: Number(row[0] as number),
		index_value: row[1] as number,
	}));
}

export function rowsToMeshData(rows: (string | number)[][]): MeshData[] {
	return rows.map((row) => ({
		index: Number(row[0] as number),
		vertex_offset: row[1] as number,
		index_offset: row[2] as number,
	}));
}

export function rowsToMaterialData(
	rows: (string | number)[][]
): MaterialData[] {
	return rows.map((row) => ({
		index: Number(row[0] as number),
		red: row[1] as number,
		green: row[2] as number,
		blue: row[3] as number,
		alpha: row[4] as number,
		roughness: row[5] as number,
		metallic: row[6] as number,
	}));
}

export function rowsToTransformData(
	rows: (string | number)[][]
): TransformData[] {
	return rows.map((row) => ({
		index: Number(row[0] as number),
		tx: row[1] as number,
		ty: row[2] as number,
		tz: row[3] as number,
		qx: row[4] as number,
		qy: row[5] as number,
		qz: row[6] as number,
		qw: row[7] as number,
		sx: row[8] as number,
		sy: row[9] as number,
		sz: row[10] as number,
	}));
}

export function rowsToInstanceData(
	rows: (string | number)[][]
): InstanceData[] {
	return rows.map((row) => ({
		instance_index: Number(row[0] as number),
		entity_index: Number(row[1] as number),
		material_index: Number(row[2] as number),
		mesh_index: Number(row[3] as number),
		transform_index: Number(row[4] as number),
		vertex_offset: Number(row[5] as number),
		index_offset: Number(row[6] as number),
		tx: row[7] as number,
		ty: row[8] as number,
		tz: row[9] as number,
		qx: row[10] as number,
		qy: row[11] as number,
		qz: row[12] as number,
		qw: row[13] as number,
		sx: row[14] as number,
		sy: row[15] as number,
		sz: row[16] as number,
		red: row[17] as number,
		green: row[18] as number,
		blue: row[19] as number,
		alpha: row[20] as number,
		roughness: row[21] as number,
		metallic: row[22] as number,
	}));
}

export function buildSceneFromInstances(
	instanceData: InstanceData[],
	vertices: VertexData[],
	indices: IndexData[],
	meshes: MeshData[],
	materials: MaterialData[]
): { scene: THREE.Group | null; instanceCount: number } {
	const geometryMap = new Map<number, THREE.BufferGeometry>();
	const materialMap = new Map<number, THREE.MeshStandardMaterial>();

	for (const mat of materials) {
		materialMap.set(mat.index, createThreeMaterial(mat));
	}

	for (let i = 0; i < meshes.length; i++) {
		const mesh = meshes[i];
		const nextMesh = meshes[i + 1] || null;
		const geometry = createBufferGeometryFromMesh(
			vertices,
			indices,
			mesh,
			nextMesh
		);
		geometryMap.set(mesh.index, geometry);
	}

	const geometryInstances: GeometryInstance[] = [];
	for (const inst of instanceData) {
		if (!geometryMap.has(inst.mesh_index)) continue;

		const transform: TransformData = {
			index: inst.transform_index,
			tx: inst.tx,
			ty: inst.ty,
			tz: inst.tz,
			qx: inst.qx,
			qy: inst.qy,
			qz: inst.qz,
			qw: inst.qw,
			sx: inst.sx,
			sy: inst.sy,
			sz: inst.sz,
		};

		const material: MaterialData = {
			index: inst.material_index,
			red: inst.red,
			green: inst.green,
			blue: inst.blue,
			alpha: inst.alpha,
			roughness: inst.roughness,
			metallic: inst.metallic,
		};

		geometryInstances.push({
			instanceIndex: inst.instance_index,
			entityIndex: inst.entity_index,
			meshIndex: inst.mesh_index,
			transformIndex: inst.transform_index,
			materialIndex: inst.material_index,
			LocalId: "",
			GlobalId: "",
			entityName: "",
			category: "",
			vertexOffset: inst.vertex_offset,
			indexOffset: inst.index_offset,
			transform: createTransformMatrix(transform),
			material: createThreeMaterial(material),
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

	return { scene: group, instanceCount: instanceData.length };
}

export const buildFilteredScene = (
	entityIndices: number[],
	cache: GeometricalDataCache | null
): FilteredGeometryResult => {
	if (!cache) {
		return { scene: null, instanceCount: 0, totalCount: 0 };
	}

	const entityIndexSet = new Set(entityIndices);

	const filteredInstances = cache.instances.filter((inst) =>
		entityIndexSet.has(inst.entity_index)
	);

	const { scene } = buildSceneFromInstances(
		filteredInstances,
		cache.vertices,
		cache.indices,
		cache.meshes,
		cache.materials
	);

	return {
		scene,
		instanceCount: filteredInstances.length,
		totalCount: new Set(filteredInstances.map((i) => i.entity_index)).size,
	};
};
