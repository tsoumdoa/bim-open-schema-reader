import { runQuery } from "../utils/duckdb-wasm-helpers";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useQuery } from "@tanstack/react-query";

export function useRunDuckDbQuery(
	c: duckdb.AsyncDuckDBConnection,
	query: string
) {
	const { data, isLoading, isError, error, isSuccess } = useQuery({
		queryKey: ["duckdb", query], // cache key: unique per query
		queryFn: () => runQuery(c, query),
		enabled: !!query, // don’t run if query is empty
	});

	return {
		headers: data?.headers ?? [],
		rows: data?.rows ?? [],
		isLoading,
		isError,
		error,
		isSuccess,
	};
}
