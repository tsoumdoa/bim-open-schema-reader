import * as duckdb from "@duckdb/duckdb-wasm";
import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
export default function ListDataByCategories(props: {
	c: duckdb.AsyncDuckDBConnection;
}) {
	const { headers, rows, runSuccess } = useRunDuckDbQuery(
		props.c,
		listCountByCategory
	);
	console.log(headers, rows);
	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto">
				<table className="table-auto w-full">
					<thead>
						<tr>
							<th className="text-left">Category</th>
							<th className="text-left">Count</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, index) => (
							<tr key={`category-count-${index}`}>
								<td className="text-left">{row[0]}</td>
								<td className="text-left">{row[1]}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
