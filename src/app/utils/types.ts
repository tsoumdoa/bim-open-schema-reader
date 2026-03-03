import { useExpandDisplay } from "../hooks/use-expand-display";
import useFilterByDataReadiness from "../hooks/use-filter-by-data-readiness";
import { useKeywordFilter } from "../hooks/use-keyword-filter";
import { useQueryObjects } from "../hooks/use-query-objects";
import useQueryViewerAndEditor from "../hooks/use-query-viewer-and-editor";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";
import * as THREE from "three";

export const validFileNames = [
	"Descriptors.parquet",
	"Diagnostics.parquet",
	"Documents.parquet",
	"Entities.parquet",
	"EntityParameters.parquet",
	"IntegerParameters.parquet",
	"PointParameters.parquet",
	"Points.parquet",
	"Relations.parquet",
	"SingleParameters.parquet",
	"StringParameters.parquet",
	"Strings.parquet",
];

export const validFileNamesWithGeo = [
	"Descriptors.parquet",
	"Diagnostics.parquet",
	"Documents.parquet",
	"Entities.parquet",
	"EntityParameters.parquet",
	"IndexBuffer.parquet",
	"Instances.parquet",
	"IntegerParameters.parquet",
	"Materials.parquet",
	"Meshes.parquet",
	"PointParameters.parquet",
	"Points.parquet",
	"Relations.parquet",
	"SingleParameters.parquet",
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
	"SingleParameters",
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
	"denorm_descriptors",
	"denorm_entities",
	"denorm_single_params",
	"denorm_entity_params",
	"denorm_integer_params",
	"denorm_points_params",
	"denorm_string_params",
];
export const denormGeoTableNames = [
	"denorm_geometry_elements",
	"denorm_index_buffer_view",
	"denorm_instances_view",
	"denorm_materials_view",
	"denorm_meshes_view",
	"denorm_transforms_view",
	"denorm_vertex_buffer_view",
];

export type DenormTableName = (typeof denormTableNames)[number];
export type DenormGeoTableName = (typeof denormGeoTableNames)[number];

export type ParquetBlob = {
	filename: string;
	parquet: Uint8Array;
};

export const queryCategories = [
	"3D Viewer",
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
	explanation: string;
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
	analyticalReadiness: AnalyticsReadinessLevels;
};

export type GeneralCategoryObj = {
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

// for geometrical data processing

export type InstanceData = {
	instance_index: number;
	entity_index: number;
	material_index: number;
	mesh_index: number;
	transform_index: number;
	vertex_offset: number;
	index_offset: number;
	tx: number;
	ty: number;
	tz: number;
	qx: number;
	qy: number;
	qz: number;
	qw: number;
	sx: number;
	sy: number;
	sz: number;
	red: number;
	green: number;
	blue: number;
	alpha: number;
	roughness: number;
	metallic: number;
};

export type FilteredGeometryResult = {
	scene: THREE.Group | null;
	instanceCount: number;
	totalCount: number;
};

export type GeometryContextValue = {
	loading: boolean;
	error: Error | null;
	getFilteredScene: (entityIndices: number[]) => FilteredGeometryResult;
};

export type VertexData = {
	index: number;
	x: number;
	y: number;
	z: number;
};

export type IndexData = {
	index: number;
	index_value: number;
};

export type MeshData = {
	index: number;
	vertex_offset: number;
	index_offset: number;
};

export type MaterialData = {
	index: number;
	red: number;
	green: number;
	blue: number;
	alpha: number;
	roughness: number;
	metallic: number;
};

export type TransformData = {
	index: number;
	tx: number;
	ty: number;
	tz: number;
	qx: number;
	qy: number;
	qz: number;
	qw: number;
	sx: number;
	sy: number;
	sz: number;
};

export type GeometryInstance = {
	instanceIndex: number;
	entityIndex: number;
	meshIndex: number;
	transformIndex: number;
	materialIndex: number;
	LocalId: string;
	GlobalId: string;
	entityName: string;
	category: string;
	vertexOffset: number;
	indexOffset: number;
	transform: THREE.Matrix4;
	material: THREE.MeshStandardMaterial;
};

export type GeometricalDataCache = {
	vertices: VertexData[];
	indices: IndexData[];
	meshes: MeshData[];
	materials: MaterialData[];
	transforms: TransformData[];
	instances: InstanceData[];
};
