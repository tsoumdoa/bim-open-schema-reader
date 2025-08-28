import * as duckdb from "@duckdb/duckdb-wasm";
import { useEffect, useRef, useState } from "react";
import { ParquetBlob } from "../utils/types";
import { initTables, registerParquetFile } from "../utils/duckdb-wasm-helpers";

export function useImportParquet(
	db: duckdb.AsyncDuckDB,
	c: duckdb.AsyncDuckDBConnection,
	parquetFileEntries: ParquetBlob[]
) {
	const hasRun = useRef(false); // kidna have to do this due to react strict mode
	const [isInitializing, setIsInitializing] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const run = async () => {
			if (hasRun.current) return;
			hasRun.current = true;
			try {
				await Promise.all(
					parquetFileEntries.map(async (entry, i) => {
						registerParquetFile(db, entry);
					})
				);
				await initTables(c);
				setIsInitializing(false);
				setIsInitialized(true);
			} catch (err) {
				setIsInitializing(false);
				setError(err as Error);
			}
		};

		run();
	}, [db, c, parquetFileEntries]);

	return { error, isInitializing, isInitialized };
}
