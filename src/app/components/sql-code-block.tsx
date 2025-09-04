import { Check, Copy } from "lucide-react";
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
			// Check if content overflows vertically
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

export default function SqlQueryCodeBlock(props: { sqlQuery: string }) {
	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);

	const formattedQuery = format(props.sqlQuery, { language: "duckdb" });

	useLayoutEffect(() => {
		highlightAndFormatSql(formattedQuery, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(formattedQuery);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className="flex min-w-full flex-col rounded-t-xs ring-2 ring-neutral-200">
			<div className="flex items-center justify-between rounded-t-xs bg-neutral-200">
				<span className="pl-2 text-xs font-medium text-neutral-800">
					SQL Query
				</span>
				<CopyButton copied={copied} handleCopy={handleCopy} />
			</div>
			{nodes ? (
				<ShikiNodeFormatter lineLength={lineLength}>{nodes}</ShikiNodeFormatter>
			) : (
				<div className="text-xs text-neutral-500">Loading...</div>
			)}
		</div>
	);
}
