import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob, QueryObject, QueryObjects } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useImportParquet } from "../hooks/use-import-parquet";
import { SimpleErrMessage } from "./simple-err-message";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import SideBarContent from "./side-bar-content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddQuery } from "./add-query-button";
import { useQueryObjects } from "../hooks/use-query-objects";
import QueryDisplayItem from "./query-display-item";

function DashboardHeader(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	return (
		<div className="flex flex-row items-center justify-start  gap-x-1">
			<SidebarTrigger className="" />
			<p className="text-sm py-2">
				file name: <span className="font-bold">{props.fileName}</span>
			</p>
		</div>
	);
}

function DashboardMain(props: {
	queryObjects: QueryObjects;
	addQuery: (queryObject: QueryObject) => void;
	removeQuery: (queryObject: QueryObject) => void;
}) {
	return (
		<div className="flex flex-col items-start gap-y-2 ">
			{props.queryObjects.length > 0 &&
				props.queryObjects.map((q, i) => {
					return (
						<QueryDisplayItem key={`${i}-${q.queryTile}`} queryObject={q} />
					);
				})}
			<AddQuery addQuery={props.addQuery} />
		</div>
	);
}

function SideBar(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	return (
		<Sidebar className="pt-11 overflow-y-scroll h-full ">
			<div className="p-2">
				<SideBarContent duckDbConnection={props.c} />
			</div>
		</Sidebar>
	);
}

function DashboardContainer(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	const { queryObjects, addQuery, removeQuery } = useQueryObjects();
	return (
		<SidebarProvider>
			<SideBar db={props.db} c={props.c} fileName={props.fileName} />
			<main>
				<DashboardHeader db={props.db} c={props.c} fileName={props.fileName} />
				<DashboardMain
					queryObjects={queryObjects}
					addQuery={addQuery}
					removeQuery={removeQuery}
				/>
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
