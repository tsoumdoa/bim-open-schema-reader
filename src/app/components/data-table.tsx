"use no memo";
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
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronsUpDown,
	ChevronsDownUp,
	Copy,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatToMs } from "../utils/format";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

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

function CopiedMessage(props: {
	open: boolean;
	fileFormat: "csv" | "json";
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

function DataTableHeader<TData>(props: {
	table: TableType<TData>;
	queryTime: number;
	rowLength: number;
	getTableDataAsCsv: () => string;
	getTableDataAsJson: () => Record<string, any>[];
}) {
	const [openCopied, setOpenCopied] = useState(false);
	const [fileFormat, setFileFormat] = useState<"csv" | "json">("csv");
	const handleCopy = (fileFormat: "csv" | "json") => {
		if (fileFormat === "json") {
			setFileFormat("json");
			const json = JSON.stringify(props.getTableDataAsJson(), (_, value) =>
				typeof value === "bigint" ? value.toString() : value
			);
			navigator.clipboard.writeText(json);
		} else {
			setFileFormat("csv");
			navigator.clipboard.writeText(props.getTableDataAsCsv());
		}
		setOpenCopied(true);
		setTimeout(() => setOpenCopied(false), 800);
	};
	return (
		<div className="flex flex-row items-center justify-between">
			<div className="text-xs text-neutral-500">
				Query run in {formatToMs(props.queryTime)} -{" "}
				{props.rowLength.toLocaleString()} rows returned
			</div>
			<div className="flex flex-row items-center gap-x-1 text-xs">
				<CopiedMessage open={openCopied} fileFormat={fileFormat}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size={"sm"}
								variant="ghost"
								className="hover:cursor-pointer hover:bg-transparent"
							>
								<Copy className="h-3 w-3 text-neutral-800" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							side="bottom"
							className="text-xs"
						>
							<DropdownMenuItem
								onClick={() => {
									handleCopy("json");
								}}
								className="text-xs font-semibold"
							>
								Copy as json
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									handleCopy("csv");
								}}
								className="text-xs font-semibold"
							>
								Copy as csv
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CopiedMessage>
				<ColumnSelector table={props.table} />
			</div>
		</div>
	);
}

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
			className={`overflow-auto ${index === displayExpanded ? "max-h-[80vh]" : "max-h-80"
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

function DataTableFooter<TData>(props: {
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	table: TableType<TData>;
	pageSize: number;
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
	const {
		index,
		displayExpanded,
		setDisplayExpanded,
		table,
		pageSize,
		tableContainerRef,
	} = props;
	const scrollToTop = () => {
		if (tableContainerRef.current) {
			tableContainerRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};
	return (
		<div className="flex flex-row items-center justify-between space-x-2">
			<Button
				variant="ghost"
				className="hover:cursor-pointer hover:bg-transparent"
				onClick={() => {
					if (index === displayExpanded) {
						setDisplayExpanded(-1);
						return;
					}
					setDisplayExpanded(index);
				}}
			>
				{displayExpanded === index ? <ChevronsDownUp /> : <ChevronsUpDown />}
			</Button>
			{table.getRowCount() > pageSize && (
				<div className="flex items-center justify-end space-x-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							table.previousPage();
							scrollToTop();
						}}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							table.nextPage();
							scrollToTop();
						}}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			)}
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
	getTableDataAsJson: () => Record<string, any>[];
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
				getTableDataAsJson={props.getTableDataAsJson}
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
