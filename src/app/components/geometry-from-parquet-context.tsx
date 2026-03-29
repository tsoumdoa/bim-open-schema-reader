import { ParquetBlob, GeometryContextValue } from "@/app/utils/types";
import {
	FilteredGeometryResult,
	InstanceData,
	VertexData,
	IndexData,
	MeshData,
	MaterialData,
	TransformData,
	GeometricalDataCache,
} from "@/app/utils/types";
import {
	buildFilteredScene,
	clearGeometryObjectCache,
} from "@/lib/geometry-utils";
import * as duckdb from "@duckdb/duckdb-wasm";
import { createContext, useContext, useState, useEffect } from "react";

const VERTEX_MULTIPLIER = 10000.0;
const MATERIAL_DIVISOR = 255.0;

const GeometryFromParquetContext = createContext<GeometryContextValue | null>(
	null
);

async function loadGeometryDataFromDuckDB(
	conn: duckdb.AsyncDuckDBConnection,
	_parquetFileEntries: ParquetBlob[]
): Promise<GeometricalDataCache> {
	const vertexQuery = `SELECT VertexX / ${VERTEX_MULTIPLIER} as x, VertexY / ${VERTEX_MULTIPLIER} as y, VertexZ / ${VERTEX_MULTIPLIER} as z FROM VertexBuffer`;
	const indexQuery = `SELECT IndexBuffer as index_value FROM IndexBuffer`;
	const meshQuery = `SELECT MeshVertexOffset as vertex_offset, MeshIndexOffset as index_offset FROM Meshes`;
	const materialQuery = `SELECT MaterialRed / ${MATERIAL_DIVISOR} as red, MaterialGreen / ${MATERIAL_DIVISOR} as green, MaterialBlue / ${MATERIAL_DIVISOR} as blue, MaterialAlpha / ${MATERIAL_DIVISOR} as alpha, MaterialRoughness / ${MATERIAL_DIVISOR} as roughness, MaterialMetallic / ${MATERIAL_DIVISOR} as metallic FROM Materials`;
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

	const xArray = vertexRes.getChild("x")!.toArray() as Float64Array;
	const yArray = vertexRes.getChild("y")!.toArray() as Float64Array;
	const zArray = vertexRes.getChild("z")!.toArray() as Float64Array;
	const vertexCount = xArray.length;

	const vertices: VertexData[] = new Array(vertexCount);
	for (let i = 0; i < vertexCount; i++) {
		vertices[i] = { index: i, x: xArray[i], y: yArray[i], z: zArray[i] };
	}

	const indexValueArray = indexRes
		.getChild("index_value")!
		.toArray() as Int32Array;
	const indexCount = indexValueArray.length;
	const indices: IndexData[] = new Array(indexCount);
	for (let i = 0; i < indexCount; i++) {
		indices[i] = { index: i, index_value: indexValueArray[i] };
	}

	const meshVOArray = meshRes
		.getChild("vertex_offset")!
		.toArray() as Int32Array;
	const meshIOArray = meshRes.getChild("index_offset")!.toArray() as Int32Array;
	const meshCount = meshVOArray.length;
	const meshes: MeshData[] = new Array(meshCount);
	for (let i = 0; i < meshCount; i++) {
		meshes[i] = {
			index: i,
			vertex_offset: meshVOArray[i],
			index_offset: meshIOArray[i],
		};
	}

	const matRed = materialRes.getChild("red")!.toArray() as Float64Array;
	const matGreen = materialRes.getChild("green")!.toArray() as Float64Array;
	const matBlue = materialRes.getChild("blue")!.toArray() as Float64Array;
	const matAlpha = materialRes.getChild("alpha")!.toArray() as Float64Array;
	const matRoughness = materialRes
		.getChild("roughness")!
		.toArray() as Float64Array;
	const matMetallic = materialRes
		.getChild("metallic")!
		.toArray() as Float64Array;
	const matCount = matRed.length;
	const materials: MaterialData[] = new Array(matCount);
	for (let i = 0; i < matCount; i++) {
		materials[i] = {
			index: i,
			red: matRed[i],
			green: matGreen[i],
			blue: matBlue[i],
			alpha: matAlpha[i],
			roughness: matRoughness[i],
			metallic: matMetallic[i],
		};
	}

	const txArray = transformRes.getChild("tx")!.toArray() as Float64Array;
	const tyArray = transformRes.getChild("ty")!.toArray() as Float64Array;
	const tzArray = transformRes.getChild("tz")!.toArray() as Float64Array;
	const qxArray = transformRes.getChild("qx")!.toArray() as Float64Array;
	const qyArray = transformRes.getChild("qy")!.toArray() as Float64Array;
	const qzArray = transformRes.getChild("qz")!.toArray() as Float64Array;
	const qwArray = transformRes.getChild("qw")!.toArray() as Float64Array;
	const sxArray = transformRes.getChild("sx")!.toArray() as Float64Array;
	const syArray = transformRes.getChild("sy")!.toArray() as Float64Array;
	const szArray = transformRes.getChild("sz")!.toArray() as Float64Array;
	const transformCount = txArray.length;
	const transforms: TransformData[] = new Array(transformCount);
	for (let i = 0; i < transformCount; i++) {
		transforms[i] = {
			index: i,
			tx: txArray[i],
			ty: tyArray[i],
			tz: tzArray[i],
			qx: qxArray[i],
			qy: qyArray[i],
			qz: qzArray[i],
			qw: qwArray[i],
			sx: sxArray[i],
			sy: syArray[i],
			sz: szArray[i],
		};
	}

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
	const instCount = instEntity.length;
	const instances: InstanceData[] = new Array(instCount);
	for (let i = 0; i < instCount; i++) {
		const mi = instMesh[i];
		const ti = instTrans[i];
		const mai = instMat[i];
		instances[i] = {
			instance_index: i,
			entity_index: instEntity[i],
			material_index: mai,
			mesh_index: mi,
			transform_index: ti,
			vertex_offset: meshes[mi]?.vertex_offset ?? 0,
			index_offset: meshes[mi]?.index_offset ?? 0,
			tx: transforms[ti]?.tx ?? 0,
			ty: transforms[ti]?.ty ?? 0,
			tz: transforms[ti]?.tz ?? 0,
			qx: transforms[ti]?.qx ?? 0,
			qy: transforms[ti]?.qy ?? 0,
			qz: transforms[ti]?.qz ?? 0,
			qw: transforms[ti]?.qw ?? 1,
			sx: transforms[ti]?.sx ?? 1,
			sy: transforms[ti]?.sy ?? 1,
			sz: transforms[ti]?.sz ?? 1,
			red: materials[mai]?.red ?? 1,
			green: materials[mai]?.green ?? 1,
			blue: materials[mai]?.blue ?? 1,
			alpha: materials[mai]?.alpha ?? 1,
			roughness: materials[mai]?.roughness ?? 0.5,
			metallic: materials[mai]?.metallic ?? 0,
		};
	}

	return { vertices, indices, meshes, materials, transforms, instances };
}

export function GeometryProviderFromParquet(props: {
	children: React.ReactNode;
	parquetFileEntries: ParquetBlob[];
	db: duckdb.AsyncDuckDB;
	conn: duckdb.AsyncDuckDBConnection;
}) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [cache, setCache] = useState<GeometricalDataCache | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				clearGeometryObjectCache();

				const data = await loadGeometryDataFromDuckDB(
					props.conn,
					props.parquetFileEntries
				);

				if (cancelled) return;

				setCache(data);
				setError(null);
			} catch (err) {
				if (cancelled) return;
				setError(err as Error);
			} finally {
				if (cancelled) return;
				setLoading(false);
			}
		};

		load();

		return () => {
			cancelled = true;
		};
	}, [props.conn, props.parquetFileEntries]);

	const getFilteredScene = (entityIndices: number[]): FilteredGeometryResult =>
		buildFilteredScene(entityIndices, cache);

	return (
		<GeometryFromParquetContext.Provider
			value={{ loading, error, getFilteredScene }}
		>
			{props.children}
		</GeometryFromParquetContext.Provider>
	);
}

export function useGeometryFromParquetCtx() {
	const context = useContext(GeometryFromParquetContext);
	if (!context) {
		throw new Error(
			"useGeometryFromParquetCtx must be used within GeometryProviderFromParquet"
		);
	}
	return context;
}
