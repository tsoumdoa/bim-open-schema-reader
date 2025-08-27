import { validFileNames } from "./types";

export const sql = (strings: TemplateStringsArray, ...values: string[]) =>
	strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

export const createBosTable = () => {
	return validFileNames
		.map((fileName) => {
			return sql`
        CREATE TABLE ${fileName.replace(".parquet", "")} AS
        SELECT
          *
        FROM
          ${fileName};
      `;
		})
		.join("\n");
};

export const createHelperViwers = sql`
  -- adding index to Documents, Entities, Points & Strings as those table don't have an idex
  -- Entities table
  CREATE TABLE Entities_New AS
  SELECT
    *,
    (row_number() OVER () - 1) AS Index
  FROM
    Entities;

  DROP TABLE Entities;

  ALTER TABLE Entities_New
  RENAME TO Entities;

  -- Descriptors table
  CREATE TABLE Descriptors_New AS
  SELECT
    *,
    (row_number() OVER () - 1) AS Index
  FROM
    Descriptors;

  DROP TABLE Descriptors;

  ALTER TABLE Descriptors_New
  RENAME TO Descriptors;

  -- Documents table
  CREATE TABLE Documents_New AS
  SELECT
    *,
    (row_number() OVER () - 1) AS Index
  FROM
    Documents;

  DROP TABLE Documents;

  --Rename Documents Table
  ALTER TABLE Documents_New
  RENAME TO Documents;

  -- Points table
  CREATE TABLE Points_New AS
  SELECT
    *,
    (row_number() OVER () - 1) AS Index
  FROM
    Points;

  DROP TABLE Points;

  --Rename Points Table
  ALTER TABLE Points_New
  RENAME TO Points;

  -- Strings table
  CREATE TABLE Strings_New AS
  SELECT
    *,
    (row_number() OVER () - 1) AS Index
  FROM
    Strings;

  DROP TABLE Strings;

  --Rename Strings Table
  ALTER TABLE Strings_New
  RENAME TO Strings;

  -- parameter enum table
  CREATE
  OR REPLACE TABLE Enum_Parameter (Index INTEGER, ParameterType VARCHAR(20));

  INSERT INTO
    Enum_Parameter (Index, ParameterType)
  VALUES
    (0, 'Int'),
    (1, 'Double'),
    (2, 'Entity'),
    (3, 'String'),
    (4, 'Point');

  CREATE TABLE IF NOT EXISTS Enum_RelationType (Index INTEGER, RelationType VARCHAR(20));

  INSERT INTO
    Enum_RelationType (Index, RelationType)
  VALUES
    (0, 'PartOf'),
    (1, 'ElementOf'),
    (2, 'ContainedIn'),
    (3, 'InstanceOf'),
    (4, 'HostedBy'),
    (5, 'ChildOf'),
    (6, 'HasLayer'),
    (7, 'HasMaterial'),
    (8, 'ConnectsTo'),
    (9, 'HasConnector');

  -- denormalize entities
  CREATE
  OR REPLACE VIEW denorm_entities AS
  SELECT
    LocalId,
    GlobalId,
    Entities."index" AS index,
    Entities.name AS entity_name,
    s_name.Strings AS name,
    s_category.Strings AS category,
    s_path.Strings AS path_name,
    s_title.Strings AS project_name
  FROM
    Entities
    LEFT OUTER JOIN Strings AS s_name ON Entities."name" = s_name."index"
    LEFT OUTER JOIN Strings AS s_category ON Entities.category = s_category."index"
    LEFT OUTER JOIN Documents ON Entities.Document = Documents."index"
    LEFT OUTER JOIN Strings AS s_path ON Documents.Path = s_path."index"
    LEFT OUTER JOIN Strings AS s_title ON Documents.Title = s_title."index";

  -- denormalize descriptor
  CREATE
  OR REPLACE VIEW denorm_descriptors AS
  SELECT
    dsc.index AS index,
    strName.Strings AS Name,
    strUnit.Strings AS Units,
    strGroup.Strings AS GROUP,
    strType.Strings AS Type
  FROM
    Descriptors AS dsc
    LEFT OUTER JOIN Strings AS strName ON strName.index = dsc.Name
    LEFT OUTER JOIN Strings AS strUnit ON strUnit.index = dsc.Units
    LEFT OUTER JOIN Strings AS strGroup ON strGroup.index = dsc.Group
    LEFT OUTER JOIN Strings AS strType ON strType.index = dsc.Type;

  -- denormalize StringParameters
  CREATE
  OR REPLACE VIEW denorm_string_params AS
  SELECT
    *
  FROM
    StringParameters
    JOIN Strings ON Strings.index = StringParameters.Value
    JOIN denorm_descriptors ON denorm_descriptors.index = StringParameters.Descriptor;

  -- denormalize PointParameters
  CREATE
  OR REPLACE VIEW denorm_points_params AS
  SELECT
    *
  FROM
    PointParameters
    LEFT OUTER JOIN Points ON Points.index = PointParameters.Value
    LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = PointParameters.Descriptor;

  -- denormalize Double Parameters
  CREATE
  OR REPLACE VIEW denorm_double_params AS
  SELECT
    *
  FROM
    DoubleParameters
    LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = DoubleParameters.Descriptor;

  -- denormalize Integer Parameters
  CREATE
  OR REPLACE VIEW denorm_integer_params AS
  SELECT
    *
  FROM
    IntegerParameters
    LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = IntegerParameters.Descriptor;

  -- denormalize Entity Parameters
  CREATE
  OR REPLACE VIEW denorm_entity_params AS
  SELECT
    *
  FROM
    EntityParameters
    LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = EntityParameters.Descriptor
    LEFT OUTER JOIN denorm_entities AS de ON de.index = EntityParameters.Value;
`;

export const listAllTableInfo = sql`
  SELECT
    *
  FROM
    information_schema.tables;
`;

export const listAllTableInfoWithColumnInfo = sql`
  SELECT
    table_name,
    list (column_name),
    list (data_type),
    first (table_catalog)
  FROM
    information_schema.columns
    --where table_catalog LIKE 'memory'
  GROUP BY
    table_name
`;

// exmaple with string literal
// export const listAllTableInfo = (tableName: string) => sql`
//   SELECT
//     *
//   FROM
//     information_schema.tables;
//     where table_name = ${tableName};
// `;
