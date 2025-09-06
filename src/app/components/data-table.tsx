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
import { useRef, useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronsUpDown,
	ChevronsDownUp,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatToMs } from "../utils/format";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	queryTime: number;
	rowLength: number;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
}

function ColumnSelector<TData>(props: { table: TableType<TData> }) {
	const [toggleAll, setToggleAll] = useState(false);
	const [open, setOpen] = useState(false);
	const closeTimeout = useRef<NodeJS.Timeout | null>(null);
	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-2 hover:bg-transparent" size="sm">
					Columns <ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				onMouseLeave={() => {
					closeTimeout.current = setTimeout(() => setOpen(false), 250);
				}}
				onMouseEnter={() => {
					if (closeTimeout.current) {
						clearTimeout(closeTimeout.current);
						closeTimeout.current = null;
					}
				}}
			>
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
					{toggleAll ? "Hide All" : "Show All"}
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DataTable<TData, TValue>({
	columns,
	data,
	queryTime,
	rowLength,
	index,
	displayExpanded,
	setDisplayExpanded,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const pageSize = 30;
	const tableContainerRef = useRef<HTMLDivElement>(null);
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

	const scrollToTop = () => {
		if (tableContainerRef.current) {
			tableContainerRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="">
			<div
				className={`overflow-auto ${index === displayExpanded ? "max-h-[80vh]" : "max-h-80"
					} `}
				ref={tableContainerRef}
			>
				<div className="flex flex-row items-center justify-between">
					<div className="text-xs text-neutral-500">
						Query run in {formatToMs(queryTime)} - {rowLength.toLocaleString()}{" "}
						rows returned
					</div>
					<ColumnSelector table={table} />
				</div>
				<Table className="overflow-auto">
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
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
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
		</div>
	);
}
