import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	QueryDisplayState,
	QueryObject,
	QueryState,
	QueryTitleState,
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
import useQueryViewerAndEditor from "../hooks/use-query-viewer-and-editor";
import { Input } from "@/components/ui/input";

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

const formatQueryName = (
	queryObject: QueryObject,
	duplicated: boolean,
	queryState: QueryState,
	qureyTitleState: QueryTitleState,
	newTitle: string
) => {
	switch (queryState) {
		case "original":
			return (
				<span>
					{`${queryObject.queryTitle} `}{" "}
					<span className="text-xs text-neutral-500">{`<${queryObject.queryCategory || "n/a"}>`}</span>
					{duplicated && (
						<span className="text-xs text-neutral-500">{` [${queryObject.id}]`}</span>
					)}
				</span>
			);
		case "edited":
			if (qureyTitleState === "edited") {
				return <span>{newTitle}</span>;
			}
			return (
				<span>
					{queryObject.queryTitle}{" "}
					<span className="text-cs text-amber-500">{`<edited>`}</span>
				</span>
			);
		default:
			return <span>{queryObject.queryTitle}</span>;
	}
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
	const {
		handleCancelQueryRef,
		formatedQuery,
		sqlQuery,
		draftSql,
		newSqlQuery,
		queryDisplayState,
		queryState,
		queryEditorState,
		setSqlQuery,
		setDraftSql,
		setNewSqlQuery,
		setQueryDisplayState,
		setQueryState,
		setQueryEditorState,
		queryTitleState,
		setQueryTitleState,
	} = useQueryViewerAndEditor(props.queryObject.sqlQuery);

	const [titleInputValue, setTitleInputValue] = useState("");
	const titleInputRef = useRef<HTMLInputElement | null>(null);

	const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;
		setTitleInputValue(v);
		if (v !== props.queryObject.queryTitle) {
			setQueryTitleState("edited");
		} else {
			setQueryTitleState("original");
		}
	};

	const queryName = formatQueryName(
		props.queryObject,
		props.isDuplicated,
		queryState,
		queryTitleState,
		titleInputValue
	);

	const fileDownloadName = formatForFileDownload(
		queryState === "edited"
			? `edited-${props.queryObject.queryTitle}`
			: props.queryObject.queryTitle
	);

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

	const showNormalTitle =
		queryDisplayState === "viewer" || queryDisplayState === "hidden";

	return (
		<div
			className={`${!isFocused() ? "opacity-35" : ""} flex w-full flex-col gap-y-2`}
			key={`${props.index}-${props.queryObject.id}`}
		>
			<div className="flex w-full flex-row items-center justify-start gap-x-2">
				{showNormalTitle ? (
					queryName
				) : (
					<Input
						type="title"
						placeholder={props.queryObject.queryTitle}
						ref={titleInputRef}
						value={titleInputValue}
						onChange={handleTitleInputChange}
						disabled={queryState === "original"}
					/>
				)}
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
					query={formatedQuery}
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
