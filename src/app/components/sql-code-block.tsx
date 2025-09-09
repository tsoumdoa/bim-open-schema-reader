import { Check, Copy, Save, SquarePen, X } from "lucide-react";
import { JSX, useEffect, useLayoutEffect, useState } from "react";
import { highlightAndFormatSql } from "../utils/shared";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { format } from "sql-formatter";

function ShikiNodeFormatter(props: {
	children: JSX.Element;
	lineLength: number;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const el = containerRef.current;
		if (el) {
			setIsOverflowing(el.scrollHeight > el.clientHeight);
		}
	}, [props.children, props.lineLength]);

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
			className="relative flex max-h-96 w-full min-w-full flex-col overflow-x-auto overflow-y-auto text-xs [&>pre]:p-2"
		>
			{props.lineLength > 1 ? (
				<div className="pt-2 pl-2 text-xs text-neutral-500">
					{props.lineLength} lines
				</div>
			) : (
				""
			)}
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

function EditButton(props: {
	mode: "view" | "editing" | "edited";
	setMode: (b: "view" | "editing" | "edited") => void;
	handleSave: () => void;
}) {
	const handleClick = () => {
		if (props.mode === "view") {
			props.setMode("editing");
		}
		if (props.mode === "editing") {
			props.setMode("edited");
		} else {
			props.setMode("editing");
		}
	};
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => handleClick()}
			className="h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200"
		>
			{(props.mode === "view" || props.mode === "edited") && (
				<>
					<SquarePen className="mr-1 h-3 w-3" />
					Edit
				</>
			)}
			{props.mode === "editing" && (
				<>
					<Save className="mr-1 h-3 w-3" />
					Save
				</>
			)}
		</Button>
	);
}

function CancelButton(props: { handleCancel: () => void }) {
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={props.handleCancel}
			className="h-7 p-1 text-xs hover:cursor-pointer hover:bg-neutral-200"
		>
			<X className="mr-1 h-3 w-3" />
			Cancel
		</Button>
	);
}

export default function SqlQueryCodeBlock(props: {
	sqlQuery: string;
	mode: "view" | "editing" | "edited";
	setMode: (b: "view" | "editing" | "edited") => void;
}) {
	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);
	const [draftSql, setDraftSql] = useState<string>("");

	const formattedQuery = format(props.sqlQuery, { language: "duckdb" });

	useLayoutEffect(() => {
		highlightAndFormatSql(formattedQuery, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, [formattedQuery, props.mode]);

	useEffect(() => {
		if (props.mode === "editing") {
			setDraftSql(formattedQuery);
		}
	}, [props.mode, formattedQuery]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(formattedQuery);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleCancel = () => {
		props.setMode("view");
	};

	const handleSave = () => {
		// todo pass the ref from the parents to update the display...
		// Optionally format before saving
		// const next = format(draftSql, { language: "duckdb" });
		// Lift state up if parent owns it
		// props.onChangeSql?.(next);
		props.setMode("edited");
	};

	return (
		<div className="mb-2 flex min-w-full flex-col rounded-t-xs ring-2 ring-neutral-200">
			<div className="flex items-center justify-between rounded-t-xs bg-neutral-200">
				<span className="pl-2 text-xs font-medium text-neutral-800">
					SQL Query
				</span>
				<div>
					{(props.mode === "view" || props.mode === "edited") && (
						<CopyButton copied={copied} handleCopy={handleCopy} />
					)}
					{props.mode === "editing" && (
						<CancelButton handleCancel={handleCancel} />
					)}
					<EditButton
						mode={props.mode}
						setMode={props.setMode}
						handleSave={handleSave}
					/>
				</div>
			</div>
			{props.mode === "editing" ? (
				<textarea
					className="h-[60vh] min-h-0 w-full resize-y bg-white p-2 font-mono text-xs outline-none"
					value={draftSql}
					onChange={(e) => setDraftSql(e.target.value)}
					spellCheck={false}
				/>
			) : nodes ? (
				<ShikiNodeFormatter lineLength={lineLength}>{nodes}</ShikiNodeFormatter>
			) : (
				<div className="text-xs text-neutral-500">Loading...</div>
			)}
		</div>
	);
}
