import { Check, Copy, Play, Save, SquarePen, X } from "lucide-react";
import {
	JSX,
	useEffect,
	useLayoutEffect,
	useCallback,
	useState,
	RefObject,
} from "react";
import { highlightAndFormatSql, runFormat } from "../utils/shared";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { dracula } from "@uiw/codemirror-theme-dracula";
import {
	QueryDisplayState,
	QueryEditorState,
	QueryState,
} from "../utils/types";

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
	sqlQuery: string;
	draftSql: string;
	newSqlQuery: string;
	handleCancelQueryRef: RefObject<{ cancelQuery: () => void } | null>;
	queryDisplayState: QueryDisplayState;
	queryEditorState: QueryEditorState;
	queryState: QueryState;
	setSqlQuery: (b: string) => void;
	setNewSqlQuery: (b: string) => void;
	setDraftSql: (b: string) => void;
	setQueryDisplayState: (b: QueryDisplayState) => void;
	setQueryEditorState: (b: QueryEditorState) => void;
	setQueryState: (b: QueryState) => void;
}) {
	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);
	const formatedQuery = runFormat(props.sqlQuery);

	const onChange = useCallback((val: string) => {
		props.setQueryEditorState("stale");
		props.setQueryState("edited");
		props.setDraftSql(val);

		if (props.sqlQuery === val) {
			props.setQueryState("original");
		} else {
			props.setQueryState("edited");
		}

		setLineLength(val.split("\n").length);
	}, []);

	useLayoutEffect(() => {
		highlightAndFormatSql(formatedQuery, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, [props.sqlQuery]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(formatedQuery);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleCancelDraftMode = () => {
		props.setDraftSql(props.sqlQuery);
		props.setQueryDisplayState("viewer");
		props.setQueryEditorState("initial");
	};

	const handleSave = () => {
		if (props.draftSql !== props.sqlQuery) {
			const formatedQuery = runFormat(props.draftSql);
			props.setSqlQuery(formatedQuery);
		}
		props.setQueryDisplayState("viewer");
		props.setQueryEditorState("initial");
	};

	const handleSetToDraftMode = () => {
		props.setDraftSql(props.sqlQuery);
		props.setQueryDisplayState("editor");
	};

	const handleRunButtonClick = () => {
		props.setNewSqlQuery(props.draftSql);
	};

	const handleCancelQuery = () => {
		props.handleCancelQueryRef.current?.cancelQuery();
		if (props.queryEditorState !== "error") {
			props.setQueryEditorState("stale");
		}
	};
	const isEditing = props.queryDisplayState === "editor";
	const isRunning = props.queryEditorState === "running";
	const isStale = props.queryEditorState === "stale";
	const hasRerunSuccess = props.queryEditorState === "rerun";

	const displayStale = props.queryEditorState === "stale";
	const displayError = props.queryEditorState === "error";
	const displayCanceled = props.queryEditorState === "canceled";
	const displayRunButton = isStale || displayError;
	const displayCancelButton = isRunning || isEditing;
	const disableEditButton =
		(props.queryEditorState === "error" && isEditing) || isRunning || isStale;

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
					value={props.draftSql}
					height="500px"
					extensions={[sql({})]}
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
