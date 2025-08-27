import * as duckdb from "@duckdb/duckdb-wasm";
import { useEffect, useRef, useState } from "react";
import { ParquetBlob } from "../utils/types";
import { importParquetFromBuffer } from "../utils/duckdb-wasm-helpers";

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
				//promise.all is ok cuz it rejects if any of the promises rejects
				//(i.e. promise.allsettled allow partial success, which is not what we want here)
				await Promise.all(
					parquetFileEntries.map(async (entry) => {
						const { filename, parquet } = entry;
						await importParquetFromBuffer(
							db,
							c,
							parquet,
							filename.replace(".parquet", ""),
							filename
						);
					})
				);
				setIsInitialized(true);
			} catch (err) {
				setError(err as Error);
			} finally {
				setIsInitializing(false);
			}
		};

		run();
	}, [db, c, parquetFileEntries]);

	return { error, isInitializing, isInitialized };
}
