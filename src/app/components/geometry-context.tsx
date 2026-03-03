import {
	indexQuery,
	instanceQuery,
	materialQuery,
	meshQuery,
	transformQuery,
	vertexQuery,
} from "../sql/util-geometry";
import { GeometricalDataCache, GeometryContextValue } from "../utils/types";
import {
	buildFilteredScene,
	rowsToIndexData,
	rowsToInstanceData,
	rowsToMaterialData,
	rowsToMeshData,
	rowsToTransformData,
	rowsToVertexData,
} from "@/lib/geometry-utils";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useQueries } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const GeometryContext = createContext<GeometryContextValue | null>(null);

export function GeometryProvider(props: {
	children: React.ReactNode;
	conn: duckdb.AsyncDuckDBConnection;
}) {
	const res = useQueries({
		queries: [
			{
				queryKey: ["vertices"],
				queryFn: async () => {
					const res = await props.conn.query(vertexQuery);
					return rowsToVertexData(res.toArray().map(Object.values));
				},
			},
			{
				queryKey: ["indices"],
				queryFn: async () => {
					const res = await props.conn.query(indexQuery);
					return rowsToIndexData(res.toArray().map(Object.values));
				},
			},
			{
				queryKey: ["meshes"],
				queryFn: async () => {
					const res = await props.conn.query(meshQuery);
					return rowsToMeshData(res.toArray().map(Object.values));
				},
			},
			{
				queryKey: ["materials"],
				queryFn: async () => {
					const res = await props.conn.query(materialQuery);
					return rowsToMaterialData(res.toArray().map(Object.values));
				},
			},
			{
				queryKey: ["transforms"],
				queryFn: async () => {
					const res = await props.conn.query(transformQuery);
					return rowsToTransformData(res.toArray().map(Object.values));
				},
			},
			{
				queryKey: ["instanceData"],
				queryFn: async () => {
					const res = await props.conn.query(instanceQuery);
					return rowsToInstanceData(res.toArray().map(Object.values));
				},
			},
		],
	});
	const loading = res.some((r) => r.isLoading);
	const error = res.find((r) => r.error)?.error ?? null;

	const [
		verticesQuery,
		indicesQuery,
		meshesQuery,
		materialsQuery,
		transformsQuery,
		instancesQuery,
	] = res;

	const cache: GeometricalDataCache | null =
		verticesQuery.data &&
			indicesQuery.data &&
			meshesQuery.data &&
			materialsQuery.data &&
			transformsQuery.data &&
			instancesQuery.data
			? {
				vertices: verticesQuery.data,
				indices: indicesQuery.data,
				meshes: meshesQuery.data,
				materials: materialsQuery.data,
				transforms: transformsQuery.data,
				instances: instancesQuery.data,
			}
			: null;

	const getFilteredScene = (entityIndices: number[]) =>
		buildFilteredScene(entityIndices, cache);

	return (
		<GeometryContext.Provider value={{ loading, error, getFilteredScene }}>
			{props.children}
		</GeometryContext.Provider>
	);
}

export function useGeometry() {
	const context = useContext(GeometryContext);
	if (!context) {
		throw new Error("useGeometry must be used within a GeometryProvider");
	}
	return context;
}
