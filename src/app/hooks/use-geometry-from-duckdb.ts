import {
	VertexData,
	IndexData,
	MeshData,
	MaterialData,
	TransformData,
	GeometryInstance,
	createThreeMaterial,
	createTransformMatrix,
	createBufferGeometryFromMesh,
	batchInstancesByMaterialAndGeometry,
	convertZUpToYUp,
	BatchedGeometry,
} from "@/lib/geometry-utils";
import { useState, useEffect, useMemo } from "react";
import * as THREE from "three";

function rowsToVertexData(rows: (string | number)[][]): VertexData[] {
	return rows.map((row) => ({
		index: row[0] as number,
		x: row[1] as number,
		y: row[2] as number,
		z: row[3] as number,
	}));
}

function rowsToIndexData(rows: (string | number)[][]): IndexData[] {
	return rows.map((row) => ({
		index: row[0] as number,
		index_value: row[1] as number,
	}));
}

function rowsToMeshData(rows: (string | number)[][]): MeshData[] {
	return rows.map((row) => ({
		index: row[0] as number,
		vertex_offset: row[1] as number,
		index_offset: row[2] as number,
	}));
}

function rowsToMaterialData(rows: (string | number)[][]): MaterialData[] {
	return rows.map((row) => ({
		index: row[0] as number,
		red: row[1] as number,
		green: row[2] as number,
		blue: row[3] as number,
		alpha: row[4] as number,
		roughness: row[5] as number,
		metallic: row[6] as number,
	}));
}

function rowsToTransformData(rows: (string | number)[][]): TransformData[] {
	return rows.map((row) => ({
		index: row[0] as number,
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

function rowsToInstanceData(rows: (string | number)[][]): {
	instance_index: number;
	entity_index: number;
	material_index: number;
	mesh_index: number;
	transform_index: number;
	vertex_offset: number;
	index_offset: number;
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
	red: number;
	green: number;
	blue: number;
	alpha: number;
	roughness: number;
	metallic: number;
}[] {
	return rows.map((row) => ({
		instance_index: row[0] as number,
		entity_index: row[1] as number,
		material_index: row[2] as number,
		mesh_index: row[3] as number,
		transform_index: row[4] as number,
		vertex_offset: row[5] as number,
		index_offset: row[6] as number,
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

export interface UseGeometryResult {
	loading: boolean;
	error: Error | null;
	scene: THREE.Group | null;
	instanceCount: number;
}

export function useGeometryFromDuckDB(
	conn: any,
	category?: string
): UseGeometryResult {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [scene, setScene] = useState<THREE.Group | null>(null);
	const [instanceCount, setInstanceCount] = useState(0);

	useEffect(() => {
		if (!conn) {
			console.log("useGeometryFromDuckDB: conn is null, returning");
			return;
		}

		console.log(
			"useGeometryFromDuckDB: fetching geometry, category:",
			category
		);

		const fetchGeometry = async () => {
			try {
				setLoading(true);

				// First, check if the views exist
				const checkViews = await conn.query(`
					SELECT table_name FROM information_schema.tables 
					WHERE table_name LIKE 'denorm_%' AND table_type = 'VIEW'
				`);
				const views = checkViews.toArray().map(Object.values);
				console.log("useGeometryFromDuckDB: available denorm views:", views);

				if (views.length === 0) {
					// Check all tables
					const checkAllTables = await conn.query(`
						SELECT table_name FROM information_schema.tables 
						WHERE table_type = 'VIEW'
					`);
					console.log(
						"useGeometryFromDuckDB: all views:",
						checkAllTables.toArray().map(Object.values)
					);
				}

				const vertexQuery = `SELECT index, x, y, z FROM denorm_vertex_buffer_view ORDER BY index`;
				const indexQuery = `SELECT index, index_value FROM denorm_index_buffer_view ORDER BY index`;
				const meshQuery = `SELECT index, vertex_offset, index_offset FROM denorm_meshes_view ORDER BY index`;
				const materialQuery = `SELECT index, red, green, blue, alpha, roughness, metallic FROM denorm_materials_view ORDER BY index`;
				const transformQuery = `SELECT index, tx, ty, tz, qx, qy, qz, qw, sx, sy, sz FROM denorm_transforms_view ORDER BY index`;

				let instanceQuery = `
					SELECT 
						i.instance_index,
						i.entity_index,
						i.material_index,
						i.mesh_index,
						i.transform_index,
						m.vertex_offset,
						m.index_offset,
						t.tx, t.ty, t.tz,
						t.qx, t.qy, t.qz, t.qw,
						t.sx, t.sy, t.sz,
						mat.red, mat.green, mat.blue,
						mat.alpha, mat.roughness, mat.metallic
					FROM denorm_geometry_elements i
					LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
					LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
					LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
				`;

				if (category) {
					instanceQuery += ` WHERE i.category = '${category}'`;
				}

				instanceQuery += ` ORDER BY i.instance_index`;

				const [
					vertexRes,
					indexRes,
					meshRes,
					materialRes,
					transformRes,
					instanceRes,
				] = await Promise.all([
					conn.query(vertexQuery),
					conn.query(indexQuery),
					conn.query(meshQuery),
					conn.query(materialQuery),
					conn.query(transformQuery),
					conn.query(instanceQuery),
				]);

				const vertices = rowsToVertexData(
					vertexRes.toArray().map(Object.values)
				);
				const indices = rowsToIndexData(indexRes.toArray().map(Object.values));
				const meshes = rowsToMeshData(meshRes.toArray().map(Object.values));
				const materials = rowsToMaterialData(
					materialRes.toArray().map(Object.values)
				);
				const transforms = rowsToTransformData(
					transformRes.toArray().map(Object.values)
				);
				const instanceData = rowsToInstanceData(
					instanceRes.toArray().map(Object.values)
				);

				setInstanceCount(instanceData.length);

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
						const mesh = new THREE.Mesh(
							batch.geometry,
							batch.instances[0].material
						);
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
				setScene(group);
				setError(null);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchGeometry();
	}, [conn, category]);

	return { loading, error, scene, instanceCount };
}
