import { createContext, useContext } from "react";
import { DuckDBCtx } from "../utils/types";
import * as duckdb from "@duckdb/duckdb-wasm";

const DbContext = createContext<DuckDBCtx | null>(null);

export function DuckDbProvider(props: {
	db: duckdb.AsyncDuckDB;
	c: duckdb.AsyncDuckDBConnection;
	children: React.ReactNode;
}) {
	return (
		<DbContext.Provider value={{ db: props.db, conn: props.c }}>
			{props.children}
		</DbContext.Provider>
	);
}

export function useDuckDb() {
	const ctx = useContext(DbContext);
	if (!ctx) {
		throw new Error("useDb must be used within a DbProvider");
	}
	return ctx;
}
