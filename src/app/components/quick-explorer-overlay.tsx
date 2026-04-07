import { useKeywordFilter } from "../hooks/use-keyword-filter";
import { GeneralCategoryObj, generalCategory } from "../utils/types";
import DropDownMenu from "./data-category-list-dropdown";
import DataReadinessIcon from "./data-readiness-icon";
import FilterByDataReadiness from "./filter-by-data-readiness";
import KeywordFilter from "./keyword-filter";
import { useDataReadinessFilter } from "./use-data-readiness-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { RefObject, useState } from "react";

function ShortcutHelp() {
	return (
		<div className="text-muted-foreground mt-4 border-t pt-4 text-center text-sm">
			Press{" "}
			<kbd className="bg-muted rounded px-2 py-1 font-mono text-xs">Shift</kbd>{" "}
			+{" "}
			<kbd className="bg-muted rounded px-2 py-1 font-mono text-xs">Space</kbd>{" "}
			or <kbd className="bg-muted rounded px-2 py-1 font-mono text-xs">Esc</kbd>{" "}
			to close
		</div>
	);
}

function BlurredBackdrop(props: { children: React.ReactNode }) {
	return (
		<div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center duration-200">
			<div className="absolute inset-0 bg-neutral-100/80 backdrop-blur-xs" />
			<div
				className="animate-in zoom-in-95 relative z-10 w-full max-w-6xl px-8 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				{props.children}
			</div>
		</div>
	);
}

export function QuickExplorer(props: {
	onClose: () => void;
	categoryGroupMap: Map<string, [GeneralCategoryObj, number][]>;
	disableShortcutRef: RefObject<boolean>;
}) {
	const [focused, setFocused] = useState("");
	const { isSelected } = useDataReadinessFilter();
	const keywordFilter = useKeywordFilter();
	const { keyword } = keywordFilter;

	const normalizedKeyword = keyword.trim().toLowerCase();
	const hasKeyword = normalizedKeyword.length > 0;

	return (
		<BlurredBackdrop>
			<Card className="gap-0 border-0 shadow-2xl">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl font-bold lg:text-2xl">
						Quick Explorer
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={props.onClose}
						className="size-8"
					>
						<XIcon className="size-4" />
						<span className="sr-only">Close</span>
					</Button>
				</CardHeader>

				<CardContent>
					<div className="flex flex-row items-center justify-between">
						<FilterByDataReadiness />
						<KeywordFilter useKeywordFilter={keywordFilter} />
					</div>

					<ScrollArea className="h-[60vh] pt-1 pr-4">
						{generalCategory.map((categoryName, categoryIndex) => {
							const rawRows = props.categoryGroupMap.get(categoryName);
							if (!rawRows || rawRows.length === 0) return null;

							const filteredRows: [GeneralCategoryObj, number][] =
								rawRows.filter(([item]) => {
									if (!isSelected(item.analyticalReadiness)) {
										return false;
									}

									if (!hasKeyword) {
										return true;
									}

									return (item.categoryName ?? "")
										.toLowerCase()
										.includes(normalizedKeyword);
								});

							if (filteredRows.length === 0) return null;

							const dimmedCategory =
								focused !== "" && focused.split("-")[1] !== `${categoryIndex}`;

							return (
								<div key={`quickCat-${categoryIndex}`} className="pb-2">
									<div
										className={`pb-2 text-2xl font-bold lg:text-3xl ${
											dimmedCategory ? "opacity-20" : ""
										}`}
									>
										{categoryName}
									</div>

									<div className="flex flex-row flex-wrap gap-3">
										{filteredRows.map((row, groupIndex) => {
											const [item, count] = row;

											const focusKey = `quick-${categoryIndex}-${groupIndex}`;
											const dimmedBadge =
												focused !== "" && focused !== focusKey;

											return (
												<Badge
													key={`quick-badge-${categoryIndex}-${groupIndex}`}
													variant="default"
													className={`text-md font-normal transition-all hover:cursor-pointer hover:bg-neutral-400 ${
														dimmedBadge ? "opacity-20" : ""
													}`}
												>
													<DropDownMenu
														categoryName={item.categoryName ?? ""}
														setFocused={setFocused}
														indexKey={focusKey}
														disableShortcutRef={props.disableShortcutRef}
														onClose={props.onClose}
													>
														<div className="flex flex-row items-center gap-2">
															<DataReadinessIcon
																dataReadiness={item.analyticalReadiness}
																useThin={false}
															/>
															<span className="w-fit hover:cursor-pointer">
																{item.categoryName ?? "<undefined>"}{" "}
																{`- ${count.toLocaleString()}`}
															</span>
														</div>
													</DropDownMenu>
												</Badge>
											);
										})}
									</div>

									<Separator className="my-2" />
								</div>
							);
						})}
					</ScrollArea>

					<ShortcutHelp />
				</CardContent>
			</Card>
		</BlurredBackdrop>
	);
}
