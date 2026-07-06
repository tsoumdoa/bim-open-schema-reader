import {
	FilteredGeometryResult,
	GeometricalDataCache,
	GeometryInstance,
} from "@/app/utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import * as THREE from "three";

const VERTEX_MULTIPLIER = 10000.0;
const MATERIAL_DIVISOR = 255.0;

class GeometryObjectCache {
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
		cache: GeometricalDataCache
	): THREE.BufferGeometry {
		const cached = this.geometryCache.get(meshIndex);
		if (cached) return cached;

		const vertexOffset = cache.meshVertexOffset[meshIndex];
		const vertexCount = cache.meshVertexCount[meshIndex];
		const indexOffset = cache.meshIndexOffset[meshIndex];
		const indexCount = cache.meshIndexCount[meshIndex];

		const positions = new Float32Array(vertexCount * 3);
		for (let i = 0; i < vertexCount; i++) {
			const srcIdx = (vertexOffset + i) * 3;
			positions[i * 3] = cache.positions[srcIdx];
			positions[i * 3 + 1] = cache.positions[srcIdx + 1];
			positions[i * 3 + 2] = cache.positions[srcIdx + 2];
		}

		const indexArray = new Uint32Array(indexCount);
		for (let i = 0; i < indexCount; i++) {
			indexArray[i] = cache.indices[indexOffset + i];
		}

		const normals = new Float32Array(vertexCount * 3);
		for (let i = 0; i < vertexCount; i++) {
			const srcIdx = (vertexOffset + i) * 3;
			normals[i * 3] = cache.normals[srcIdx];
			normals[i * 3 + 1] = cache.normals[srcIdx + 1];
			normals[i * 3 + 2] = cache.normals[srcIdx + 2];
		}

		const uvs = new Float32Array(vertexCount * 2);
		for (let i = 0; i < vertexCount; i++) {
			const srcIdx = (vertexOffset + i) * 2;
			uvs[i * 2] = cache.uvs[srcIdx];
			uvs[i * 2 + 1] = cache.uvs[srcIdx + 1];
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
		geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
		geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

		this.geometryCache.set(meshIndex, geometry);
		return geometry;
	}

	getMaterial(
		materialIndex: number,
		cache: GeometricalDataCache
	): THREE.MeshStandardMaterial {
		const cached = this.materialCache.get(materialIndex);
		if (cached) return cached;

		const i = materialIndex * 4;
		const material = new THREE.MeshStandardMaterial({
			color: new THREE.Color(
				cache.materialBaseColor[i],
				cache.materialBaseColor[i + 1],
				cache.materialBaseColor[i + 2]
			),
			transparent: cache.materialBaseColor[i + 3] < 1.0,
			opacity: cache.materialBaseColor[i + 3],
			roughness: cache.materialRoughness[materialIndex],
			metalness: cache.materialMetallic[materialIndex],
			side: THREE.DoubleSide,
		});

		this.materialCache.set(materialIndex, material);
		return material;
	}

	getTransform(
		transformIndex: number,
		cache: GeometricalDataCache
	): THREE.Matrix4 {
		const cached = this.transformCache.get(transformIndex);
		if (cached) return cached;

		const matrix = new THREE.Matrix4();
		matrix.fromArray(cache.transforms, transformIndex * 16);
		this.transformCache.set(transformIndex, matrix);
		return matrix;
	}
}

const geometryObjectCache = new GeometryObjectCache();

export function clearGeometryObjectCache(): void {
	geometryObjectCache.clear();
}

interface BatchedGeometry {
	geometry: THREE.BufferGeometry;
	material: THREE.MeshStandardMaterial;
	instances: GeometryInstance[];
}

export interface EntityFaceRangesSoA {
	entityIndices: Uint32Array;
	startFaces: Uint32Array;
	faceCounts: Uint32Array;
}

const highlightMaterialCache = new Map<number, THREE.MeshStandardMaterial>();

function getHighlightMaterial(
	baseMaterial: THREE.MeshStandardMaterial
): THREE.MeshStandardMaterial {
	const baseColor = baseMaterial.color.getHex();
	const cached = highlightMaterialCache.get(baseColor);
	if (cached) return cached;

	const mat = baseMaterial.clone();
	mat.emissive = new THREE.Color(0xffaa00);
	mat.emissiveIntensity = 0.8;
	mat.depthTest = true;
	mat.depthWrite = false;
	mat.polygonOffset = true;
	mat.polygonOffsetFactor = -2;
	mat.polygonOffsetUnits = -4;
	highlightMaterialCache.set(baseColor, mat);
	return mat;
}

function batchInstancesByMaterialAndGeometry(
	instances: GeometryInstance[],
	geometries: Map<number, THREE.BufferGeometry>,
	materials: Map<number, THREE.MeshStandardMaterial>
): BatchedGeometry[] {
	const batchMap = new Map<string, BatchedGeometry>();

	for (const inst of instances) {
		const geom = geometries.get(inst.meshIndex);
		const mat = materials.get(inst.materialIndex);
		if (!geom || !mat) continue;

		const key = `${inst.materialIndex}`;
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

function mergeGeometriesForBatch(
	instances: GeometryInstance[],
	geometries: Map<number, THREE.BufferGeometry>
): { geometry: THREE.BufferGeometry; faceRanges: EntityFaceRangesSoA } {
	let totalVertexCount = 0;
	let totalIndexCount = 0;

	for (const inst of instances) {
		const geom = geometries.get(inst.meshIndex);
		if (!geom) continue;
		totalVertexCount += geom.attributes.position.count;
		totalIndexCount += geom.index ? geom.index.count : 0;
	}

	const mergedPositions = new Float32Array(totalVertexCount * 3);
	const mergedIndices = new Uint32Array(totalIndexCount);
	let vertexOffset = 0;
	let indexOffset = 0;
	let indexVertexOffset = 0;

	const positionAttr = new THREE.BufferAttribute(mergedPositions, 3);
	const indexAttr = new THREE.BufferAttribute(mergedIndices, 1);

	const entityIndices = new Uint32Array(instances.length);
	const startFaces = new Uint32Array(instances.length);
	const faceCounts = new Uint32Array(instances.length);
	let rangeIdx = 0;

	for (const inst of instances) {
		const geom = geometries.get(inst.meshIndex);
		if (!geom) continue;

		const positions = geom.attributes.position.array as Float32Array;
		const vertexCount = geom.attributes.position.count;

		const m = inst.transform.elements;

		const transformedPositions = new Float32Array(vertexCount * 3);
		for (let i = 0; i < vertexCount; i++) {
			const px = positions[i * 3];
			const py = positions[i * 3 + 1];
			const pz = positions[i * 3 + 2];

			transformedPositions[i * 3] = m[0] * px + m[4] * py + m[8] * pz + m[12];
			transformedPositions[i * 3 + 1] =
				m[1] * px + m[5] * py + m[9] * pz + m[13];
			transformedPositions[i * 3 + 2] =
				m[2] * px + m[6] * py + m[10] * pz + m[14];
		}

		mergedPositions.set(transformedPositions, vertexOffset * 3);

		const startFace = indexOffset / 3;
		let faceCount = 0;

		if (geom.index) {
			const indices = geom.index.array as Uint32Array;
			const indexCount = geom.index.count;
			for (let i = 0; i < indexCount; i++) {
				mergedIndices[indexOffset + i] = indices[i] + indexVertexOffset;
			}
			faceCount = indexCount / 3;
			indexOffset += indexCount;
		}

		entityIndices[rangeIdx] = inst.entityIndex;
		startFaces[rangeIdx] = startFace;
		faceCounts[rangeIdx] = faceCount;
		rangeIdx++;
		vertexOffset += vertexCount;
		indexVertexOffset += vertexCount;
	}

	const mergedGeometry = new THREE.BufferGeometry();
	mergedGeometry.setAttribute("position", positionAttr);
	mergedGeometry.setIndex(indexAttr);
	mergedGeometry.computeVertexNormals();

	return {
		geometry: mergedGeometry,
		faceRanges: { entityIndices, startFaces, faceCounts },
	};
}

function buildGhostGeometry(
	ghostInstanceIndices: number[],
	cache: GeometricalDataCache,
	geometryMap: Map<number, THREE.BufferGeometry>
): THREE.BufferGeometry {
	let totalVertexCount = 0;
	let totalIndexCount = 0;

	for (const instIdx of ghostInstanceIndices) {
		const meshIndex = cache.instanceMeshIndex[instIdx];
		const geom = geometryMap.get(meshIndex);
		if (!geom) continue;
		totalVertexCount += geom.attributes.position.count;
		totalIndexCount += geom.index ? geom.index.count : 0;
	}

	const mergedPositions = new Float32Array(totalVertexCount * 3);
	const mergedIndices = new Uint32Array(totalIndexCount);
	let vertexOffset = 0;
	let indexOffset = 0;
	let indexVertexOffset = 0;

	for (const instIdx of ghostInstanceIndices) {
		const meshIndex = cache.instanceMeshIndex[instIdx];
		const geom = geometryMap.get(meshIndex);
		if (!geom) continue;

		const positions = geom.attributes.position.array as Float32Array;
		const vertexCount = geom.attributes.position.count;

		const transformIndex = cache.instanceTransformIndex[instIdx];
		const transformMatrix = new THREE.Matrix4();
		transformMatrix.fromArray(cache.transforms, transformIndex * 16);

		const transformedPositions = new Float32Array(vertexCount * 3);
		for (let i = 0; i < vertexCount; i++) {
			const px = positions[i * 3];
			const py = positions[i * 3 + 1];
			const pz = positions[i * 3 + 2];

			transformedPositions[i * 3] =
				transformMatrix.elements[0] * px +
				transformMatrix.elements[4] * py +
				transformMatrix.elements[8] * pz +
				transformMatrix.elements[12];
			transformedPositions[i * 3 + 1] =
				transformMatrix.elements[1] * px +
				transformMatrix.elements[5] * py +
				transformMatrix.elements[9] * pz +
				transformMatrix.elements[13];
			transformedPositions[i * 3 + 2] =
				transformMatrix.elements[2] * px +
				transformMatrix.elements[6] * py +
				transformMatrix.elements[10] * pz +
				transformMatrix.elements[14];
		}

		mergedPositions.set(transformedPositions, vertexOffset * 3);
		vertexOffset += vertexCount;

		if (geom.index) {
			const indices = geom.index.array as Uint32Array;
			const indexCount = geom.index.count;
			for (let i = 0; i < indexCount; i++) {
				mergedIndices[indexOffset + i] = indices[i] + indexVertexOffset;
			}
			indexOffset += indexCount;
		}

		indexVertexOffset += vertexCount;
	}

	const mergedGeometry = new THREE.BufferGeometry();
	mergedGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(mergedPositions, 3)
	);
	mergedGeometry.setIndex(new THREE.BufferAttribute(mergedIndices, 1));
	mergedGeometry.computeVertexNormals();

	return mergedGeometry;
}

function convertZUpToYUp(group: THREE.Group): void {
	group.rotation.x = -Math.PI / 2;
}

function buildGeometryInstances(
	instanceIndices: number[],
	cache: GeometricalDataCache
): {
	instances: GeometryInstance[];
	geometryMap: Map<number, THREE.BufferGeometry>;
	materialMap: Map<number, THREE.MeshStandardMaterial>;
} {
	const geometryMap = new Map<number, THREE.BufferGeometry>();
	const materialMap = new Map<number, THREE.MeshStandardMaterial>();

	for (let i = 0; i < cache.meshCount; i++) {
		geometryMap.set(i, geometryObjectCache.getGeometry(i, cache));
	}

	for (let i = 0; i < cache.materialCount; i++) {
		materialMap.set(i, geometryObjectCache.getMaterial(i, cache));
	}

	const geometryInstances: GeometryInstance[] = [];
	for (const instIdx of instanceIndices) {
		const meshIndex = cache.instanceMeshIndex[instIdx];
		if (!geometryMap.has(meshIndex)) continue;

		const materialIndex = cache.instanceMaterialIndex[instIdx];
		const transformIndex = cache.instanceTransformIndex[instIdx];
		const entityIndex = cache.instanceEntityIndex[instIdx];

		geometryInstances.push({
			instanceIndex: instIdx,
			entityIndex,
			meshIndex,
			transformIndex,
			materialIndex,
			LocalId: "",
			GlobalId: "",
			entityName: "",
			category: "",
			vertexOffset: cache.meshVertexOffset[meshIndex],
			indexOffset: cache.meshIndexOffset[meshIndex],
			transform: geometryObjectCache.getTransform(transformIndex, cache),
			material: geometryObjectCache.getMaterial(materialIndex, cache),
		});
	}

	return { instances: geometryInstances, geometryMap, materialMap };
}

function buildSceneFromInstances(
	instanceIndices: number[],
	cache: GeometricalDataCache
): {
	scene: THREE.Group | null;
	instanceCount: number;
} {
	const { instances, geometryMap, materialMap } = buildGeometryInstances(
		instanceIndices,
		cache
	);

	const batches = batchInstancesByMaterialAndGeometry(
		instances,
		geometryMap,
		materialMap
	);

	const group = new THREE.Group();

	for (const batch of batches) {
		const { geometry: mergedGeometry, faceRanges } = mergeGeometriesForBatch(
			batch.instances,
			geometryMap
		);
		const mesh = new THREE.Mesh(mergedGeometry, batch.material);
		mesh.userData.entityFaceRanges = faceRanges;
		group.add(mesh);
	}

	convertZUpToYUp(group);

	return { scene: group, instanceCount: instanceIndices.length };
}

export function buildHighlightOverlay(
	highlightedEntityIndices: Set<number>,
	entityIndices: number[],
	cache: GeometricalDataCache
): THREE.Group | null {
	const entityIndexSet = new Set(entityIndices);
	const matchedInstanceIndices: number[] = [];

	for (let i = 0; i < cache.instanceCount; i++) {
		const ei = cache.instanceEntityIndex[i];
		if (highlightedEntityIndices.has(ei) && entityIndexSet.has(ei)) {
			matchedInstanceIndices.push(i);
		}
	}

	if (matchedInstanceIndices.length === 0) return null;

	const { instances, geometryMap, materialMap } = buildGeometryInstances(
		matchedInstanceIndices,
		cache
	);

	const batches = batchInstancesByMaterialAndGeometry(
		instances,
		geometryMap,
		materialMap
	);

	const group = new THREE.Group();
	for (const batch of batches) {
		const { geometry: mergedGeometry } = mergeGeometriesForBatch(
			batch.instances,
			geometryMap
		);
		const highlightMat = getHighlightMaterial(batch.material);
		const mesh = new THREE.Mesh(mergedGeometry, highlightMat);
		group.add(mesh);
	}

	convertZUpToYUp(group);
	return group;
}

export const buildFilteredScene = (
	entityIndices: number[],
	cache: GeometricalDataCache | null
): FilteredGeometryResult => {
	if (!cache) {
		return { scene: null, instanceCount: 0, totalCount: 0 };
	}

	const entityIndexSet = new Set(entityIndices);
	const filteredInstanceIndices: number[] = [];
	const filteredEntities = new Set<number>();

	for (let i = 0; i < cache.instanceCount; i++) {
		const entityIndex = cache.instanceEntityIndex[i];
		if (entityIndexSet.has(entityIndex)) {
			filteredInstanceIndices.push(i);
			filteredEntities.add(entityIndex);
		}
	}

	const { scene } = buildSceneFromInstances(filteredInstanceIndices, cache);

	return {
		scene,
		instanceCount: filteredInstanceIndices.length,
		totalCount: filteredEntities.size,
	};
};

export interface GhostedSceneResult {
	scene: THREE.Group | null;
	selectedCount: number;
	ghostCount: number;
	totalCount: number;
}

const surfaceMaterial = new THREE.MeshPhysicalMaterial({
	color: new THREE.Color(0.4, 0.4, 0.4),
	transparent: true,
	opacity: 0.6,
	depthWrite: true,
	transmission: 0.15,
	roughness: 0.75,
	metalness: 0,
});

const wireMaterial = new THREE.MeshBasicMaterial({
	color: new THREE.Color(0.8, 0.8, 0.8),
	wireframe: true,
	transparent: true,
	opacity: 0.95,
	depthWrite: true,
});

export const buildGhostedScene = (
	entityIndices: number[],
	cache: GeometricalDataCache | null
): GhostedSceneResult => {
	if (!cache) {
		return {
			scene: null,
			selectedCount: 0,
			ghostCount: 0,
			totalCount: 0,
		};
	}

	const entityIndexSet = new Set(entityIndices);
	const selectedInstanceIndices: number[] = [];
	const ghostInstanceIndices: number[] = [];
	const selectedEntities = new Set<number>();

	for (let i = 0; i < cache.instanceCount; i++) {
		const entityIndex = cache.instanceEntityIndex[i];
		if (entityIndexSet.has(entityIndex)) {
			selectedInstanceIndices.push(i);
			selectedEntities.add(entityIndex);
		} else {
			ghostInstanceIndices.push(i);
		}
	}

	const { scene: selectedScene } = buildSceneFromInstances(
		selectedInstanceIndices,
		cache
	);

	if (!selectedScene) {
		return {
			scene: null,
			selectedCount: 0,
			ghostCount: ghostInstanceIndices.length,
			totalCount: selectedEntities.size,
		};
	}

	const geometryMap = new Map<number, THREE.BufferGeometry>();
	for (let i = 0; i < cache.meshCount; i++) {
		geometryMap.set(i, geometryObjectCache.getGeometry(i, cache));
	}

	const ghostGeometry = buildGhostGeometry(
		ghostInstanceIndices,
		cache,
		geometryMap
	);

	const surfaceMesh = new THREE.Mesh(ghostGeometry, surfaceMaterial);
	const wireMesh = new THREE.Mesh(ghostGeometry, wireMaterial);
	selectedScene.add(surfaceMesh);
	selectedScene.add(wireMesh);

	convertZUpToYUp(selectedScene);

	return {
		scene: selectedScene,
		selectedCount: selectedInstanceIndices.length,
		ghostCount: ghostInstanceIndices.length,
		totalCount: selectedEntities.size,
	};
};

function computeVertexNormals(
	positions: Float32Array,
	indices: Uint32Array,
	vertexCount: number,
	indexCount: number
): Float32Array {
	const normals = new Float32Array(vertexCount * 3);
	const normalAccum = new Float32Array(vertexCount * 3);

	for (let i = 0; i < indexCount; i += 3) {
		const i0 = indices[i] * 3;
		const i1 = indices[i + 1] * 3;
		const i2 = indices[i + 2] * 3;

		const v0x = positions[i0];
		const v0y = positions[i0 + 1];
		const v0z = positions[i0 + 2];
		const v1x = positions[i1];
		const v1y = positions[i1 + 1];
		const v1z = positions[i1 + 2];
		const v2x = positions[i2];
		const v2y = positions[i2 + 1];
		const v2z = positions[i2 + 2];

		const ax = v1x - v0x;
		const ay = v1y - v0y;
		const az = v1z - v0z;
		const bx = v2x - v0x;
		const by = v2y - v0y;
		const bz = v2z - v0z;

		const nx = ay * bz - az * by;
		const ny = az * bx - ax * bz;
		const nz = ax * by - ay * bx;

		normalAccum[i0] += nx;
		normalAccum[i0 + 1] += ny;
		normalAccum[i0 + 2] += nz;
		normalAccum[i1] += nx;
		normalAccum[i1 + 1] += ny;
		normalAccum[i1 + 2] += nz;
		normalAccum[i2] += nx;
		normalAccum[i2 + 1] += ny;
		normalAccum[i2 + 2] += nz;
	}

	for (let i = 0; i < vertexCount; i++) {
		const i3 = i * 3;
		const nx = normalAccum[i3];
		const ny = normalAccum[i3 + 1];
		const nz = normalAccum[i3 + 2];
		const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
		if (len > 0) {
			normals[i3] = nx / len;
			normals[i3 + 1] = ny / len;
			normals[i3 + 2] = nz / len;
		} else {
			normals[i3] = 0;
			normals[i3 + 1] = 1;
			normals[i3 + 2] = 0;
		}
	}

	return normals;
}

export async function loadGeometryDataFromDuckDB(
	conn: duckdb.AsyncDuckDBConnection
): Promise<GeometricalDataCache> {
	const vertexQuery = `SELECT VertexX as x, VertexY as y, VertexZ as z FROM VertexBuffer`;
	const indexQuery = `SELECT IndexBuffer as index_value FROM IndexBuffer`;
	const meshQuery = `SELECT MeshVertexOffset as vertex_offset, MeshIndexOffset as index_offset FROM Meshes`;
	const materialQuery = `SELECT MaterialRed as red, MaterialGreen as green, MaterialBlue as blue, MaterialAlpha as alpha, MaterialRoughness as roughness, MaterialMetallic as metallic FROM Materials`;
	const transformQuery = `SELECT TransformTX as tx, TransformTY as ty, TransformTZ as tz, TransformQX as qx, TransformQY as qy, TransformQZ as qz, TransformQW as qw, TransformSX as sx, TransformSY as sy, TransformSZ as sz FROM Transforms`;
	const instanceQuery = `SELECT InstanceEntityIndex as entity_index, InstanceMaterialIndex as material_index, InstanceMeshIndex as mesh_index, InstanceTransformIndex as transform_index FROM Instances`;

	const [vertexRes, indexRes, meshRes, materialRes, transformRes, instanceRes] =
		await Promise.all([
			conn.query(vertexQuery),
			conn.query(indexQuery),
			conn.query(meshQuery),
			conn.query(materialQuery),
			conn.query(transformQuery),
			conn.query(instanceQuery),
		]);

	const vertexCount = vertexRes.numRows;
	const positions = new Float32Array(vertexCount * 3);
	const xArray = vertexRes.getChild("x")!.toArray() as Int32Array;
	const yArray = vertexRes.getChild("y")!.toArray() as Int32Array;
	const zArray = vertexRes.getChild("z")!.toArray() as Int32Array;
	for (let i = 0; i < vertexCount; i++) {
		positions[i * 3] = xArray[i] / VERTEX_MULTIPLIER;
		positions[i * 3 + 1] = yArray[i] / VERTEX_MULTIPLIER;
		positions[i * 3 + 2] = zArray[i] / VERTEX_MULTIPLIER;
	}

	const indexCount = indexRes.numRows;
	const indices = new Uint32Array(indexCount);
	const indexValueArray = indexRes
		.getChild("index_value")!
		.toArray() as Int32Array;
	for (let i = 0; i < indexCount; i++) {
		indices[i] = indexValueArray[i];
	}

	const normals = computeVertexNormals(
		positions,
		indices,
		vertexCount,
		indexCount
	);
	const uvs = new Float32Array(vertexCount * 2);

	const meshCount = meshRes.numRows;
	const meshVOArray = meshRes
		.getChild("vertex_offset")!
		.toArray() as Int32Array;
	const meshIOArray = meshRes.getChild("index_offset")!.toArray() as Int32Array;
	const meshVertexOffset = new Uint32Array(meshCount);
	const meshIndexOffset = new Uint32Array(meshCount);
	const meshVertexCount = new Uint32Array(meshCount);
	const meshIndexCount = new Uint32Array(meshCount);

	for (let i = 0; i < meshCount; i++) {
		const vertexOffset = meshVOArray[i];
		const indexOffset = meshIOArray[i];
		meshVertexOffset[i] = vertexOffset;
		meshIndexOffset[i] = indexOffset;

		if (i === meshCount - 1) {
			meshVertexCount[i] = vertexCount - vertexOffset;
			meshIndexCount[i] = indexCount - indexOffset;
		} else {
			meshVertexCount[i] = meshVOArray[i + 1] - vertexOffset;
			meshIndexCount[i] = meshIOArray[i + 1] - indexOffset;
		}
	}

	const materialCount = materialRes.numRows;
	const matRed = materialRes.getChild("red")!.toArray() as Int32Array;
	const matGreen = materialRes.getChild("green")!.toArray() as Int32Array;
	const matBlue = materialRes.getChild("blue")!.toArray() as Int32Array;
	const matAlpha = materialRes.getChild("alpha")!.toArray() as Int32Array;
	const matRoughness = materialRes
		.getChild("roughness")!
		.toArray() as Int32Array;
	const matMetallic = materialRes.getChild("metallic")!.toArray() as Int32Array;
	const materialBaseColor = new Float32Array(materialCount * 4);
	const materialRoughness = new Float32Array(materialCount);
	const materialMetallic = new Float32Array(materialCount);

	for (let i = 0; i < materialCount; i++) {
		materialBaseColor[i * 4] = matRed[i] / MATERIAL_DIVISOR;
		materialBaseColor[i * 4 + 1] = matGreen[i] / MATERIAL_DIVISOR;
		materialBaseColor[i * 4 + 2] = matBlue[i] / MATERIAL_DIVISOR;
		materialBaseColor[i * 4 + 3] = matAlpha[i] / MATERIAL_DIVISOR;
		materialRoughness[i] = matRoughness[i] / MATERIAL_DIVISOR;
		materialMetallic[i] = matMetallic[i] / MATERIAL_DIVISOR;
	}

	const transformCount = transformRes.numRows;
	const txArray = transformRes.getChild("tx")!.toArray() as Int32Array;
	const tyArray = transformRes.getChild("ty")!.toArray() as Int32Array;
	const tzArray = transformRes.getChild("tz")!.toArray() as Int32Array;
	const qxArray = transformRes.getChild("qx")!.toArray() as Int32Array;
	const qyArray = transformRes.getChild("qy")!.toArray() as Int32Array;
	const qzArray = transformRes.getChild("qz")!.toArray() as Int32Array;
	const qwArray = transformRes.getChild("qw")!.toArray() as Int32Array;
	const sxArray = transformRes.getChild("sx")!.toArray() as Int32Array;
	const syArray = transformRes.getChild("sy")!.toArray() as Int32Array;
	const szArray = transformRes.getChild("sz")!.toArray() as Int32Array;
	const transforms = new Float32Array(transformCount * 16);

	for (let i = 0; i < transformCount; i++) {
		const position = new THREE.Vector3(txArray[i], tyArray[i], tzArray[i]);
		const quaternion = new THREE.Quaternion(
			qxArray[i],
			qyArray[i],
			qzArray[i],
			qwArray[i]
		);
		const scale = new THREE.Vector3(sxArray[i], syArray[i], szArray[i]);
		const matrix = new THREE.Matrix4();
		matrix.compose(position, quaternion, scale);
		transforms.set(matrix.elements, i * 16);
	}

	const instanceCount = instanceRes.numRows;
	const instEntity = instanceRes
		.getChild("entity_index")!
		.toArray() as Int32Array;
	const instMat = instanceRes
		.getChild("material_index")!
		.toArray() as Int32Array;
	const instMesh = instanceRes.getChild("mesh_index")!.toArray() as Int32Array;
	const instTrans = instanceRes
		.getChild("transform_index")!
		.toArray() as Int32Array;
	const instanceMeshIndex = new Uint32Array(instanceCount);
	const instanceMaterialIndex = new Uint32Array(instanceCount);
	const instanceTransformIndex = new Uint32Array(instanceCount);
	const instanceEntityIndex = new Uint32Array(instanceCount);

	for (let i = 0; i < instanceCount; i++) {
		instanceMeshIndex[i] = instMesh[i];
		instanceMaterialIndex[i] = instMat[i];
		instanceTransformIndex[i] = instTrans[i];
		instanceEntityIndex[i] = instEntity[i];
	}

	return {
		positions,
		normals,
		uvs,
		indices,
		meshVertexOffset,
		meshVertexCount,
		meshIndexOffset,
		meshIndexCount,
		materialBaseColor,
		materialRoughness,
		materialMetallic,
		transforms,
		instanceMeshIndex,
		instanceMaterialIndex,
		instanceTransformIndex,
		instanceEntityIndex,
		vertexCount,
		indexCount,
		meshCount,
		materialCount,
		transformCount,
		instanceCount,
	};
}
