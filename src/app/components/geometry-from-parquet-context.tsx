import {
	ParquetBlob,
	GeometryContextValue,
	GeometricalDataCache,
	FilteredGeometryResult,
} from "@/app/utils/types";
import {
	buildFilteredScene,
	clearGeometryObjectCache,
	loadGeometryDataFromDuckDB,
} from "@/lib/geometry-utils";
import * as duckdb from "@duckdb/duckdb-wasm";
import { createContext, useContext, useState, useEffect } from "react";

const GeometryFromParquetContext = createContext<GeometryContextValue | null>(
	null
);

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

				console.log("start loadGeometryDataFromDuckDB");
				console.time("loadGeometryDataFromDuckDB");
				const data = await loadGeometryDataFromDuckDB(
					props.conn,
					props.parquetFileEntries
				);
				console.timeEnd("loadGeometryDataFromDuckDB");

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
