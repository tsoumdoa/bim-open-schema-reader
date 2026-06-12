import { useQueryObjCtx } from "./query-obj-provider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDownRight } from "lucide-react";

export default function ListQueriesInSidebar(props: {
	deleteAll: () => void;
	objLength: number;
}) {
	const {
		queryObjects,
		selectedQueryId,
		setSelectedQueryId,
		templateQueryGroups,
		isTemplatePickerActive,
		selectTemplateQuery,
	} = useQueryObjCtx();

	if (isTemplatePickerActive) {
		return (
			<div className="flex flex-col gap-3">
				<div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
					<p className="text-xs font-medium text-sidebar-foreground">
						Get started
					</p>
					<p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
						Pick a template query below to run your first analysis.
					</p>
				</div>
				<div className="flex max-h-[calc(100vh-11rem)] flex-col gap-3 overflow-y-auto pr-1">
					{templateQueryGroups.map((group) => (
						<div key={group.queryCategory}>
							<p className="px-1 pb-1 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">
								{group.queryCategory}
							</p>
							<div className="flex flex-col">
								{group.queryObjects.map((query, i) => (
									<button
										key={`${group.queryCategory}-${query.queryTitle}-${i}`}
										onClick={() =>
											selectTemplateQuery({
												...query,
												queryCategory: group.queryCategory,
											})
										}
										className="flex w-full items-center gap-1.5 rounded-sm px-1 py-1 text-left text-xs transition-colors hover:bg-zinc-100"
									>
										<Tooltip delayDuration={100}>
											<TooltipTrigger
												asChild
												onClick={(e) => e.stopPropagation()}
											>
												<span className="inline-flex shrink-0 text-zinc-500 hover:cursor-help">
													<ArrowDownRight className="size-3.5" />
												</span>
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="start"
												className="max-w-56"
											>
												<p>{query.explanation}</p>
											</TooltipContent>
										</Tooltip>
										<span className="truncate">{query.queryTitle}</span>
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div>
			{queryObjects.map((queryObject, i) => {
				const isSelected = selectedQueryId === queryObject.id;
				return (
					<button
						key={queryObject.id ?? `query-object-${i}`}
						onClick={() => setSelectedQueryId(queryObject.id ?? null)}
						className="w-full truncate pl-2 text-sm leading-tight text-left"
					>
						<span className={`text-xs ${isSelected ? "font-bold" : ""}`}>
							Q{i + 1}{" "}
						</span>
						<span className={`text-xs ${isSelected ? "font-bold" : ""}`}>
							{queryObject.queryTitle}
						</span>
					</button>
				);
			})}
			{props.objLength > 2 && (
				<button
					onClick={props.deleteAll}
					className="mt-1 w-full pl-2  font-semibold text-left text-xs text-zinc-400 hover:text-red-400 transition-colors duration-150"
				>
					Delete All
				</button>
			)}
		</div>
	);
}
