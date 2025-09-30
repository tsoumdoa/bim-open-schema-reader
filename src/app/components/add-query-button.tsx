import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDownRight } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { QueryObject } from "../utils/types";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { queriesSelectorList } from "../utils/queries-selector-list";

export function AddQuery(props: {
	addQuery: (queryObject: QueryObject) => void;
	setDisplayExpanded: (b: number) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// Open the dialog with Cmd+K (macOS) or Ctrl+K (others),
		// but don't trigger while typing or when already open.
		const onKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (target && target.closest('input, textarea, [contenteditable="true"]'))
				return;
			const key = e.key.toLowerCase();
			const isMac = navigator.platform.toLowerCase().includes("mac");
			const isShortcut =
				(isMac ? e.metaKey && !e.ctrlKey : e.ctrlKey) && key === "k";

			if (isShortcut) {
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					props.setDisplayExpanded(-1);
				}
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen, props.setDisplayExpanded]);

	const handleSelectCommand = (
		queryCategory: string,
		queryObject: QueryObject
	) => {
		queryObject.queryCategory = queryCategory;
		props.addQuery(queryObject);
		setIsOpen(false);
	};
	// const handleCreateCustomQuery = () => {
	// 	// TODO: have to implement
	// 	setIsOpen(false);
	// };
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="w-fit"
					onClick={() => {
						setIsOpen(true);
						props.setDisplayExpanded(-1);
					}}
				>
					Add Query
				</Button>
			</DialogTrigger>
			<DialogContent className="gap-1 px-6 pt-6 pb-2 sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle> Query Selector</DialogTitle>
					<DialogDescription>
						Select a query from the list below to.
					</DialogDescription>
				</DialogHeader>
				<Command className="rounded-lg border shadow-md md:min-w-[450px]">
					<CommandInput placeholder="Type a query or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						{queriesSelectorList.map((querySelector) => {
							return (
								<CommandGroup
									heading={querySelector.queryCategory}
									key={querySelector.queryCategory}
								>
									{querySelector.queryObjects.map((q, i) => {
										return (
											<div
												onClick={() => {
													handleSelectCommand(querySelector.queryCategory, q);
												}}
												key={`${querySelector.queryCategory}-${q.queryTitle}-${i}`}
											>
												<CommandItem className="hover:cursor-pointer">
													<Tooltip delayDuration={100}>
														<TooltipTrigger className="hover:cursor-help">
															<ArrowDownRight />
														</TooltipTrigger>
														<span>{q.queryTitle}</span>
														<TooltipContent
															side="bottom"
															align="start"
															alignOffset={-8}
														>
															<p>{q.explaination}</p>
														</TooltipContent>
													</Tooltip>
												</CommandItem>
											</div>
										);
									})}
								</CommandGroup>
							);
						})}
					</CommandList>
				</Command>
				{/*

				<Button
					type="submit"
					variant="outline"
					onClick={handleCreateCustomQuery}
				>
					Create a custom Query
				</Button>
					*/}
				<DialogFooter className="flex w-full flex-row justify-start">
					<Button
						type="submit"
						variant="ghost"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
