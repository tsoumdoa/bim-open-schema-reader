import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useImportParquet } from "../hooks/use-import-parquet";

function DbDisplay(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	parquetFileEntries: ParquetBlob[];
}) {
	const { hasRun, isInitializing, isInitialized } = useImportParquet(
		props.db,
		props.c,
		props.parquetFileEntries
	);
	return <div>DB Display</div>;
}

export default function AnalyticalDisplay(props: {
	parquetFileEntries: ParquetBlob[];
}) {
	const { dbRef, connectionRef, error, loading } = useDuckDB();

	if (!error && loading) {
		return <div>Initializing...</div>;
	}

	if (dbRef.current && connectionRef.current) {
		return (
			<DbDisplay
				db={dbRef.current}
				c={connectionRef.current}
				parquetFileEntries={props.parquetFileEntries}
			/>
		);
	}

	return <div>Something went wrong, try again</div>;
}
