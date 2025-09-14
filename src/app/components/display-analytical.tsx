import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob, QueryObject, QueryObjects } from "../utils/types";
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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DuckDbProvider, useDuckDb } from "./use-db";

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

function DashboardMain() {
	const [displayExpanded, setDisplayExpanded] = useState(-1);
	const { queryObjects, addQuery, removeQuery } = useQueryObjects();
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
			{queryObjects.length > 0 &&
				queryObjects.map((q, i) => {
					return (
						<div
							ref={(el) => {
								itemRefs.current[i] = el;
							}}
							key={q.id}
						>
							<QueryDisplayItem
								queryObject={q}
								removeObject={removeQuery}
								isDuplicated={checkDuplicated(queryObjects, q)}
								index={i}
								displayExpanded={displayExpanded}
								setDisplayExpanded={setDisplayExpanded}
								handleScrollBack={handleScrollBack}
							/>
						</div>
					);
				})}
			<AddQuery addQuery={addQuery} setDisplayExpanded={setDisplayExpanded} />

			{displayExpanded === -1 && <GoBackToTop />}
		</div>
	);
}

function SideBar() {
	return (
		<Sidebar className="h-full pt-11">
			<div className="overflow-auto p-2">
				<SideBarContent />
			</div>
		</Sidebar>
	);
}

function DashboardContainer(props: { fileName: string }) {
	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<SideBar />
			<main className="relative w-full min-w-0">
				<DashboardHeader fileName={props.fileName} />
				<DashboardMain />
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
