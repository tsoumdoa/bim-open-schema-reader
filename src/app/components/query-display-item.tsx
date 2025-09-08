"use no memo";
import { Separator } from "@/components/ui/separator";
import * as duckdb from "@duckdb/duckdb-wasm";
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
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import SqlQueryCodeBlock from "./sql-code-block";
import QueryResultDisplayTable from "./query-result-display";
import { formatForFileDownload } from "../utils/format";

function AboutMenuItem(props: { queryObject: QueryObject }) {
	return (
		<DropdownMenuItem className="text-xs">
			<Tooltip delayDuration={150}>
				<TooltipTrigger asChild>
					<span className="text-md leading-tight font-bold hover:cursor-help">
						About
					</span>
				</TooltipTrigger>
				<TooltipContent side="top" align="start">
					<p>{props.queryObject.explaination}</p>
				</TooltipContent>
			</Tooltip>
		</DropdownMenuItem>
	);
}

function ShowHideSqlQueryMenuItem(props: {
	showSqlQuery: boolean;
	setShowSqlQuery: (b: boolean) => void;
}) {
	return (
		<DropdownMenuItem
			className="text-xs"
			onClick={() => {
				props.setShowSqlQuery(!props.showSqlQuery);
			}}
		>
			{props.showSqlQuery ? "Hide SQL Query" : "Show SQL Query"}
		</DropdownMenuItem>
	);
}

function DropDownMenu(props: {
	queryObject: QueryObject;
	showSqlQuery: boolean;
	setShowSqlQuery: (b: boolean) => void;
	removeObject: (queryObject: QueryObject) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="w-fit hover:cursor-pointer hover:bg-neutral-50"
				>
					<Menu />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				<AboutMenuItem queryObject={props.queryObject} />
				<ShowHideSqlQueryMenuItem
					showSqlQuery={props.showSqlQuery}
					setShowSqlQuery={props.setShowSqlQuery}
				/>

				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-xs text-red-500">
					<p onClick={() => props.removeObject(props.queryObject)}>Delete</p>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const formatQueryName = (queryObject: QueryObject, duplicated: boolean) => {
	return (
		<span>
			{`${queryObject.queryTitle} `}{" "}
			<span className="text-xs text-neutral-500">{`<${queryObject.queryCategory || "n/a"}>`}</span>
			{duplicated && (
				<span className="text-xs text-neutral-500">{` [${queryObject.id}]`}</span>
			)}
		</span>
	);
};

export default function QueryDisplayItem(props: {
	queryObject: QueryObject;
	removeObject: (queryObject: QueryObject) => void;
	isDuplicated: boolean;
	duckDbConnection: duckdb.AsyncDuckDBConnection;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	handleScrollBack: () => void;
}) {
	const [showSqlQuery, setShowSqlQuery] = useState(false);
	const [showDropDown, setShowDropDown] = useState(true);
	const queryName = formatQueryName(props.queryObject, props.isDuplicated);
	const fileDownloadName = formatForFileDownload(props.queryObject.queryTitle);

	const isFocused = () => {
		if (props.displayExpanded === -1) {
			return true;
		}
		return props.displayExpanded === props.index;
	};

	useEffect(() => {
		if (props.displayExpanded !== -1) {
			setShowSqlQuery(false);
			setShowDropDown(false);
		}

		if (props.displayExpanded === -1) {
			setShowDropDown(true);
		}
	}, [props.displayExpanded]);

	return (
		<div
			className={`${!isFocused() ? "opacity-35" : ""} flex w-full flex-col gap-y-2`}
			key={`${props.index}-${queryName}`}
		>
			<div className="flex w-full flex-row items-center justify-start gap-x-2">
				{queryName}
				{showDropDown && (
					<DropDownMenu
						queryObject={props.queryObject}
						showSqlQuery={showSqlQuery}
						setShowSqlQuery={setShowSqlQuery}
						removeObject={props.removeObject}
					/>
				)}
			</div>
			{showSqlQuery && (
				<SqlQueryCodeBlock sqlQuery={props.queryObject.sqlQuery} />
			)}

			<div className="w-full min-w-0 overflow-auto">
				<QueryResultDisplayTable
					c={props.duckDbConnection}
					query={props.queryObject.sqlQuery}
					index={props.index}
					displayExpanded={props.displayExpanded}
					setDisplayExpanded={props.setDisplayExpanded}
					lockScroll={!isFocused()}
					fileDownloadName={fileDownloadName}
				/>
			</div>
			<Separator className="my-4" />
		</div>
	);
}
