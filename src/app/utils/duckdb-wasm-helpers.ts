import { createBosTable, createHelperViewsAndTables } from "./init-queries";
import { ParquetBlob } from "./types";
import * as duckdb from "@duckdb/duckdb-wasm";

export async function runQuery(c: duckdb.AsyncDuckDBConnection, query: string) {
	const res = await c.query(query);
	const headers = res.schema.fields.map((f) => f.name);
	const rows: unknown[][] = res.toArray().map(Object.values);
	return { headers, rows };
}

export async function registerParquetFile(
	db: duckdb.AsyncDuckDB,
	entry: ParquetBlob
) {
	await db.registerFileBuffer(entry.filename, entry.parquet);
}

// creating table from all parquet files
export async function initTables(
	c: duckdb.AsyncDuckDBConnection,
	fileNames: string[]
) {
	const query = createBosTable(fileNames) + createHelperViewsAndTables();
	await c.query(query);
}
