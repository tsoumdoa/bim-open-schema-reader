import { runQuery } from "../utils/duckdb-wasm-helpers";
import { useState, useEffect } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

export function useRunDuckDbQuery(
	c: duckdb.AsyncDuckDBConnection,
	query: string
) {
	const [headers, setHeaders] = useState<string[]>([]);
	const [rows, setRows] = useState<(string | number)[][]>([]);
	const [runSuccess, setRunSuccess] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setRunSuccess(false);
		const run = async () => {
			const res = await runQuery(c, query);
			if (!cancelled) {
				setHeaders(res.headers);
				setRows(res.rows);
				setRunSuccess(true);
			}
		};

		run();

		return () => {
			cancelled = true; // cleanup in case component unmounts mid-query
		};
	}, [c, query]);

	return { headers, rows, runSuccess };
}
