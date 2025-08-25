import * as duckdb from "@duckdb/duckdb-wasm";

export async function runQuery(c: duckdb.AsyncDuckDBConnection, query: string) {
  const res = await c.query(query);
  const headers = res.schema.fields.map((f) => f.name);
  const rows = res.toArray().map(Object.values);
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

export async function listTables(c: duckdb.AsyncDuckDBConnection) {
  const res = await c.query(`SHOW TABLES;`);
  const tables = res.toArray();
  console.log(tables);
  return tables;
}
