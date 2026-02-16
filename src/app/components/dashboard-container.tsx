import { useExpandDisplay } from "../hooks/use-expand-display";
import { useQuickExplorer } from "../hooks/use-quick-explorer";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { cleanCategoryCount } from "../utils/clean-category-count";
import { listCountByCategory } from "../utils/queries";
import { BosFileType, UseExpandDisplay } from "../utils/types";
import { AddQuery } from "./add-query-button";
import { BimViewer } from "./bim-viewer";
import ButtonWithConfirmation from "./button-with-confirmation";
import GoBackToTop from "./go-back-to-top";
import QueryDisplayItem from "./query-display-item";
import { useQueryObjCtx } from "./query-obj-provider";
import { QuickExplorer } from "./quick-explorer-overlay";
import SideBar from "./side-bar-content";
import { DataReadinessFilterProvider } from "./use-data-readiness-filter";
import { useDuckDb } from "./use-db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Box, Eye, EyeOff, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function DashboardHeader(props: {
	fileName: string;
	bosFileType: BosFileType;
	showViewer: boolean;
	onToggleViewer: () => void;
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
			{props.bosFileType === "GEO" && (
				<Button
					variant={props.showViewer ? "default" : "outline"}
					size="sm"
					className="ml-2 h-7 gap-1"
					onClick={props.onToggleViewer}
				>
					{props.showViewer ? (
						<>
							<EyeOff className="h-3 w-3" />
							Hide 3D
						</>
					) : (
						<>
							<Box className="h-3 w-3" />
							Show 3D
						</>
					)}
				</Button>
			)}
		</div>
	);
}

function DashboardMain(props: { useExpandDisplay: UseExpandDisplay }) {
	const { useQueryObjects } = useQueryObjCtx();

	const { queryObjects, removeQuery, updateQueryTitle, updateQuery } =
		useQueryObjects;
	const useExpDis = props.useExpandDisplay;
	const { queryItemRefs, displayExpanded } = useExpDis;
	const prevLenRef = useRef<number>(queryObjects.length);

	useEffect(() => {
		const prevLen = prevLenRef.current;
		const currLen = queryObjects.length;
		if (currLen > prevLen) {
			requestAnimationFrame(() => {
				window.scrollTo({
					top: document.documentElement.scrollHeight,
					behavior: "smooth",
				});
			});
		}
		prevLenRef.current = currLen;
	}, [queryObjects.length]);

	return (
		<div className="flex h-full min-h-0 max-w-full flex-1 flex-col gap-y-2 pr-2 pl-6">
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
								index={i}
								useExpandDisplay={useExpDis}
								updateQueryTitle={updateQueryTitle}
								updateQuery={updateQuery}
							/>
						</div>
					);
				})}

			{displayExpanded === -1 && <GoBackToTop />}
		</div>
	);
}

export default function DashboardContainer(props: {
	fileName: string;
	bosFileType: BosFileType;
}) {
	const useExpDis = useExpandDisplay();
	const { setDisplayExpanded } = useExpDis;
	const disableShortcutRef = useRef<boolean>(true); // NOTE: shortcut need to be disabled cuz the quick explorer view is open at start
	const { isActive, setIsActive } = useQuickExplorer(
		setDisplayExpanded,
		disableShortcutRef
	);
	const { useQueryObjects } = useQueryObjCtx();
	const { addQuery, deleteAll, queryObjects } = useQueryObjects;
	const objLength = queryObjects.length;
	const [showViewer, setShowViewer] = useState(false);
	const [viewerCategory, setViewerCategory] = useState<string | undefined>(
		undefined
	);

	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const categoryGroupMap = cleanCategoryCount(rows);

	useEffect(() => {
		const latestQuery = queryObjects[queryObjects.length - 1];
		if (latestQuery?.isRender3D) {
			setShowViewer(true);
			if (latestQuery.queryTitle.includes("All")) {
				setViewerCategory(undefined);
			} else if (latestQuery.queryTitle.includes("Walls")) {
				setViewerCategory("Walls");
			} else if (latestQuery.queryTitle.includes("Floors")) {
				setViewerCategory("Floors");
			} else if (latestQuery.queryTitle.includes("Columns")) {
				setViewerCategory("Structural Columns");
			} else if (latestQuery.queryTitle.includes("Doors")) {
				setViewerCategory("Doors");
			} else if (latestQuery.queryTitle.includes("Windows")) {
				setViewerCategory("Windows");
			}
		}
	}, [queryObjects]);

	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<DataReadinessFilterProvider>
				<SideBar useExpandDisplay={useExpDis} />
				<main className="relative h-full w-full min-w-0 flex flex-col">
					<DashboardHeader
						fileName={props.fileName}
						bosFileType={props.bosFileType}
						showViewer={showViewer}
						onToggleViewer={() => setShowViewer(!showViewer)}
					/>

					{showViewer && props.bosFileType === "GEO" && (
						<div className="h-[400px] w-full border-b border-gray-200">
							<BimViewer conn={conn} category={viewerCategory} showStats />
						</div>
					)}

					<div className="flex-1 overflow-auto">
						<DashboardMain useExpandDisplay={useExpDis} />
						<div className="px-5 pb-5 gap-x-2 flex">
							<AddQuery
								addQuery={addQuery}
								setDisplayExpanded={setDisplayExpanded}
								disableShortcutRef={disableShortcutRef}
							/>
							{objLength > 2 && (
								<ButtonWithConfirmation action={deleteAll}>
									Delete All Queries
								</ButtonWithConfirmation>
							)}
						</div>
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
