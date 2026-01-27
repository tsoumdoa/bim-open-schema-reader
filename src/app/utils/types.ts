import { useExpandDisplay } from "../hooks/use-expand-display";
import useFilterByDataReadiness from "../hooks/use-filter-by-data-readiness";
import { useKeywordFilter } from "../hooks/use-keyword-filter";
import { useQueryObjects } from "../hooks/use-query-objects";
import useQueryViewerAndEditor from "../hooks/use-query-viewer-and-editor";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";

export const validFileNames = [
	"Diagonistics.parquet",
	"Descriptors.parquet",
	"Documents.parquet",
	// "SingleParameters.parquet", //TODO: Removed from validation for now
	"Entities.parquet",
	"Relations.parquet",
	"EntityRelation.parquet",
	"EntityParameters.parquet",
	"IntegerParameters.parquet",
	"PointParameters.parquet",
	"Points.parquet",
	"Relations.parquet",
	"StringParameters.parquet",
	"Strings.parquet",
];

export const validFileNamesWithGeo = [
	"Descriptors.parquet",
	"Diagnostics.parquet",
	"Documents.parquet",
	// "SingleParameters.parquet", //TODO: Removed from validation for now
	"Instances.parquet",
	"Entities.parquet",
	"Relations.parquet",
	"EntityParameters.parquet",
	"IndexBuffer.parquet",
	"IntegerParameters.parquet",
	"Materials.parquet",
	"Meshes.parquet",
	"PointParameters.parquet",
	"Points.parquet",
	"Relations.parquet",
	"StringParameters.parquet",
	"Strings.parquet",
	"Transforms.parquet",
	"VertexBuffer.parquet",
];

export const NonGeoTableNames = [
	"Descriptors",
	"Documents",
	"Entities",
	"EntityParameters",
	"IntegerParameters",
	"PointParameters",
	"Points",
	"Relations",
	"StringParameters",
	"Strings",
	"SingleParameters", //
	"DoubleParameters", // WARNING: DoubleParameters to be deprecated
];
export const GeoTableNames = [
	"Instances",
	"IndexBuffer",
	"Materials",
	"Meshes",
	"Transforms",
	"VertexBuffer",
];

export type ValidFileNames = (typeof validFileNames)[number];
export type ValidFileNamesWithGeo = (typeof validFileNamesWithGeo)[number];

export type BosFileType = "INVALID" | "GEO" | "NON_GEO";
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
export const denormTableNames = [
	"denorm_double_params",
	"denorm_entity_params",
	"denorm_integer_params",
	"denorm_points_params",
	"denorm_string_params",
];
export const denormGeoTableNames = [
	"denorm_elements",
	"denorm_index_buffer",
	"denorm_materials",
	"denorm_meshes",
	"denorm_transforms",
	"denorm_vertex_buffer",
];

export type DenormTableName = (typeof denormTableNames)[number];
export type DenormGeoTableName = (typeof denormGeoTableNames)[number];

export type ParquetBlob = {
	filename: string;
	parquet: Uint8Array;
};

export const queryCategories = [
	"CAD & RVT Links",
	"Floors",
	"Grids",
	"Levels",
	"Materials",
	"Rooms",
	"Sheets",
	"Structure",
	"Tags",
	"Views",
	"Walls",
] as const;
export type QueryCategory = (typeof queryCategories)[number];

export type QueriesSelector = {
	queryCategory: QueryCategory;
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
export type UseFilterByDataReadiness = ReturnType<
	typeof useFilterByDataReadiness
>;
export type UseKeywordFilter = ReturnType<typeof useKeywordFilter>;

export type UseQueryViewerAndEditor = ReturnType<
	typeof useQueryViewerAndEditor
>;
export type DuckDBCtx = {
	db: duckdb.AsyncDuckDB;
	conn: duckdb.AsyncDuckDBConnection;
	bosFileType: BosFileType;
};
export type QueryObjectCtx = {
	useQueryObjects: UseQueryObjects;
};

// for categorizing categories
export const generalCategory = [
	"Project Setting",
	"RVT & CAD Links",
	"Level & Grid",
	"Materials",
	"Massing, Site & Landscape",
	"Room & Area",
	"Architecture",
	"Curtain Wall System",
	"Wall Assembly",
	"Model Elements",
	"Structure",
	"M&E",
	"View",
	"Sheets and Schedules",
	"Annotate & Graphics",
	"Architecture Tags",
	"Structure Tags",
	"M&E Tags",
	"Analytical",
	"Misc",
] as const;
export type GeneralCategory = (typeof generalCategory)[number];

export type CategoryObj = {
	generalCategory: GeneralCategory;
	categoryWithReadiness: CategoryWithReadiness[];
};

export type CategoryWithReadiness = {
	categoryName: string;
	analyticReadiness: AnalyticsReadinessLevels;
};

export type GenerailCategoryObj = {
	generalCategory: GeneralCategory;
	categoryName: string;
	analyticalReadiness: AnalyticsReadinessLevels;
};

export type CategoryObjs = CategoryObj[];
export type DenormParamQueryType = "flatten" | "pivot" | "stats";

//analytic readiness
export const analyticReadinessLevels = Object.freeze([
	"GEO",
	"ANA",
	"MLT",
	"QTY",
	"LOW",
] as const);
export const analyticReadinessTitles = Object.freeze([
	"Geometric Ready",
	"Analytics Rich",
	"Minimal Metrics",
	"Quantities Only",
	"Limited Value",
] as const);
export type AnalyticsReadinessLevels = (typeof analyticReadinessLevels)[number];
export type AnalyticsReadinessTitle = (typeof analyticReadinessTitles)[number];
