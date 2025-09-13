import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	QueryDisplayState,
	QueryEditorState,
	QueryObject,
	QueryState,
} from "../utils/types";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SqlQueryCodeBlock from "./sql-code-block";
import QueryResultDisplayTable from "./query-result-display";
import { formatForFileDownload } from "../utils/format";
import { runFormat } from "../utils/shared";

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
	queryDisplayState: QueryDisplayState;
	handleShowSqlQuery: () => void;
}) {
	return (
		<DropdownMenuItem
			className="text-xs"
			onClick={() => {
				props.handleShowSqlQuery();
			}}
		>
			{props.queryDisplayState === "hidden"
				? "Show SQL Query"
				: "Hide SQL Query"}
		</DropdownMenuItem>
	);
}

function DropDownMenu(props: {
	queryObject: QueryObject;
	queryDisplayState: QueryDisplayState;

	handleShowSqlQuery: () => void;
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
					queryDisplayState={props.queryDisplayState}
					handleShowSqlQuery={props.handleShowSqlQuery}
				/>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-xs text-red-500"
					onClick={() => props.removeObject(props.queryObject)}
				>
					<p>Delete</p>
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
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	handleScrollBack: () => void;
}) {
	const formatedQuery = runFormat(props.queryObject.sqlQuery);
	const [sqlQuery, setSqlQuery] = useState<string>(formatedQuery); //default query
	const [draftSql, setDraftSql] = useState<string>(formatedQuery); //for edit
	const [newSqlQuery, setNewSqlQuery] = useState<string>(formatedQuery); //to rerun query

	const [queryDisplayState, setQueryDisplayState] =
		useState<QueryDisplayState>("hidden");
	const [queryState, setQueryState] = useState<QueryState>("original");
	const [queryEditorState, setQueryEditorState] =
		useState<QueryEditorState>("rerun");

	const handleCancelQueryRef = useRef<{ cancelQuery: () => void }>(null);
	const queryName = formatQueryName(props.queryObject, props.isDuplicated);
	const fileDownloadName = formatForFileDownload(props.queryObject.queryTitle);

	const isFocused = () => {
		if (props.displayExpanded === -1) {
			return true;
		}
		return props.displayExpanded === props.index;
	};

	const handleShowSqlQuery = () => {
		setQueryDisplayState("hidden");
		if (queryDisplayState === "hidden") {
			setQueryDisplayState("viewer");
		} else {
			setQueryDisplayState("hidden");
		}

		props.setDisplayExpanded(-1);
	};

	useEffect(() => {
		if (props.displayExpanded !== -1) {
			setQueryDisplayState("hidden");
		}
	}, [props.displayExpanded]);

	return (
		<div
			className={`${!isFocused() ? "opacity-35" : ""} flex w-full flex-col gap-y-2`}
			key={`${props.index}-${queryName}`}
		>
			<div className="flex w-full flex-row items-center justify-start gap-x-2">
				<span>
					{`${props.queryObject.queryTitle} `}{" "}
					<span className="text-xs text-neutral-500">{`<${props.queryObject.queryCategory || "n/a"}>`}</span>
					{props.isDuplicated && (
						<span className="text-xs text-neutral-500">{` [${props.queryObject.id}]`}</span>
					)}
				</span>
				<DropDownMenu
					queryObject={props.queryObject}
					queryDisplayState={queryDisplayState}
					handleShowSqlQuery={handleShowSqlQuery}
					removeObject={props.removeObject}
				/>
			</div>
			{queryDisplayState !== "hidden" && (
				<SqlQueryCodeBlock
					sqlQuery={sqlQuery}
					setSqlQuery={setSqlQuery}
					newSqlQuery={newSqlQuery}
					setNewSqlQuery={setNewSqlQuery}
					draftSql={draftSql}
					setDraftSql={setDraftSql}
					handleCancelQueryRef={handleCancelQueryRef}
					queryEditorState={queryEditorState}
					setQueryEditorState={setQueryEditorState}
					queryState={queryState}
					setQueryState={setQueryState}
					queryDisplayState={queryDisplayState}
					setQueryDisplayState={setQueryDisplayState}
				/>
			)}

			<div className="w-full min-w-0 overflow-auto">
				<QueryResultDisplayTable
					query={sqlQuery}
					newQuery={newSqlQuery}
					index={props.index}
					displayExpanded={props.displayExpanded}
					setDisplayExpanded={props.setDisplayExpanded}
					lockScroll={!isFocused()}
					fileDownloadName={fileDownloadName}
					handleCancelQueryRef={handleCancelQueryRef}
					queryEditorState={queryEditorState}
					setQueryEditorState={setQueryEditorState}
					queryState={queryState}
					setQueryState={setQueryState}
				/>
			</div>
			<Separator className="my-4" />
		</div>
	);
}
