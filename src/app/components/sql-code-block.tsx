"use no memo";
import { Check, Copy, Play, Save, SquarePen, X } from "lucide-react";
import { JSX, useEffect, useLayoutEffect, useCallback, useState } from "react";
import { highlightAndFormatSql, runFormat } from "../utils/shared";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { QueryObject, UseQueryViewerAndEditor } from "../utils/types";
import { makeKeymap } from "../utils/code-mirror-keymaps";
import { autocompletion } from "@codemirror/autocomplete";
import { sqlSchemaCompletions } from "../utils/code-mirror-autocompletion";

function ShikiNodeFormatter(props: { children: JSX.Element }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const el = containerRef.current;
		if (el) {
			setIsOverflowing(el.scrollHeight > el.clientHeight);
		}
	}, [props.children]);

	const scrollToTop = () => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: 0,
				behavior: "instant",
			});
		}
	};

	return (
		<div
			ref={containerRef}
			className="relative flex max-h-[500px] w-full min-w-full flex-col overflow-x-auto overflow-y-auto text-xs [&>pre]:p-1"
		>
			{props.children}
			{isOverflowing && (
				<div className="relative w-full">
					<button
						onClick={scrollToTop}
						className="absolute right-3 bottom-2 w-fit rounded bg-neutral-800 px-2 py-1 text-xs text-white transition hover:cursor-pointer hover:bg-neutral-700"
					>
						↑ Top
					</button>
				</div>
			)}
		</div>
	);
}

function CopyButton(props: { copied: boolean; handleCopy: () => void }) {
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={props.handleCopy}
			className="h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200"
		>
			{props.copied ? (
				<>
					<Check className="mr-1 h-3 w-3" />
					Copied
				</>
			) : (
				<>
					<Copy className="mr-1 h-3 w-3" />
					Copy
				</>
			)}
		</Button>
	);
}

function RunButton(props: {
	handleRunButtonClick: () => void;
	isEditing: boolean;
	isRunning: boolean;
}) {
	return (
		<div>
			{props.isRunning ? (
				<Button
					variant="ghost"
					size="sm"
					disabled={props.isRunning}
					className={`h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200 ${props.isEditing ? "text-neutral-200" : ""}`}
				>
					<Play className="mr-1 h-3 w-3" />
					Running...
				</Button>
			) : (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => props.handleRunButtonClick()}
					className={`h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200 ${props.isEditing ? "text-neutral-200" : ""}`}
				>
					<Play className="mr-1 h-3 w-3" />
					Run
				</Button>
			)}
		</div>
	);
}

function EditButton(props: {
	disabled: boolean;
	handleSave: () => void;
	handleSetToDraftMode: () => void;
	isEditing: boolean;
}) {
	return (
		<Button
			disabled={props.disabled}
			variant="ghost"
			size="sm"
			onClick={() =>
				props.isEditing ? props.handleSave() : props.handleSetToDraftMode()
			}
			className={`h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200 ${props.isEditing ? "text-neutral-200" : ""}`}
		>
			{props.isEditing ? (
				<>
					<Save className="mr-1 h-3 w-3" />
					Save
				</>
			) : (
				<>
					<SquarePen className="mr-1 h-3 w-3" />
					Edit
				</>
			)}
		</Button>
	);
}

function CancelButton(props: {
	handleCancel: () => void;
	handleCancelQuery: () => void;
	isRunningg: boolean;
}) {
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={props.isRunningg ? props.handleCancelQuery : props.handleCancel}
			className="h-7 p-1 text-xs text-neutral-100 hover:cursor-pointer"
		>
			<X className="mr-1 h-3 w-3" />
			Cancel
		</Button>
	);
}

export default function SqlQueryCodeBlock(props: {
	queryObject: QueryObject;
	updateQueryTitle: (queryObject: QueryObject, newTitle: string) => void;
	updateQuery: (queryObject: QueryObject, newQuery: string) => void;
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor;
}) {
	const {
		handleCancelQueryRef,
		formatedQuery,
		sqlQuery,
		draftSql,
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
		newSqlQuery,
	} = props.useQueryViewerAndEditorHook;
	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);

	const onChange = useCallback(
		(val: string) => {
			setQueryEditorState("stale");
			setQueryState("edited");
			setDraftSql(val);

			if (sqlQuery === val) {
				setQueryState("original");
			} else {
				setQueryState("edited");
			}

			setLineLength(val.split("\n").length);
		},
		[sqlQuery, setDraftSql, setQueryEditorState, setQueryState]
	);

	useLayoutEffect(() => {
		highlightAndFormatSql(newSqlQuery, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, [newSqlQuery]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(newSqlQuery);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleCancelDraftMode = () => {
		setDraftSql(sqlQuery);
		setQueryDisplayState("viewer");
		setQueryEditorState("initial");
	};

	const handleSave = () => {
		if (draftSql !== sqlQuery) {
			const formatedQuery = runFormat(draftSql);
			setQueryState("edited");
			setSqlQuery(formatedQuery);
			props.updateQuery(props.queryObject, formatedQuery);
		}
		//NOTE: add * if the query is edited but the title is not edited
		const lastChar = props.queryObject.queryTitle.slice(-1);
		if (
			queryTitleState === "original" &&
			queryState === "edited" &&
			lastChar !== "*"
		) {
			props.updateQueryTitle(
				props.queryObject,
				props.queryObject.queryTitle + "*"
			);
		} else {
			props.updateQueryTitle(props.queryObject, props.queryObject.queryTitle);
		}
		setQueryDisplayState("viewer");
		setQueryEditorState("initial");
	};

	const handleSetToDraftMode = () => {
		setDraftSql(sqlQuery);
		setQueryDisplayState("editor");
	};

	const handleRunButtonClick = () => {
		setNewSqlQuery(draftSql);
	};

	const handleCancelQuery = () => {
		handleCancelQueryRef.current?.cancelQuery();
		if (queryEditorState !== "error") {
			setQueryEditorState("stale");
		}
	};
	const isEditing = queryDisplayState === "editor";
	const isRunning = queryEditorState === "running";
	const isStale = queryEditorState === "stale";
	const hasRerunSuccess = queryEditorState === "rerun";

	const displayStale = queryEditorState === "stale";
	const displayError = queryEditorState === "error";
	const displayCanceled = queryEditorState === "canceled";
	const displayRunButton = isStale || displayError;
	const displayCancelButton = isRunning || isEditing;
	const disableEditButton =
		(queryEditorState === "error" && isEditing) || isRunning || isStale;

	return (
		<div
			className={`mb-2 flex min-w-full flex-col rounded-t-xs ring-2 ${isEditing ? "ring-[#282A36]" : "ring-neutral-200"}`}
		>
			<div
				className={`flex items-center justify-between rounded-t-xs ${isEditing ? "bg-[#282A36]" : "bg-neutral-200"}`}
			>
				<span
					className={`pl-2 text-xs font-medium ${isEditing ? "text-[#F8F8F2]" : "text-neutral-800"}`}
				>
					SQL Query
					{lineLength > 1 ? (
						<span className="text-xs font-light"> ({lineLength} lines)</span>
					) : (
						""
					)}{" "}
				</span>
				<div className="flex items-center gap-x-1 p-1">
					{displayStale && (
						<span className="px-1 text-xs text-red-500">STALE</span>
					)}
					{displayError && (
						<span className="px-1 text-xs text-red-500">ERROR</span>
					)}

					{displayCanceled && (
						<span className="px-1 text-xs text-red-500">CANCELED</span>
					)}

					{hasRerunSuccess && (
						<span className="px-1 text-xs text-green-500">Run Success</span>
					)}
					{displayRunButton && (
						<RunButton
							handleRunButtonClick={handleRunButtonClick}
							isEditing={isEditing}
							isRunning={isRunning}
						/>
					)}

					{!isEditing && <CopyButton copied={copied} handleCopy={handleCopy} />}
					{displayCancelButton && (
						<CancelButton
							handleCancel={handleCancelDraftMode}
							handleCancelQuery={handleCancelQuery}
							isRunningg={isRunning}
						/>
					)}
					{
						<EditButton
							disabled={disableEditButton}
							handleSave={handleSave}
							handleSetToDraftMode={handleSetToDraftMode}
							isEditing={isEditing}
						/>
					}
				</div>
			</div>
			{isEditing ? (
				<CodeMirror
					editable={!isRunning}
					value={draftSql}
					height="500px"
					extensions={[
						sql({}),
						makeKeymap({
							onRun: handleRunButtonClick,
							onFormat: () => {
								if (!isRunning) {
									const formatted = runFormat(draftSql);
									setDraftSql(formatted);
								}
							},
						}),
						autocompletion({
							override: [sqlSchemaCompletions],
							activateOnTyping: true,
						}),
					]}
					onChange={onChange}
					theme={dracula}
					className="rounded-b-xs text-xs"
				/>
			) : nodes ? (
				<ShikiNodeFormatter>{nodes}</ShikiNodeFormatter>
			) : (
				<div className="text-xs text-neutral-500">Loading...</div>
			)}
		</div>
	);
}
