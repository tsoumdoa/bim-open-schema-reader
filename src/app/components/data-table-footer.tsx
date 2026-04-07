"use no memo";

import { Button } from "@/components/ui/button";
import { Table as TableType } from "@tanstack/react-table";

export function DataTableFooter<TData>(props: {
	index: number;
	table: TableType<TData>;
	pageSize: number;
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
	const { table, pageSize } = props;
	return (
		<div className="flex flex-row items-center justify-end space-x-2 pt-3">
			{table.getRowCount() > pageSize && (
				<div className="flex items-center justify-end space-x-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							table.previousPage();
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
