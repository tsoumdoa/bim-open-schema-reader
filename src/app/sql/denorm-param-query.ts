import { sql } from "../utils/queries";

export const denormDoubleParams = (categoryName: string) => sql`
  WITH
    double_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_double_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = '${categoryName}'
    )
  SELECT
    LocalId,
    name,
    VALUE,
    Name_1,
    Units,
    "Group",
    project_name,
    --GlobalId,
    --category,
    --path_name,
  FROM
    double_data
  ORDER BY
    index
`;

export const denormEntityParams = (categoryName: string) => sql`
  WITH
    entity_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_entity_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
        INNER JOIN denorm_entities AS e2 ON p.Value = e2.index
      WHERE
        e.category = '${categoryName}'
    )
  SELECT
    LocalId,
    name,
    VALUE,
    Name_1,
    category_1,
    name_3,
    --GlobalId,
    --category,
    --path_name,
  FROM
    entity_data
  WHERE
    entity_data.category_1 != '__DOCUMENT__'
  ORDER BY
    index
`;

export const denormIntegerParams = (categoryName: string) => sql`
  WITH
    int_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_integer_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = '${categoryName}'
    )
  SELECT
    LocalId,
    Name_1,
    VALUE,
    "GROUP",
    --GlobalId,
    --category,
    --path_name,
  FROM
    int_data;
`;

export const denormPointsParams = (categoryName: string) => sql`
  WITH
    pt_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_points_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = '${categoryName}'
    )
  SELECT
    LocalId,
    name,
    VALUE,
    X,
    Y,
    Z,
    --GlobalId,
    --category,
    --path_name,
  FROM
    pt_data
  ORDER BY
    index
`;

export const denormStringParams = (categoryName: string) => sql`
  WITH
    str_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = '${categoryName}'
    )
  SELECT
    LocalId,
    name,
    VALUE,
    Strings,
    "GROUP"
    --GlobalId,
    --category,
    --path_name,
  FROM
    str_data;
`;
