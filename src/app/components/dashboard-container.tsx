import { UseExpandDisplay } from "../utils/types";
import {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import SideBarContent from "./side-bar-content";
import { AddQuery } from "./add-query-button";
import QueryDisplayItem from "./query-display-item";
import GoBackToTop from "./go-back-to-top";
import { useDuckDb } from "./use-db";
import { useExpandDisplay } from "../hooks/use-expand-display";
import { useQueryObjCtx } from "./query-obj-provider";
import { useEffect, useRef } from "react";
import { useQuickExplorer } from "../hooks/use-quick-explorer";
import { QuickExplorer } from "./quick-explorer-overlay";
import { createPortal } from "react-dom";
import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { cleanCategoryCount } from "../utils/clean-category-cout";
import SideBar from "./side-bar-content";

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

	const { queryObjects, addQuery, removeQuery, updateQueryTitle, updateQuery } =
		useQueryObjects;
	const useExpDis = props.useExpandDisplay;
	const { queryItemRefs, displayExpanded, setDisplayExpanded } = useExpDis;
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
			<AddQuery addQuery={addQuery} setDisplayExpanded={setDisplayExpanded} />

			{displayExpanded === -1 && <GoBackToTop />}
		</div>
	);
}

export default function DashboardContainer(props: { fileName: string }) {
	const useExpDis = useExpandDisplay();
	const { setDisplayExpanded } = useExpDis;
	const { isActive, setIsActive } = useQuickExplorer(setDisplayExpanded);

	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const categoryGorupMap = cleanCategoryCount(rows);

	return (
		<SidebarProvider className="h-full min-h-0 w-full">
			<SideBar useExpandDisplay={useExpDis} />
			<main className="relative w-full min-w-0">
				<DashboardHeader fileName={props.fileName} />
				<DashboardMain useExpandDisplay={useExpDis} />
			</main>
			{isActive &&
				createPortal(
					<QuickExplorer
						onClose={() => setIsActive(false)}
						categoryGorupMap={categoryGorupMap}
					/>,
					document.body
				)}
		</SidebarProvider>
	);
}
