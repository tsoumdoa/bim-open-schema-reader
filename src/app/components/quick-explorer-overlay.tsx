import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generalCategory } from "../utils/types";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import DropDownMenu from "./data-category-list-dropdown";

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

function BlurredBackdrop(props: {
	children: React.ReactNode;
	onClose: () => void;
}) {
	return (
		<div
			className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center duration-200"
			onClick={props.onClose}
		>
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
	isActive: boolean;
	onClose: () => void;
	categoryGorupMap: Map<string, [string, number][]>;
}) {
	if (!props.isActive) return null;

	const [focused, setFocused] = useState("");

	return (
		<BlurredBackdrop onClose={props.onClose}>
			<Card className="gap-3 border-0 shadow-2xl">
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
					<ScrollArea className="h-[60vh] pr-4">
						{generalCategory.map((categoryName, categoryIndex) => {
							if (props.categoryGorupMap.get(categoryName)?.length || 0 > 0) {
								return (
									<div key={`quickCat-${categoryIndex}`} className="pb-2">
										<div
											className={`pb-2 text-2xl font-bold lg:text-3xl ${focused !== "" && focused.split("-")[1] !== `${categoryIndex}` && "opacity-20"} `}
										>
											{categoryName}
										</div>
										<div className="flex flex-row flex-wrap gap-3">
											{props.categoryGorupMap
												.get(categoryName)
												?.map((row, groupIndex) => (
													<Badge
														key={`koolthing-category-count-${groupIndex}`}
														variant="default"
														className={`transition-all hover:bg-neutral-400 ${focused !== "" && focused !== `quick-${categoryIndex}-${groupIndex}` && "opacity-20"} text-md font-normal hover:cursor-pointer`}
														onClick={props.onClose}
													>
														<DropDownMenu
															categoryName={(row[0] as string) || ""}
															setFocused={setFocused}
															indexKey={`quick-${categoryIndex}-${groupIndex}`}
															count={row[1]}
														/>
													</Badge>
												))}
										</div>
										<Separator className="my-2" />
									</div>
								);
							}
						})}
					</ScrollArea>
					<ShortcutHelp />
				</CardContent>
			</Card>
		</BlurredBackdrop>
	);
}
