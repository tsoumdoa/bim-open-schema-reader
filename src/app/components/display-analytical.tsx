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
import GoBackToTop from "./go-back-to-top";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

function DashboardHeader(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
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
	queryObjects: QueryObjects;
	addQuery: (queryObject: QueryObject) => void;
	removeQuery: (queryObject: QueryObject) => void;
	duckdbConnection: duckdb.AsyncDuckDBConnection;
}) {
	const [displayExpanded, setDisplayExpanded] = useState(-1);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const escListener = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setDisplayExpanded(-1);
			}
		};
		document.addEventListener("keydown", escListener);

		return () => {
			document.removeEventListener("keydown", escListener);
		};
	}, []);

	const handleScrollBack = () => {
		if (displayExpanded !== -1 && itemRefs.current[displayExpanded]) {
			const headerOffset = 84; // height of fixed header + some offset in px
			const elementPosition =
				itemRefs.current[displayExpanded].getBoundingClientRect().top +
				window.scrollY;
			const offsetPosition = elementPosition - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	};

	useLayoutEffect(() => {
		handleScrollBack();
	}, [displayExpanded]);

	return (
		<div className="flex h-full min-h-0 max-w-full flex-1 flex-col gap-y-2">
			{props.queryObjects.length > 0 &&
				props.queryObjects.map((q, i) => {
					return (
						<div
							ref={(el) => {
								itemRefs.current[i] = el;
							}}
							key={`${i}-${q.queryTitle}`}
						>
							<QueryDisplayItem
								queryObject={q}
								removeObject={props.removeQuery}
								isDuplicated={checkDuplicated(props.queryObjects, q)}
								duckDbConnection={props.duckdbConnection}
								index={i}
								displayExpanded={displayExpanded}
								setDisplayExpanded={setDisplayExpanded}
								handleScrollBack={handleScrollBack}
							/>
						</div>
					);
				})}
			<AddQuery
				addQuery={props.addQuery}
				setDisplayExpanded={setDisplayExpanded}
			/>

			{displayExpanded === -1 && <GoBackToTop />}
		</div>
	);
}

function SideBar(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	fileName: string;
}) {
	return (
		<Sidebar className="h-full pt-11">
			<div className="overflow-auto p-2">
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
		<SidebarProvider className="h-full min-h-0 w-full">
			<SideBar db={props.db} c={props.c} fileName={props.fileName} />
			<main className="relative w-full min-w-0">
				<DashboardHeader db={props.db} c={props.c} fileName={props.fileName} />
				<DashboardMain
					queryObjects={queryObjects}
					addQuery={addQuery}
					removeQuery={removeQuery}
					duckdbConnection={props.c}
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
