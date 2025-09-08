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

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { DataTableFooter } from "./data-table-footer";
import { DataTableHeader } from "./data-table-header";

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
			className={`overflow-auto ${index === displayExpanded ? "h-[80vh]" : "max-h-80"
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
							></TableHead>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className="sticky top-0 z-20 bg-white tracking-tight"
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
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	queryTime: number;
	rowLength: number;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	getTableDataAsCsv: () => string;
	getTableDataAsTsv: () => string;
	getTableDataAsJson: () => Record<string, unknown>[];
	fileDownloadName: string;
}) {
	const {
		columns,
		data,
		queryTime,
		rowLength,
		index,
		displayExpanded,
		setDisplayExpanded,
	} = props;
	const [sorting, setSorting] = useState<SortingState>([]);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const pageSize = 30;
	const tableContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = tableContainerRef.current;
		if (el) {
			setIsOverflowing(el.scrollWidth > el.clientWidth);
		}
	}, [tableContainerRef.current]);

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
		<div className={`${isOverflowing ? "w-full" : "w-fit"}`}>
			<DataTableHeader
				table={table}
				queryTime={queryTime}
				rowLength={rowLength}
				getTableDataAsCsv={props.getTableDataAsCsv}
				getTableDataAsTsv={props.getTableDataAsTsv}
				getTableDataAsJson={props.getTableDataAsJson}
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
