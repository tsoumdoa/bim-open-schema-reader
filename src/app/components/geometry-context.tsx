"use client";

import {
	indexQuery,
	instanceQuery,
	materialQuery,
	meshQuery,
	transformQuery,
	vertexQuery,
} from "../sql/util-geometry";
import {
	FilteredGeometryResult,
	GeometryCacheData,
	GeometryContextValue,
} from "../utils/types";
import {
	buildSceneFromInstances,
	rowsToIndexData,
	rowsToInstanceData,
	rowsToMaterialData,
	rowsToMeshData,
	rowsToTransformData,
	rowsToVertexData,
} from "@/lib/geometry-utils";
import { createContext, useContext, useEffect, useState } from "react";

const GeometryContext = createContext<GeometryContextValue | null>(null);

export function GeometryProvider(props: {
	children: React.ReactNode;
	conn: any;
}) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [cache, setCache] = useState<GeometryCacheData | null>(null);

	useEffect(() => {
		if (!props.conn) return;

		const fetchGeometry = async () => {
			try {
				setLoading(true);

				const [
					vertexRes,
					indexRes,
					meshRes,
					materialRes,
					transformRes,
					instanceRes,
				] = await Promise.all([
					props.conn.query(vertexQuery),
					props.conn.query(indexQuery),
					props.conn.query(meshQuery),
					props.conn.query(materialQuery),
					props.conn.query(transformQuery),
					props.conn.query(instanceQuery),
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

				setCache({
					vertices,
					indices,
					meshes,
					materials,
					transforms,
					instanceData,
				});
				setError(null);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchGeometry();
	}, [props.conn]);

	const getFilteredScene = (
		entityIndices: number[]
	): FilteredGeometryResult => {
		if (!cache) {
			return { scene: null, instanceCount: 0, totalCount: 0 };
		}

		const entityIndexSet = new Set(entityIndices);
		const filteredInstances = cache.instanceData.filter((inst) =>
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
