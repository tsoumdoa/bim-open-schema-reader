import { strinfigyJsonWithBigInt } from "../utils/shared";
import { ExportFileType } from "../utils/types";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { useState } from "react";

function CopiedMessage(props: {
	open: boolean;
	fileFormat: ExportFileType;
	children?: React.ReactNode;
}) {
	return (
		<Tooltip open={props.open}>
			<TooltipTrigger asChild>
				<span className="text-md leading-tight font-bold hover:cursor-help">
					{props.children}
				</span>
			</TooltipTrigger>
			<TooltipContent side="top" align="start">
				<p>Copied to clipboard as {props.fileFormat}</p>
			</TooltipContent>
		</Tooltip>
	);
}

export function CopyButton(props: {
	getTableDataAsCsv: () => string;
	getTableDataAsTsv: () => string;
	getTableDataAsJson: () => Record<string, unknown>[];
}) {
	const [openCopied, setOpenCopied] = useState(false);
	const [fileFormat, setFileFormat] = useState<ExportFileType>("csv");
	const handleCopy = (fileFormat: ExportFileType) => {
		if (fileFormat === "json") {
			setFileFormat("json");
			navigator.clipboard.writeText(
				strinfigyJsonWithBigInt(props.getTableDataAsJson())
			);
		} else if (fileFormat === "csv") {
			setFileFormat("csv");
			navigator.clipboard.writeText(props.getTableDataAsCsv());
		} else if (fileFormat === "tsv") {
			setFileFormat("tsv");
			navigator.clipboard.writeText(props.getTableDataAsTsv());
		} else {
			return;
		}

		setOpenCopied(true);
		setTimeout(() => setOpenCopied(false), 800);
	};
	return (
		<CopiedMessage open={openCopied} fileFormat={fileFormat}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size={"sm"}
						variant="ghost"
						className="hover:cursor-pointer hover:bg-transparent"
					>
						<Copy className="text-neutral-800" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="bottom" className="text-xs">
					<DropdownMenuItem
						onClick={() => {
							handleCopy("csv");
						}}
						className="text-xs font-semibold"
					>
						Copy as csv
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							handleCopy("tsv");
						}}
						className="text-xs font-semibold"
					>
						Copy as tsv
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							handleCopy("json");
						}}
						className="text-xs font-semibold"
					>
						Copy as json
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</CopiedMessage>
	);
}
