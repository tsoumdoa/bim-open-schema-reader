import * as duckdb from "@duckdb/duckdb-wasm";
import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
export default function ListDataByCategories(props: {
  c: duckdb.AsyncDuckDBConnection;
}) {
  const { rows } = useRunDuckDbQuery(props.c, listCountByCategory);
  return (
    <div className="flex flex-col text-xs">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="tracking-tight">
              <th className="text-left">Name</th>
              <th className="text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows &&
              rows.map((row, index) => (
                <tr key={`category-count-${index}`}>
                  <td className="text-left tracking-tight">
                    {row[0] || (
                      <span className="text-neutral-500">undefined</span>
                    )}
                  </td>
                  <td className="pr-1 text-right">{row[1].toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
