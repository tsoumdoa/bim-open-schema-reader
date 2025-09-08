import { Button } from "@/components/ui/button";
import { Table as TableType } from "@tanstack/react-table";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

export function DataTableFooter<TData>(props: {
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
