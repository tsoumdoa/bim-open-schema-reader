import { useQuickExplorer } from "../hooks/use-quick-explorer";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { cleanCategoryCount } from "../utils/clean-category-count";
import { listCountByCategory } from "../utils/init-queries";
import { BosFileType, QueryObject } from "../utils/types";
import { AddQuery } from "./add-query-button";
import QueryDisplayItem from "./query-display-item";
import { useQueryObjCtx } from "./query-obj-provider";
import { QuickExplorer } from "./quick-explorer-overlay";
import SideBar from "./side-bar-content";
import { DataReadinessFilterProvider } from "./use-data-readiness-filter";
import { useDuckDb } from "./use-db";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRef } from "react";
import { createPortal } from "react-dom";

function DashboardHeader(props: {
	fileName: string;
	bosFileType: BosFileType;
	addQuery: (queryObject: QueryObject) => void;
	disableShortcutRef: React.RefObject<boolean>;
}) {
	return (
		<div className="sticky top-0 z-50 flex flex-row items-center justify-start gap-x-1 bg-white px-2">
			<SidebarTrigger className="" />
			<p className="py-2 text-sm">
				file name: <span className="font-bold">{props.fileName}</span>
			</p>
			<Badge
				className="text-xs text-neutral-800  h-5 min-w-5 rounded-full px-1"
				variant="outline"
			>
				{props.bosFileType === "GEO" ? "Geometry Data" : "Non Geometry Data"}
			</Badge>
			<div className="ml-auto flex items-center">
				<AddQuery
					addQuery={props.addQuery}
					disableShortcutRef={props.disableShortcutRef}
				/>
			</div>
		</div>
	);
}

function DashboardMain() {
	const {
		queryObjects,
		selectedQueryId,
		removeQuery,
		updateQueryTitle,
		updateQuery,
	} = useQueryObjCtx();

	const selectedQuery = queryObjects.find(
		(q: QueryObject) => q.id === selectedQueryId
	);
	const selectedIndex = queryObjects.findIndex(
		(q: QueryObject) => q.id === selectedQueryId
	);

	return (
		<div className="  pr-4 pl-4">
			{selectedQuery ? (
				<QueryDisplayItem
					key={selectedQuery.id}
					queryObject={selectedQuery}
					removeObject={removeQuery}
					index={selectedIndex}
					updateQueryTitle={updateQueryTitle}
					updateQuery={updateQuery}
				/>
			) : (
				queryObjects.length === 0 && (
					<div className="text-sm text-gray-500 m-auto">
						No query selected. Click a query in the sidebar to view it.
					</div>
				)
			)}
		</div>
	);
}

export default function DashboardContainer(props: {
	fileName: string;
	bosFileType: BosFileType;
}) {
	const disableShortcutRef = useRef<boolean>(true); // NOTE: shortcut need to be disabled cuz the quick explorer view is open at start
	const { isActive, setIsActive } = useQuickExplorer(disableShortcutRef);
	const { addQuery, deleteAll, queryObjects } = useQueryObjCtx();
	const objLength = queryObjects.length;

	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const categoryGroupMap = cleanCategoryCount(rows);

	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<DataReadinessFilterProvider>
				<SideBar deleteAll={deleteAll} objLength={objLength} />
				<main className="relative h-full w-full min-w-0 flex flex-col">
					<DashboardHeader
						fileName={props.fileName}
						bosFileType={props.bosFileType}
						addQuery={addQuery}
						disableShortcutRef={disableShortcutRef}
					/>

					<div className="flex-1 overflow-auto">
						<DashboardMain />
					</div>
				</main>
				{isActive &&
					createPortal(
						<QuickExplorer
							onClose={() => {
								disableShortcutRef.current = false;
								setIsActive(false);
							}}
							categoryGroupMap={categoryGroupMap}
							disableShortcutRef={disableShortcutRef}
						/>,
						document.body
					)}
			</DataReadinessFilterProvider>
		</SidebarProvider>
	);
}
