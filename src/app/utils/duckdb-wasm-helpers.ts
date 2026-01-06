import { createBosTable, createHelperViwesAndTables } from "./queries";
import {
  BosFileType,
  ParquetBlob,
  validFileNames,
  validFileNamesWithGeo,
} from "./types";
import * as duckdb from "@duckdb/duckdb-wasm";

export async function runQuery(c: duckdb.AsyncDuckDBConnection, query: string) {
  try {
    const res = await c.query(query);
    const headers = res.schema.fields.map((f) => f.name);
    const rows: (string | number)[][] = res.toArray().map(Object.values);
    return { headers, rows };
  } catch (e) {
    throw e;
  }
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
  const isDoubleParamQuery = fileNames.includes("DoubleParameters.parquet");
  const query =
    createBosTable(fileNames) + createHelperViwesAndTables(isDoubleParamQuery);
  await c.query(query);
}
