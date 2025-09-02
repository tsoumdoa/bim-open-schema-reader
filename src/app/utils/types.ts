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
  queryCategory?: string;
  queryTile: string;
  explaination: string;
  sqlQuery: string;
};

export type QueryObjects = QueryObject[];
