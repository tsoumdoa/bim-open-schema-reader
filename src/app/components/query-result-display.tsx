import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";
import { formatToMs } from "../utils/format";
import { DataTable } from "./data-table";

export default function QueryResultDisplay(props: {
	c: duckdb.AsyncDuckDBConnection;
	query: string;
}) {
	const { headers, rows, isLoading, isSuccess, queryTime } = useRunDuckDbQuery(
		props.c,
		props.query
	);
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>;
	}
	if (isSuccess) {
		const columnDef = headers.map((header, i) => {
			return {
				accessorFn: (row: (string | number)[]) => row[i],
				header: header,
			};
		});

		return (
			<div className="flex flex-col gap-y-2 overflow-auto">
				<div className="text-xs text-neutral-500">
					Query run in {formatToMs(queryTime)} - {rows.length.toLocaleString()}{" "}
					rows returned
				</div>
				<DataTable columns={columnDef} data={rows} />
			</div>
		);
	}
}
