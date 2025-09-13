import { useQueryObjects } from "../hooks/use-query-objects";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";

export const validFileNames = [
	"Points.parquet",
	"Strings.parquet",
	"Descriptors.parquet",
	"Documents.parquet",
	"Entities.parquet",
	"Relations.parquet",
	"DoubleParameters.parquet",
	"IntegerParameters.parquet",
	"StringParameters.parquet",
	"EntityParameters.parquet",
	"PointParameters.parquet",
] as const;

export type QueryDisplayState = "hidden" | "viewer" | "editor";
export type QueryState = "original" | "edited";
export type QueryEditorState =
	| "stale"
	| "running"
	| "rerun"
	| "error"
	| "canceled";

export type ParquetBlob = {
	filename: string;
	parquet: Uint8Array;
};

export type QueriesSelector = {
	queryCategory: string;
	queryObjects: QueryObject[];
};

export type QueryObject = {
	id?: string;
	queryCategory?: string;
	queryTitle: string;
	explaination: string;
	sqlQuery: string;
};

const exportFileTypes = ["csv", "tsv", "json"] as const;
export type ExportFileType = (typeof exportFileTypes)[number];
export type QueryObjects = QueryObject[];
export type UseRunDuckDbQuery = ReturnType<typeof useRunDuckDbQuery>;
export type RunDuckDbQuery = ReturnType<typeof useRunDuckDbQuery>;
export type UseQueryObject = ReturnType<typeof useQueryObjects>;
export type DuckDBCtx = {
	db: duckdb.AsyncDuckDB;
	conn: duckdb.AsyncDuckDBConnection;
};
