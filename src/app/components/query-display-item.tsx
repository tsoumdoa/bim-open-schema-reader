import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { QueryObject } from "../utils/types";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function DropDownMenu(props: {
	queryObject: QueryObject;
	showSqlQuery: boolean;
	setShowSqlQuery: (b: boolean) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="w-fit hover:bg-neutral-50 hover:cursor-pointer "
				>
					<Menu />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				<DropdownMenuItem className="text-xs">
					<Tooltip delayDuration={150}>
						<TooltipTrigger asChild>
							<span className="font-bold text-md leading-tight hover:cursor-help">
								About
							</span>
						</TooltipTrigger>
						<TooltipContent side="top" align="start">
							<p>{props.queryObject.explaination}</p>
						</TooltipContent>
					</Tooltip>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-xs"
					onClick={() => {
						props.setShowSqlQuery(!props.showSqlQuery);
					}}
				>
					{props.showSqlQuery ? "Hide SQL Query" : "Show SQL Query"}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-xs text-red-500">
					<p>Delete</p>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function SqlQueryCodeBlock(props: { sqlQuery: string }) {
	return (
		<div className="flex flex-col gap-y-2">
			<Textarea value={props.sqlQuery} className="w-full h-full" readOnly />
		</div>
	);
}

export default function QueryDisplayItem(props: { queryObject: QueryObject }) {
	const [showSqlQuery, setShowSqlQuery] = useState(false);
	return (
		<div>
			<div className="flex flex-row items-center justify-start gap-x-2">
				{`${props.queryObject.queryTile} `}{" "}
				<span className="text-xs text-neutral-500">{`<${props.queryObject.queryCategory || "n/a"}>`}</span>
				<DropDownMenu
					queryObject={props.queryObject}
					showSqlQuery={showSqlQuery}
					setShowSqlQuery={setShowSqlQuery}
				/>
			</div>
			{showSqlQuery && (
				<SqlQueryCodeBlock sqlQuery={props.queryObject.sqlQuery} />
			)}
			<Separator className="my-4" />
		</div>
	);
}
