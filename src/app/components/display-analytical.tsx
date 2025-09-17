import { useDuckDB } from "../hooks/use-duckdb";
import {
	ParquetBlob,
	QueryObject,
	QueryObjects,
	UseExpandDisplay,
	UseQueryObjects,
} from "../utils/types";
import { useImportParquet } from "../hooks/use-import-parquet";
import { SimpleErrMessage } from "./simple-err-message";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import SideBarContent from "./side-bar-content";
import { AddQuery } from "./add-query-button";
import { useQueryObjects } from "../hooks/use-query-objects";
import QueryDisplayItem from "./query-display-item";
import GoBackToTop from "./go-back-to-top";
import { DuckDbProvider, useDuckDb } from "./use-db";
import { useExpandDisplay } from "../hooks/use-expand-display";

function DashboardHeader(props: { fileName: string }) {
	return (
		<div className="flex flex-row items-center justify-start gap-x-1">
			<SidebarTrigger className="" />
			<p className="py-2 text-sm">
				file name: <span className="font-bold">{props.fileName}</span>
			</p>
		</div>
	);
}

function checkDuplicated(queryObjects: QueryObjects, queryObject: QueryObject) {
	const duplicated = queryObjects.filter(
		(q) => q.queryTitle === queryObject.queryTitle
	);
	return duplicated.length > 1;
}

function DashboardMain(props: {
	useQueryObjects: UseQueryObjects;
	useExpandDisplay: UseExpandDisplay;
}) {
	const { queryObjects, addQuery, removeQuery } = props.useQueryObjects;
	const useExpDis = props.useExpandDisplay;
	const { queryItemRefs, displayExpanded, setDisplayExpanded } = useExpDis;

	return (
		<div className="flex h-full min-h-0 max-w-full flex-1 flex-col gap-y-2">
			{queryObjects.length > 0 &&
				queryObjects.map((q, i) => {
					return (
						<div
							ref={(el) => {
								queryItemRefs.current[i] = el;
							}}
							key={q.id}
						>
							<QueryDisplayItem
								queryObject={q}
								removeObject={removeQuery}
								isDuplicated={checkDuplicated(queryObjects, q)}
								index={i}
								useExpandDisplay={useExpDis}
							/>
						</div>
					);
				})}
			<AddQuery addQuery={addQuery} setDisplayExpanded={setDisplayExpanded} />

			{displayExpanded === -1 && <GoBackToTop />}
		</div>
	);
}

function SideBar(props: {
	useQueryObjects: UseQueryObjects;
	useExpandDisplay: UseExpandDisplay;
}) {
	return (
		<Sidebar className="h-full pt-11">
			<div className="overflow-auto p-2">
				<SideBarContent
					useQueryObjects={props.useQueryObjects}
					useExpandDisplay={props.useExpandDisplay}
				/>
			</div>
		</Sidebar>
	);
}

function DashboardContainer(props: { fileName: string }) {
	const useQueryObj = useQueryObjects();
	const useExpDis = useExpandDisplay();
	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<SideBar useQueryObjects={useQueryObj} useExpandDisplay={useExpDis} />
			<main className="relative w-full min-w-0">
				<DashboardHeader fileName={props.fileName} />
				<DashboardMain
					useQueryObjects={useQueryObj}
					useExpandDisplay={useExpDis}
				/>
			</main>
		</SidebarProvider>
	);
}

function DbDisplay(props: {
	parquetFileEntries: ParquetBlob[];
	fileName: string;
}) {
	const { db, conn } = useDuckDb();
	const { error, isInitializing, isInitialized } = useImportParquet(
		db,
		conn,
		props.parquetFileEntries
	);
	if (isInitializing) {
		return <div>Initializing...</div>;
	}
	if (isInitialized) {
		return <DashboardContainer fileName={props.fileName} />;
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
			<DuckDbProvider db={dbRef.current} c={connectionRef.current}>
				<DbDisplay
					parquetFileEntries={props.parquetFileEntries}
					fileName={props.fileName}
				/>
			</DuckDbProvider>
		);
	}

	return <SimpleErrMessage error={error!} />;
}
