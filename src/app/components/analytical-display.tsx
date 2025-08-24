import { useDuckDB } from "../hooks/use-duckdb";
import { ParquetBlob } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";

function DbDisplay(props: { db: duckdb.AsyncDuckDBConnection }) {
  console.log(props.db);
  return <div>DB Display</div>;
}

export default function AnalyticalDisplay(props: {
  parquetFileEntries: ParquetBlob[];
}) {
  const { db, error, loading } = useDuckDB();

  if (!error && loading) {
    return <div>Initializing...</div>;
  }

  if (db) {
    return <DbDisplay db={db} />;
  }

  return <div>Something went wrong, try again</div>;
}
