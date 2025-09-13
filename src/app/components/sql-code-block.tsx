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
			className="relative flex max-h-96 w-full min-w-full flex-col overflow-x-auto overflow-y-auto text-xs [&>pre]:p-1"
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
	handleSave: () => void;
	handleSetToDraftMode: () => void;
	isEditing: boolean;
}) {
	return (
		<Button
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

export default function SqlQuerjCodeBlock(props: {
	sqlQuery: string;
	setSqlQuery: (b: string) => void;
	isEdited: boolean;
	isEditing: boolean;
	isStale: boolean;
	isRerunning: boolean;
	isRerunSuccess: boolean;
	isCanceled: boolean;
	rerunError: boolean;
	setIsEdited: (b: boolean) => void;
	setIsEditing: (b: boolean) => void;
	setIsStale: (b: boolean) => void;
	setIsRerunSuccess: (b: boolean) => void;
	setIsRerunning: (b: boolean) => void;
	setNewSqlQuery: (b: string) => void;
	setRerunError: (b: boolean) => void;
	setIsCanceled: (b: boolean) => void;
	draftSql: string;
	setDraftSql: (b: string) => void;
	handleCancelQueryRef: RefObject<{ cancelQuery: () => void } | null>;
}) {
	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);
	const formatedQuery = runFormat(props.sqlQuery);

	const onChange = useCallback((val: string) => {
		props.setIsRerunSuccess(false);
		props.setDraftSql(val);
		setLineLength(val.split("\n").length);
		props.setIsStale(true);
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
		props.setIsEditing(false);
		props.setDraftSql(props.sqlQuery); //u
		props.setIsCanceled(false);
		props.setIsRerunSuccess(false);
	};

	const handleSave = () => {
		props.setIsEditing(false); // which means close edit mode => save
		props.setRerunError(false);
		if (props.draftSql !== props.sqlQuery) {
			props.setSqlQuery(props.draftSql); // update code display
		}
		props.setIsRerunSuccess(false);
	};

	const handleSetToDraftMode = () => {
		props.setDraftSql(props.sqlQuery);
		props.setIsRerunSuccess(false);
		props.setIsEditing(true);
		props.setIsCanceled(false);
	};

	const handleRunButtonClick = () => {
		props.setIsCanceled(false);
		props.setNewSqlQuery(props.draftSql); //this trigers rerun with useEffect in SqlQueryCodeBlock
	};

	const handleCancelQuery = () => {
		props.handleCancelQueryRef.current?.cancelQuery();
		props.setIsCanceled(true);
		props.setIsRerunning(false);
		props.setIsRerunSuccess(false);
		props.setRerunError(false);
	};

	return (
		<div
			className={`mb-2 flex min-w-full flex-col rounded-t-xs ring-2 ${props.isEditing ? "bg-[#282A36]" : "ring-neutral-200"}`}
		>
			<div
				className={`flex items-center justify-between rounded-t-xs ${props.isEditing ? "bg-[#282A36]" : "bg-neutral-200"}`}
			>
				<span
					className={`pl-2 text-xs font-medium ${props.isEditing ? "text-[#F8F8F2]" : "text-neutral-800"}`}
				>
					SQL Query
					{lineLength > 1 ? (
						<span className="text-xs font-light"> ({lineLength} lines)</span>
					) : (
						""
					)}{" "}
				</span>
				<div className="flex items-center gap-x-1 p-1">
					{props.isStale && !props.rerunError && (
						<span className="px-1 text-xs text-red-500">STALE</span>
					)}
					{props.rerunError && (
						<span className="px-1 text-xs text-red-500">ERROR</span>
					)}

					{props.isCanceled && (
						<span className="px-1 text-xs text-red-500">CANCELED</span>
					)}

					{props.isRerunSuccess && !props.isCanceled && (
						<span className="px-1 text-xs text-green-500">Run Success</span>
					)}
					{props.isStale && (
						<RunButton
							handleRunButtonClick={handleRunButtonClick}
							isEditing={props.isEditing}
							isRunning={props.isRerunning}
						/>
					)}

					{!props.isEditing && (
						<CopyButton copied={copied} handleCopy={handleCopy} />
					)}
					{props.isEditing && (
						<CancelButton
							handleCancel={handleCancelDraftMode}
							handleCancelQuery={handleCancelQuery}
							isRunningg={props.isRerunning}
						/>
					)}
					{!props.isStale &&
						!props.isRerunning &&
						!props.rerunError &&
						!props.isCanceled && (
							<EditButton
								handleSave={handleSave}
								handleSetToDraftMode={handleSetToDraftMode}
								isEditing={props.isEditing}
							/>
						)}
				</div>
			</div>
			{props.isEditing ? (
				<CodeMirror
					editable={!props.isRerunning}
					value={props.draftSql}
					height="400px"
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
