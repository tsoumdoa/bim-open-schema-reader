"use no memo";

import { formatData } from "../utils/format";
import { RunDuckDbQuery } from "../utils/types";
import { DataTableFooter } from "./data-table-footer";
import { DataTableHeader } from "./data-table-header";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TableType,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useRef, useState } from "react";

function DataTableBody<TData, TValue>(props: {
	index: number;
	table: TableType<TData>;
	pageSize: number;
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
	displayExpanded: number;
	columnDef: ColumnDef<TData, TValue>[];
}) {
	const {
		index,
		table,
		pageSize,
		tableContainerRef,
		displayExpanded,
		columnDef: columns,
	} = props;
	return (
		<div
			className={`overflow-auto ${
				index === displayExpanded
					? "h-[calc(100dvh-200px)] min-h-0"
					: "max-h-80"
			} `}
			ref={tableContainerRef}
		>
			<Table className="w-fit overflow-auto">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							<TableHead
								key={"empty-header"}
								className="sticky top-0 z-20 bg-white"
							/>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className="sticky top-0 z-20 bg-white tracking-tighter"
										onClick={header.column.getToggleSortingHandler()}
									>
										<div className="flex items-center gap-x-1 hover:cursor-pointer">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}

											{header.column.getIsSorted() && (
												<ArrowUpDown
													className={`h-4 w-4 transform transition-transform duration-300 ${header.column.getIsSorted() === "asc" ? "scale-x-[-1]" : "scale-x-100"} `}
												/>
											)}
										</div>
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="text-xs">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, i) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								<TableCell
									key={`cell-${i}`}
									className="sticky left-0 z-10 w-fit bg-white text-right text-neutral-500"
								>
									{i + 1 + table.getState().pagination.pageIndex * pageSize}
								</TableCell>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export function DataTable<TData, TValue>(props: {
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	fileDownloadName: string;
	runDuckDbQuery: RunDuckDbQuery;
}) {
	const { index, displayExpanded, setDisplayExpanded } = props;
	const [sorting, setSorting] = useState<SortingState>([]);
	const pageSize = 20;
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const columns = props.runDuckDbQuery.headers.map((header, i) => {
		return {
			accessorFn: (row: (string | number)[]) => row[i],
			header: header,
			cell: (info: any) => {
				return formatData(info.getValue());
			},
		};
	}) as ColumnDef<TData, TValue>[];
	const data = props.runDuckDbQuery.rows as TData[];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: pageSize,
			},
		},
	});

	return (
		<div className="w-full">
			<DataTableHeader
				table={table}
				queryTime={props.runDuckDbQuery.queryTime}
				rowLength={props.runDuckDbQuery.rows.length}
				getTableDataAsCsv={props.runDuckDbQuery.getTableDataAsCsv}
				getTableDataAsTsv={props.runDuckDbQuery.getTableDataAsTsv}
				getTableDataAsJson={props.runDuckDbQuery.getTableDataAsJson}
				fileDownloadName={props.fileDownloadName}
			/>
			<DataTableBody
				index={index}
				table={table}
				pageSize={pageSize}
				tableContainerRef={tableContainerRef}
				displayExpanded={displayExpanded}
				columnDef={columns}
			/>
			<DataTableFooter
				index={index}
				displayExpanded={displayExpanded}
				setDisplayExpanded={setDisplayExpanded}
				table={table}
				pageSize={pageSize}
				tableContainerRef={tableContainerRef}
			/>
		</div>
	);
}
