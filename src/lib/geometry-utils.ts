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

export class GeometryObjectCache {
	private geometryCache = new Map<number, THREE.BufferGeometry>();
	private materialCache = new Map<number, THREE.MeshStandardMaterial>();
	private transformCache = new Map<number, THREE.Matrix4>();

	clear(): void {
		this.geometryCache.clear();
		this.materialCache.clear();
		this.transformCache.clear();
	}

	getGeometry(
		meshIndex: number,
		meshData: MeshData,
		vertices: VertexData[],
		indices: IndexData[],
		nextMeshData: MeshData | null
	): THREE.BufferGeometry {
		const cached = this.geometryCache.get(meshIndex);
		if (cached) return cached;

		const geometry = createBufferGeometryFromMesh(
			vertices,
			indices,
			meshData,
			nextMeshData
		);
		this.geometryCache.set(meshIndex, geometry);
		return geometry;
	}

	getMaterial(
		materialIndex: number,
		mat: MaterialData
	): THREE.MeshStandardMaterial {
		const cached = this.materialCache.get(materialIndex);
		if (cached) return cached;

		const material = createThreeMaterial(mat);
		this.materialCache.set(materialIndex, material);
		return material;
	}

	getTransform(transformIndex: number, t: TransformData): THREE.Matrix4 {
		const cached = this.transformCache.get(transformIndex);
		if (cached) return cached;

		const matrix = createTransformMatrix(t);
		this.transformCache.set(transformIndex, matrix);
		return matrix;
	}
}

const geometryObjectCache = new GeometryObjectCache();

export function clearGeometryObjectCache(): void {
	geometryObjectCache.clear();
	batchCache.clear();
}

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

	for (const inst of instances) {
		const geom = geometries.get(inst.meshIndex);
		const mat = materials.get(inst.materialIndex);
		if (!geom || !mat) continue;

		const key = `${inst.meshIndex}-${inst.materialIndex}`;
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

function computeInstanceSetKey(instanceIndices: number[]): string {
	return instanceIndices
		.slice()
		.sort((a, b) => a - b)
		.join(",");
}

const batchCache = new Map<string, BatchedGeometry[]>();
const MAX_BATCH_CACHE_SIZE = 100;

function getCachedBatches(
	instanceData: InstanceData[],
	vertices: VertexData[],
	indices: IndexData[],
	meshes: MeshData[],
	materials: MaterialData[]
): BatchedGeometry[] {
	const key = computeInstanceSetKey(instanceData.map((i) => i.instance_index));
	const cached = batchCache.get(key);
	if (cached) return cached;

	const geometryMap = new Map<number, THREE.BufferGeometry>();
	const materialMap = new Map<number, THREE.MeshStandardMaterial>();

	for (const mat of materials) {
		materialMap.set(mat.index, geometryObjectCache.getMaterial(mat.index, mat));
	}

	for (let i = 0; i < meshes.length; i++) {
		const mesh = meshes[i];
		const nextMesh = meshes[i + 1] || null;
		geometryMap.set(
			mesh.index,
			geometryObjectCache.getGeometry(
				mesh.index,
				mesh,
				vertices,
				indices,
				nextMesh
			)
		);
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
			transform: geometryObjectCache.getTransform(
				inst.transform_index,
				transform
			),
			material: geometryObjectCache.getMaterial(inst.material_index, material),
		});
	}

	const batches = batchInstancesByMaterialAndGeometry(
		geometryInstances,
		geometryMap,
		materialMap
	);

	if (batchCache.size >= MAX_BATCH_CACHE_SIZE) {
		const firstKey = batchCache.keys().next().value;
		if (firstKey) batchCache.delete(firstKey);
	}
	batchCache.set(key, batches);

	return batches;
}

export function convertZUpToYUp(group: THREE.Group): void {
	group.rotation.x = -Math.PI / 2;
}

export function buildSceneFromInstances(
	instanceData: InstanceData[],
	vertices: VertexData[],
	indices: IndexData[],
	meshes: MeshData[],
	materials: MaterialData[]
): { scene: THREE.Group | null; instanceCount: number } {
	const batches = getCachedBatches(
		instanceData,
		vertices,
		indices,
		meshes,
		materials
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
			instancedMesh.frustumCulled = true;
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
