import { runQuery } from "../utils/duckdb-wasm-helpers";
import { useState, useEffect } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useQuery } from "@tanstack/react-query";

// export function useRunDuckDbQuery(
// 	c: duckdb.AsyncDuckDBConnection,
// 	query: string
// ) {
// 	const [headers, setHeaders] = useState<string[]>([]);
// 	const [rows, setRows] = useState<(string | number)[][]>([]);
// 	const [runSuccess, setRunSuccess] = useState(false);
//
// 	useEffect(() => {
// 		let cancelled = false;
// 		setRunSuccess(false);
// 		const run = async () => {
// 			const res = await runQuery(c, query);
// 			if (!cancelled) {
// 				setHeaders(res.headers);
// 				setRows(res.rows);
// 				setRunSuccess(true);
// 			}
// 		};
//
// 		run();
//
// 		return () => {
// 			cancelled = true; // cleanup in case component unmounts mid-query
// 		};
// 	}, [c, query]);
//
// 	return { headers, rows, runSuccess };
// }

// // Assume runQuery is your async function that returns { headers, rows }
// async function runQuery(
// 	c: duckdb.AsyncDuckDBConnection,
// 	query: string
// ): Promise<{ headers: string[]; rows: (string | number)[][] }> {
// 	// your existing implementation
// 	const res = await c.query(query);
// 	return {
// 		headers: res.schema.fields.map((f) => f.name),
// 		rows: res.toArray(),
// 	};
// }
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
