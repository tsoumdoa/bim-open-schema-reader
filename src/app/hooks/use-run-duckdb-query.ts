import { runQuery } from "../utils/duckdb-wasm-helpers";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useRunDuckDbQuery(
	c: duckdb.AsyncDuckDBConnection,
	initialSql: string
) {
	const [queryTime, setQueryTime] = useState(0);
	const [sql, setSql] = useState(initialSql);

	const { data, isLoading, isError, error, isSuccess } = useQuery({
		queryKey: ["duckdb", sql], // cache key: unique per query
		retry: false,
		queryFn: async () => {
			try {
				const start = performance.now();
				const result = await runQuery(c, sql);
				const end = performance.now();
				setQueryTime(end - start);
				return result;
			} catch (e) {
				throw e;
			}
		},
	});

	const cancelQuery = async () => {
		await c.cancelSent();
	};

	const run = async (nextSql: string) => {
		setSql(nextSql); // triggers fetch for the new key
	};

	const getTableDataAsJson = () => {
		if (!data?.headers || !data?.rows) return [];

		return data.rows.map((row) =>
			data.headers.reduce(
				(obj, header, i) => {
					obj[header] = row[i];
					return obj;
				},
				{} as Record<string, unknown>
			)
		);
	};

	const getTableDataAsCsvOrTsv = (delimiter: "," | "\t") => {
		const jointHeaders = data?.headers.join(delimiter);
		const jointRows = data?.rows.map((row) => row.join(delimiter)).join("\n");
		return `${jointHeaders}\n${jointRows}`;
	};

	return {
		headers: data?.headers ?? [],
		rows: data?.rows ?? [],
		isLoading,
		isError,
		error,
		isSuccess,
		queryTime,
		getTableDataAsCsv: () => getTableDataAsCsvOrTsv(","),
		getTableDataAsTsv: () => getTableDataAsCsvOrTsv("\t"),
		getTableDataAsJson,
		cancelQuery,
		run,
	};
}
