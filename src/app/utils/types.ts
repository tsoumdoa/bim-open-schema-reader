import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";

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
export type RunDuckDbQuery = ReturnType<typeof useRunDuckDbQuery>;
