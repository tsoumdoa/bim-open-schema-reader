import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useImportParquet } from "../hooks/use-import-parquet";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { listAllTableInfoWithColumnInfo } from "../utils/queries";
import { DisplayTableInfo } from "./display-table-info";
import { SimpleErrMessage } from "./simple-err-message";

function DashboardContainer(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	const { headers, rows, runSuccess } = useRunDuckDbQuery(
		props.c,
		listAllTableInfoWithColumnInfo
	);
	return (
		<div className="">
			<div className="text-center">
				<p className="text-lg">{props.fileName}</p>
				<div className="w-[20rem]">
					{runSuccess && <DisplayTableInfo headers={headers} rows={rows} />}
				</div>
			</div>
		</div>
	);
}

function DbDisplay(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	parquetFileEntries: ParquetBlob[];
	fileName: string;
}) {
	const { error, isInitializing, isInitialized } = useImportParquet(
		props.db,
		props.c,
		props.parquetFileEntries
	);
	if (isInitializing) {
		return <div>Initializing...</div>;
	}
	if (isInitialized) {
		return (
			<DashboardContainer db={props.db} c={props.c} fileName={props.fileName} />
		);
	}
	return (
		<SimpleErrMessage
			error={error!}
			customMessage="Error loading parquet files"
		/>
	);
}

export default function AnalyticalDisplay(props: {
	fileName: string;
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
				fileName={props.fileName}
			/>
		);
	}

	return <SimpleErrMessage error={error!} />;
}
