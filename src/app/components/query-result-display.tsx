import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatData } from "../utils/format";

function MainTable(props: { headers: string[]; rows: (string | number)[][] }) {
	return (
		<Table className="overflow-auto">
			<TableHeader className="">
				<TableRow className="spacing font-semibold tracking-tight">
					<TableHead
						key={`header`}
						className="sticky top-0 z-20 bg-white"
					></TableHead>
					{props.headers.map((header, i) => (
						<TableHead
							key={`${i}-${header}`}
							className="sticky top-0 z-20 bg-white"
						>
							{header}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody className="text-xs">
				{props.rows.map((row, i) => (
					<TableRow key={`row-${i}`}>
						<TableCell key={`cell-${i}`} className="text-neutral-500">
							{i + 1}
						</TableCell>
						{row.map((cell, i) => (
							<TableCell key={`cell-${i}`}>{formatData(cell)}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default function QueryResultDisplay(props: {
	c: duckdb.AsyncDuckDBConnection;
	query: string;
}) {
	const { headers, rows, isLoading, isSuccess } = useRunDuckDbQuery(
		props.c,
		props.query
	);
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>;
	}
	if (isSuccess) {
		return <MainTable headers={headers} rows={rows} />;
	}
}
