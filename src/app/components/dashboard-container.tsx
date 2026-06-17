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
import { UnloadModelButton } from "./unload-model-button";
import { DataReadinessFilterProvider } from "./use-data-readiness-filter";
import { useDuckDb } from "./use-db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

function DashboardHeader(props: {
	fileName: string;
	bosFileType: BosFileType;
	addQuery: (queryObject: QueryObject) => void;
	disableShortcutRef: React.RefObject<boolean>;
	onQuickExplorerOpen: () => void;
	onUnloadModel: () => void;
	isAddQueryOpen: boolean;
	onAddQueryOpenChange: (open: boolean) => void;
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
			<div className="ml-auto flex items-center gap-1">
				<UnloadModelButton onUnload={props.onUnloadModel} />
				<AddQuery
					addQuery={props.addQuery}
					disableShortcutRef={props.disableShortcutRef}
					onQuickExplorerOpen={props.onQuickExplorerOpen}
					isOpen={props.isAddQueryOpen}
					onOpenChange={props.onAddQueryOpenChange}
				/>
			</div>
		</div>
	);
}

function DashboardMain(props: { onOpenAddQuery: () => void }) {
	const { queryObjects, selectedQueryId, removeQuery, isTemplatePickerActive } =
		useQueryObjCtx();

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
				/>
			) : isTemplatePickerActive ? (
				<div className="flex min-h-[min(50vh,28rem)] items-center justify-center px-4">
					<div className="max-w-sm rounded-xl border border-border bg-muted/30 px-6 py-8 text-center shadow-sm">
						<div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
							<PanelLeft className="size-5 text-muted-foreground" />
						</div>
						<p className="text-sm font-medium text-foreground">
							Choose a template query
						</p>
						<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
							Select one from the sidebar to explore your BIM data.
						</p>
					</div>
				</div>
			) : (
				queryObjects.length === 0 && (
					<div className="mx-auto mt-12 max-w-md text-center text-sm leading-relaxed text-zinc-500">
						No queries yet — open{" "}
						<Button
							variant="link"
							className="h-auto p-0 text-sm"
							onClick={props.onOpenAddQuery}
						>
							Add Query
						</Button>{" "}
						{isMacShortcutLabel()} to get started.
					</div>
				)
			)}
		</div>
	);
}

function isMacShortcutLabel() {
	const isMac =
		typeof navigator !== "undefined" &&
		navigator.platform.toLowerCase().includes("mac");
	return (
		<span className="text-xs text-zinc-400">({isMac ? "⌘K" : "ctrl+K"})</span>
	);
}

export default function DashboardContainer(props: {
	fileName: string;
	bosFileType: BosFileType;
	onUnloadModel: () => void;
}) {
	const disableShortcutRef = useRef<boolean>(true); // NOTE: shortcut need to be disabled cuz the quick explorer view is open at start
	const { isActive, setIsActive } = useQuickExplorer(disableShortcutRef);
	const { addQuery, deleteAll, queryObjects } = useQueryObjCtx();
	const objLength = queryObjects.length;
	const [isAddQueryOpen, setIsAddQueryOpen] = useState(false);

	const handleAddQueryOpenChange = (open: boolean) => {
		setIsAddQueryOpen(open);
		if (open) {
			disableShortcutRef.current = true;
		} else {
			disableShortcutRef.current = false;
		}
	};

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
						onQuickExplorerOpen={() => setIsActive(true)}
						onUnloadModel={props.onUnloadModel}
						isAddQueryOpen={isAddQueryOpen}
						onAddQueryOpenChange={handleAddQueryOpenChange}
					/>

					<div className="flex-1 overflow-auto">
						<DashboardMain
							onOpenAddQuery={() => handleAddQueryOpenChange(true)}
						/>
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
