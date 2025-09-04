import { runQuery } from "../utils/duckdb-wasm-helpers";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useRunDuckDbQuery(
	c: duckdb.AsyncDuckDBConnection,
	query: string
) {
	const [queryTime, setQueryTime] = useState(0);

	const { data, isLoading, isError, error, isSuccess } = useQuery({
		queryKey: ["duckdb", query], // cache key: unique per query
		retry: false,
		queryFn: async () => {
			try {
				const start = performance.now();
				const result = await runQuery(c, query);
				const end = performance.now();
				setQueryTime(end - start);
				return result;
			} catch (e) {
				throw e;
			}
		},
	});

	return {
		headers: data?.headers ?? [],
		rows: data?.rows ?? [],
		isLoading,
		isError,
		error,
		isSuccess,
		queryTime,
	};
}
