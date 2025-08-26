import * as duckdb from "@duckdb/duckdb-wasm";

export const sql = (strings: TemplateStringsArray, ...values: string[]) =>
	strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

export async function runQuery(c: duckdb.AsyncDuckDBConnection, query: string) {
	const res = await c.query(query);
	const headers = res.schema.fields.map((f) => f.name);
	const rows: (string | number)[][] = res.toArray().map(Object.values);
	return { headers, rows };
}

function sanitizeTableName(name: string) {
	let safe = name.replace(/[^a-zA-Z0-9_]/g, "_");
	if (!/^[a-zA-Z]/.test(safe)) {
		safe = "t_" + safe;
	}
	return safe;
}

function validateFilename(name: string) {
	const safe = sanitizeTableName(name);
	if (safe.endsWith(".parquet")) {
		return safe;
	} else {
		return safe + ".parquet";
	}
}

export async function importParquetFromBuffer(
	db: duckdb.AsyncDuckDB,
	c: duckdb.AsyncDuckDBConnection,
	buffer: Uint8Array,
	rawTableName: string,
	rawFilename: string
) {
	const tableName = sanitizeTableName(rawTableName);
	const filename = validateFilename(rawFilename);
	await db.registerFileBuffer(filename, buffer);
	await c.query(
		`CREATE TABLE ${tableName} AS
   SELECT * FROM ${filename}`
	);
}
