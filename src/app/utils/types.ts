import { useExpandDisplay } from "../hooks/use-expand-display";
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
export type QueryTitleState = "original" | "edited";
export type QueryEditorState =
	| "initial"
	| "stale"
	| "running"
	| "rerun"
	| "error"
	| "canceled";
export type DenormTableName =
	| "denorm_double_params"
	| "denorm_entity_params"
	| "denorm_integer_params"
	| "denorm_points_params"
	| "denorm_string_params";

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
	isCustom?: boolean;
	returnedRowsNumber?: number;
};

const exportFileTypes = ["csv", "tsv", "json"] as const;
export type ExportFileType = (typeof exportFileTypes)[number];
export type UseRunDuckDbQuery = ReturnType<typeof useRunDuckDbQuery>;
export type RunDuckDbQuery = ReturnType<typeof useRunDuckDbQuery>;
export type QueryObjects = QueryObject[];
export type UseQueryObjects = ReturnType<typeof useQueryObjects>;
export type UseExpandDisplay = ReturnType<typeof useExpandDisplay>;
export type DuckDBCtx = {
	db: duckdb.AsyncDuckDB;
	conn: duckdb.AsyncDuckDBConnection;
};
export type QueryObjectCtx = {
	useQueryObjects: UseQueryObjects;
};

// for categorizing categories
export const generalCategory = [
	"Project Setting",
	"Architecture",
	"Curtain Wall System",
	"Level & Grid",
	"Room & Area",
	"Structure",
	"M&E",
	"Massing, Site & Landscape",
	"Materials",
	"Wall Assembly",
	"Model Elements",
	"View",
	"RVT & CAD Links",
	"Analytical",
	"Annotate",
	"Misc",
] as const;
export type GeneralCategory = (typeof generalCategory)[number];

export type CategoryObj = {
	generalCategory: GeneralCategory;
	categoryNames: string[];
};

export type CategoryObjs = CategoryObj[];
