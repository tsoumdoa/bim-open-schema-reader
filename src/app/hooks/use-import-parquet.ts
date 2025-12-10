import { initTables, registerParquetFile } from "../utils/duckdb-wasm-helpers";
import { BosFileType, ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useEffect, useRef, useState } from "react";

export function useImportParquet(
	db: duckdb.AsyncDuckDB,
	c: duckdb.AsyncDuckDBConnection,
	parquetFileEntries: ParquetBlob[],
	bosFileType: BosFileType
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
					parquetFileEntries.map(async (entry) => {
						registerParquetFile(db, entry);
					})
				);
				await initTables(c, bosFileType);
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
