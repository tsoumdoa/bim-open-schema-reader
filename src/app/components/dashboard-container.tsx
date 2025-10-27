import { useExpandDisplay } from "../hooks/use-expand-display";
import { useQuickExplorer } from "../hooks/use-quick-explorer";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { cleanCategoryCount } from "../utils/clean-category-cout";
import { listCountByCategory } from "../utils/queries";
import { UseExpandDisplay } from "../utils/types";
import { AddQuery } from "./add-query-button";
import ButtonWithConfirmation from "./button-with-confirmation";
import GoBackToTop from "./go-back-to-top";
import QueryDisplayItem from "./query-display-item";
import { useQueryObjCtx } from "./query-obj-provider";
import { QuickExplorer } from "./quick-explorer-overlay";
import SideBar from "./side-bar-content";
import { DataReadinessFilterProvider } from "./use-data-readiness-filter";
import { useDuckDb } from "./use-db";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function DashboardHeader(props: { fileName: string }) {
	return (
		<div className="sticky top-0 z-50 flex flex-row items-center justify-start gap-x-1 bg-white px-2">
			<SidebarTrigger className="" />
			<p className="py-2 text-sm">
				file name: <span className="font-bold">{props.fileName}</span>
			</p>
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

export default function DashboardContainer(props: { fileName: string }) {
	const useExpDis = useExpandDisplay();
	const { setDisplayExpanded } = useExpDis;
	const disableShortcutRef = useRef<boolean>(true); // NOTE: shortcut need to be disabled cuz the qucick explorer view is open at start
	const { isActive, setIsActive } = useQuickExplorer(
		setDisplayExpanded,
		disableShortcutRef
	);
	const { useQueryObjects } = useQueryObjCtx();
	const { addQuery, deleteAll, queryObjects } = useQueryObjects;
	const objLength = queryObjects.length;

	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const categoryGorupMap = cleanCategoryCount(rows);

	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<DataReadinessFilterProvider>
				<SideBar useExpandDisplay={useExpDis} />
				<main className="relative h-full w-full min-w-0">
					<DashboardHeader fileName={props.fileName} />
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
				</main>
				{isActive &&
					createPortal(
						<QuickExplorer
							onClose={() => {
								disableShortcutRef.current = false;
								setIsActive(false);
							}}
							categoryGorupMap={categoryGorupMap}
							disableShortcutRef={disableShortcutRef}
						/>,
						document.body
					)}
			</DataReadinessFilterProvider>
		</SidebarProvider>
	);
}
