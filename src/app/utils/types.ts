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
