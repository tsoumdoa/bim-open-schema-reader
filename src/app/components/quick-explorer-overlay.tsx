import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerailCategoryObj, generalCategory } from "../utils/types";
import { Separator } from "@/components/ui/separator";
import { RefObject, useState } from "react";
import DropDownMenu from "./data-category-list-dropdown";
import DataReadinessIcon from "./data-readiness-icon";
import FilterByDataReadiness from "./filter-by-data-readiness";
import { useDataReadinessFilter } from "./use-data-readiness-filter";

function ShortcutHelp() {
	return (
		<div className="text-muted-foreground mt-4 border-t pt-4 text-center text-sm">
			Press{" "}
			<kbd className="bg-muted rounded px-2 py-1 font-mono text-xs">Cmd</kbd> +{" "}
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
				className="animate-in zoom-in-95 max-w-8xl relative z-10 w-full px-8 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				{props.children}
			</div>
		</div>
	);
}

export function QuickExplorer(props: {
	onClose: () => void;
	categoryGorupMap: Map<string, [GenerailCategoryObj, number][]>;
	disableShortcutRef: RefObject<boolean>;
}) {
	const [focused, setFocused] = useState("");
	const { isSelected } = useDataReadinessFilter();

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
					<FilterByDataReadiness />
					<ScrollArea className="h-[60vh] pt-1 pr-4">
						{generalCategory.map((categoryName, categoryIndex) => {
							const rawRows = props.categoryGorupMap.get(categoryName) ?? [];
							const visibleRows = rawRows.filter((row) =>
								isSelected(row[0].analyticalReadiness)
							);

							if (visibleRows.length === 0) return null;

							const dimmedCategory =
								focused !== "" && focused.split("-")[1] !== `${categoryIndex}`;

							return (
								<div key={`quickCat-${categoryIndex}`} className="pb-2">
									<div
										className={`pb-2 text-2xl font-bold lg:text-3xl ${dimmedCategory ? "opacity-20" : ""
											}`}
									>
										{categoryName}
									</div>

									<div className="flex flex-row flex-wrap gap-3">
										{visibleRows.map((row, groupIndex) => {
											const dimmedBadge =
												focused !== "" &&
												focused !== `quick-${categoryIndex}-${groupIndex}`;

											return (
												<Badge
													key={`koolthing-category-count-${groupIndex}`}
													variant="default"
													className={`transition-all hover:bg-neutral-400 ${dimmedBadge ? "opacity-20" : ""
														} text-md font-normal hover:cursor-pointer`}
												>
													<DropDownMenu
														categoryName={(row[0].categoryName as string) || ""}
														setFocused={setFocused}
														indexKey={`quick-${categoryIndex}-${groupIndex}`}
														disableShortcutRef={props.disableShortcutRef}
														onClose={props.onClose}
													>
														<div className="flex flex-row items-center gap-2">
															<DataReadinessIcon
																dataReadiness={row[0].analyticalReadiness}
																useThin={false}
															/>
															<span className="w-fit hover:cursor-pointer">
																{row[0].categoryName || "<undefined>"}{" "}
																{`- ${row[1].toLocaleString()}`}
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
