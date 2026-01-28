"use no memo";

import { formatToMs } from "../utils/format";
import { CopyButton } from "./copy-result-button";
import { SaveButton } from "./save-result-button";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table as TableType } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function QueryTimeDisplay(props: { queryTime: number; rowLength: number }) {
	return (
		<div className="text-xs text-neutral-500">
			Query run in {formatToMs(props.queryTime)} -{" "}
			{props.rowLength.toLocaleString()} rows returned
		</div>
	);
}

function ColumnSelector<TData>(props: { table: TableType<TData> }) {
	const [toggleAll, setToggleAll] = useState(false);
	const [open, setOpen] = useState(false);
	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-2 hover:cursor-pointer hover:bg-transparent"
					size="sm"
				>
					Columns <ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="z-50">
				{props.table
					.getAllColumns()
					.filter((column) => column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="text-xs capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
								onSelect={(e) => e.preventDefault()}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
				<Separator className="my-2" />
				<DropdownMenuCheckboxItem
					className="text-xs font-semibold text-neutral-600"
					checked={props.table
						.getAllColumns()
						.every((col) => col.getIsVisible())}
					onCheckedChange={(value) => {
						props.table
							.getAllColumns()
							.filter((col) => col.getCanHide())
							.forEach((col) => col.toggleVisibility(!!value));
						setToggleAll(!toggleAll);
					}}
					onSelect={(e) => e.preventDefault()}
				>
					{!toggleAll ? "Hide All" : "Show All"}
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DataTableHeader<TData>(props: {
	table: TableType<TData>;
	queryTime: number;
	rowLength: number;
	getTableDataAsCsv: () => string;
	getTableDataAsTsv: () => string;
	getTableDataAsJson: () => Record<string, unknown>[];
	fileDownloadName: string;
}) {
	return (
		<div className="flex flex-row items-center justify-between">
			<QueryTimeDisplay
				queryTime={props.queryTime}
				rowLength={props.rowLength}
			/>

			<div className="flex flex-row items-center gap-x-0 text-xs">
				<SaveButton
					getTableDataAsCsv={props.getTableDataAsCsv}
					getTableDataAsTsv={props.getTableDataAsTsv}
					getTableDataAsJson={props.getTableDataAsJson}
					fileDownloadName={props.fileDownloadName}
				/>
				<CopyButton
					getTableDataAsCsv={props.getTableDataAsCsv}
					getTableDataAsTsv={props.getTableDataAsTsv}
					getTableDataAsJson={props.getTableDataAsJson}
				/>
				<ColumnSelector table={props.table} />
			</div>
		</div>
	);
}
