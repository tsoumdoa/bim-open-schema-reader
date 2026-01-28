import useQueryViewerAndEditor from "../hooks/use-query-viewer-and-editor";
import { formatForFileDownload } from "../utils/format";
import {
	QueryDisplayState,
	QueryObject,
	UseExpandDisplay,
} from "../utils/types";
import QueryResultDisplayTable from "./query-result-display";
import SqlQueryCodeBlock from "./sql-code-block";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export default function QueryDisplayItem(props: {
	queryObject: QueryObject;
	removeObject: (queryObject: QueryObject) => void;
	index: number;
	useExpandDisplay: UseExpandDisplay;
	updateQueryTitle: (queryObject: QueryObject, newTitle: string) => void;
	updateQuery: (queryObject: QueryObject, newQuery: string) => void;
}) {
	const useQueryViewerAndEditorHook = useQueryViewerAndEditor(
		props.queryObject.queryTitle,
		props.queryObject.sqlQuery
	);
	const {
		queryDisplayState,
		queryState,
		setQueryDisplayState,
		setQueryTitleState,
	} = useQueryViewerAndEditorHook;
	const { displayExpanded, setDisplayExpanded } = props.useExpandDisplay;
	const [titleInputValue, setTitleInputValue] = useState(
		props.queryObject.queryTitle
	);
	const titleInputRef = useRef<HTMLInputElement | null>(null);

	const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitleInputValue(newTitle);
		if (newTitle !== props.queryObject.queryTitle) {
			setQueryTitleState("edited");
			props.updateQueryTitle(props.queryObject, newTitle);
		} else {
			setQueryTitleState("original");
		}
	};

	const fileDownloadName = formatForFileDownload(
		queryState === "edited"
			? `edited-${props.queryObject.queryTitle}`
			: props.queryObject.queryTitle
	);

	const isFocused = () => {
		if (displayExpanded === -1) {
			return true;
		}
		return displayExpanded === props.index;
	};

	const handleShowSqlQuery = () => {
		setQueryDisplayState("hidden");
		if (queryDisplayState === "hidden") {
			setQueryDisplayState("viewer");
		} else {
			setQueryDisplayState("hidden");
		}

		setDisplayExpanded(-1);
	};

	useEffect(() => {
		if (displayExpanded !== -1) {
			setQueryDisplayState("hidden");
		}
	}, [displayExpanded]);

	const showTitle =
		queryDisplayState === "viewer" || queryDisplayState === "hidden";

	return (
		<div
			className={`${!isFocused() ? "opacity-35" : ""} flex w-full flex-col gap-y-2`}
			key={`${props.index}-${props.queryObject.id}`}
		>
			<div className="flex w-full flex-row items-center justify-start gap-x-2">
				{showTitle ? (
					<span>
						<span className="pr-2 text-base font-semibold">{`Query ${props.index + 1}`}</span>
						{props.queryObject.queryTitle}
					</span>
				) : (
					<div className="flex w-full flex-row items-center justify-start">
						<span className="text-fit w-fit shrink-0 pr-2 text-base font-semibold whitespace-nowrap">{`Query ${props.index + 1}`}</span>
						<Input
							type="title"
							placeholder={props.queryObject.queryTitle}
							ref={titleInputRef}
							value={titleInputValue}
							onChange={handleTitleInputChange}
							disabled={queryState === "original"}
						/>
					</div>
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
					queryObject={props.queryObject}
					updateQueryTitle={props.updateQueryTitle}
					updateQuery={props.updateQuery}
					useQueryViewerAndEditorHook={useQueryViewerAndEditorHook}
				/>
			)}

			<div className="w-full min-w-0 overflow-auto">
				<QueryResultDisplayTable
					index={props.index}
					displayExpanded={displayExpanded}
					setDisplayExpanded={setDisplayExpanded}
					lockScroll={!isFocused()}
					fileDownloadName={fileDownloadName}
					useQueryViewerAndEditorHook={useQueryViewerAndEditorHook}
				/>
			</div>
			<Separator className="my-4" />
		</div>
	);
}
