import * as THREE from "three";

export interface VertexData {
	index: number;
	x: number;
	y: number;
	z: number;
}

export interface IndexData {
	index: number;
	index_value: number;
}

export interface MeshData {
	index: number;
	vertex_offset: number;
	index_offset: number;
}

export interface MaterialData {
	index: number;
	red: number;
	green: number;
	blue: number;
	alpha: number;
	roughness: number;
	metallic: number;
}

export interface TransformData {
	index: number;
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
}

export interface InstanceData {
	index: number;
	entity_index: number;
	material_index: number;
	mesh_index: number;
	transform_index: number;
	flags: number;
}

export interface GeometryInstance {
	instanceIndex: number;
	entityIndex: number;
	meshIndex: number;
	transformIndex: number;
	materialIndex: number;
	LocalId: string;
	GlobalId: string;
	entityName: string;
	category: string;
	vertexOffset: number;
	indexOffset: number;
	transform: THREE.Matrix4;
	material: THREE.MeshStandardMaterial;
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
