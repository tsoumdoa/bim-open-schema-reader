import { useEffect, useRef, useState } from "react";
import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import {
  runQuery,
  importParquetFromBuffer,
  listTables,
} from "../utils/duckdb-wasm-helpers";

async function runTest(
  db: duckdb.AsyncDuckDB,
  c: duckdb.AsyncDuckDBConnection,
  setRows: (rows: any[]) => void
) {
  const jsonRowContent = [
    { col1: 1, col2: "foo" },
    { col1: 2, col2: "bar" },
  ];
  await db.registerFileText("rows.json", JSON.stringify(jsonRowContent));
  await c.insertJSONFromPath("rows.json", { name: "rows" });

  //query
  const query = `SELECT * FROM rows`;
  const { headers, rows } = await runQuery(c, query);
  setRows(rows);

  console.log("Headers:", headers);
  console.log("Rows:", rows);
}

function DbDisplay(props: {
  db: duckdb.AsyncDuckDB;
  c: duckdb.AsyncDuckDBConnection;
  parquetFileEntries: ParquetBlob[];
}) {
  const { db, c } = props;
  const hasRun = useRef(false); // kidna have to do this due to react strict mode

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!hasRun.current) {
      runTest(db, c, setRows);

      props.parquetFileEntries.forEach(async (entry) => {
        const { filename, parquet } = entry;
        await importParquetFromBuffer(
          db,
          c,
          parquet,
          filename.replace(".parquet", ""),
          filename
        );
        await listTables(c);
      });

      hasRun.current = true;
    }
  }, [db, c]);

  return (
    <div>
      DB Display
      <div>
        {rows.map((row, i) => (
          <div key={i}>{row.join(", ")}</div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticalDisplay(props: {
  parquetFileEntries: ParquetBlob[];
}) {
  const { dbRef, connectionRef, error, loading } = useDuckDB();

  if (!error && loading) {
    return <div>Initializing...</div>;
  }

  if (dbRef.current && connectionRef.current) {
    return (
      <DbDisplay
        db={dbRef.current}
        c={connectionRef.current}
        parquetFileEntries={props.parquetFileEntries}
      />
    );
  }

  return <div>Something went wrong, try again</div>;
}
