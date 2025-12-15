import { BosFileType, DuckDBCtx, UseQueryObjects } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";
import { createContext, useContext } from "react";

const DbContext = createContext<DuckDBCtx | null>(null);

export function DuckDbProvider(props: {
  db: duckdb.AsyncDuckDB;
  c: duckdb.AsyncDuckDBConnection;
  bosFileType: BosFileType;
  useQueryObjects: UseQueryObjects;
  children: React.ReactNode;
}) {
  return (
    <DbContext.Provider
      value={{
        db: props.db,
        conn: props.c,
        bosFileType: props.bosFileType,
      }}
    >
      {props.children}
    </DbContext.Provider>
  );
}

export function useDuckDb() {
  const ctx = useContext(DbContext);
  if (!ctx) {
    throw new Error("useDataReadinessFilter must be used within a DbProvider");
  }
  return ctx;
}
