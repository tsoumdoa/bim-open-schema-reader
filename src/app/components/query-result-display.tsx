import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";
import { DataTable } from "./data-table";
import { formatData } from "../utils/format";

export default function QueryResultDisplayTable(props: {
	c: duckdb.AsyncDuckDBConnection;
	query: string;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	lockScroll: boolean;
}) {
	const {
		headers,
		rows,
		isLoading,
		isSuccess,
		queryTime,
		error,
		getTableDataAsCsv,
		getTableDataAsJson,
	} = useRunDuckDbQuery(props.c, props.query);

	if (error) {
		return (
			<div className="text-sm font-semibold text-red-500">{error.message}</div>
		);
	}
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isSuccess && rows.length > 0) {
		const columnDef = headers.map((header, i) => {
			return {
				accessorFn: (row: (string | number)[]) => row[i],
				header: header,
				cell: (info: any) => {
					return formatData(info.getValue());
				},
			};
		});

		return (
			<div
				className={`flex h-full max-w-[90rem] flex-col gap-y-2 ${props.lockScroll ? "overflow-hidden" : "overflow-auto"}`}
			>
				<DataTable
					columns={columnDef}
					data={rows}
					queryTime={queryTime}
					rowLength={rows.length}
					index={props.index}
					displayExpanded={props.displayExpanded}
					setDisplayExpanded={props.setDisplayExpanded}
					getTableDataAsCsv={getTableDataAsCsv}
					getTableDataAsJson={getTableDataAsJson}
				/>
			</div>
		);
	} else {
		return <div className="text-xs text-neutral-500">No results found.</div>;
	}
}
