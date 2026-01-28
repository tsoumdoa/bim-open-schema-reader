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
import { Save } from "lucide-react";
import { useState } from "react";

function SaveMessage(props: {
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

const downloadData = (
	fileName: string,
	fileType: ExportFileType,
	data: string
) => {
	let blobType: string;

	switch (fileType) {
		case "json":
			blobType = "application/json";
			break;
		case "tsv":
			blobType = "text/tab-separated-values";
			break;
		case "csv":
			blobType = "text/csv";
			break;
		default:
			blobType = "text/plain";
	}

	const blob = new Blob([data], { type: blobType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL(url);
};

export function SaveButton(props: {
	getTableDataAsCsv: () => string;
	getTableDataAsTsv: () => string;
	getTableDataAsJson: () => Record<string, unknown>[];
	fileDownloadName: string;
}) {
	const [openCopied, setOpenCopied] = useState(false);
	const [fileFormat, setFileFormat] = useState<ExportFileType>("csv");
	const handleSave = (fileFormat: ExportFileType) => {
		if (fileFormat === "json") {
			setFileFormat("json");
			const data = strinfigyJsonWithBigInt(props.getTableDataAsJson());
			const fileName = `${props.fileDownloadName} [${new Date().toISOString()}].json`;
			downloadData(fileName, fileFormat, data);
		} else if (fileFormat === "csv") {
			setFileFormat("csv");
			const data = props.getTableDataAsCsv();
			const fileName = `${props.fileDownloadName} [${new Date().toISOString()}].csv`;
			downloadData(fileName, fileFormat, data);
		} else if (fileFormat === "tsv") {
			setFileFormat("tsv");
			const data = props.getTableDataAsTsv();
			const fileName = `${props.fileDownloadName} [${new Date().toISOString()}].tsv`;
			downloadData(fileName, fileFormat, data);
		} else {
			return;
		}

		setOpenCopied(true);
		setTimeout(() => setOpenCopied(false), 800);
	};
	return (
		<SaveMessage open={openCopied} fileFormat={fileFormat}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size={"sm"}
						variant="ghost"
						className="hover:cursor-pointer hover:bg-transparent"
					>
						<Save className="h-2 w-2 text-neutral-800" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="bottom" className="text-xs">
					<DropdownMenuItem
						onClick={() => {
							handleSave("csv");
						}}
						className="text-xs font-semibold"
					>
						Save as csv
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							handleSave("tsv");
						}}
						className="text-xs font-semibold"
					>
						Save as tsv
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							handleSave("json");
						}}
						className="text-xs font-semibold"
					>
						Save as json
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SaveMessage>
	);
}
