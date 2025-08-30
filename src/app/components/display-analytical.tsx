import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useImportParquet } from "../hooks/use-import-parquet";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { listAllTableInfoWithColumnInfo } from "../utils/queries";
import { DisplayTableInfo } from "./display-table-info";
import { SimpleErrMessage } from "./simple-err-message";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import ListDataByCategories from "./list-data-by-cagories";
import SideBarContent from "./side-bar-content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function DashboardContainer(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	return (
		<SidebarProvider>
			<Sidebar className="pt-11 overflow-y-scroll h-full ">
				<div className="p-2">
					<SideBarContent duckDbConnection={props.c} />
				</div>
			</Sidebar>

			<main>
				<div className="flex flex-row items-center justify-between  gap-x-2">
					<SidebarTrigger className="" />
					<p className="text-sm py-2">
						file name: <span className="font-bold">{props.fileName}</span>
					</p>
				</div>
				<div className="flex fiex-row items-start gap-x-2">//todo</div>
			</main>
		</SidebarProvider>
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
	const queryClient = new QueryClient();

	if (!error && loading) {
		return <div>Initializing...</div>;
	}

	if (dbRef.current && connectionRef.current) {
		return (
			<QueryClientProvider client={queryClient}>
				<DbDisplay
					db={dbRef.current}
					c={connectionRef.current}
					parquetFileEntries={props.parquetFileEntries}
					fileName={props.fileName}
				/>
			</QueryClientProvider>
		);
	}

	return <SimpleErrMessage error={error!} />;
}
