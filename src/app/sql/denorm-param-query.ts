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
    Name_1 AS param_name,
    VALUE AS param_value,
    Units,
    "Group" AS param_group,
    --project_name,
    --GlobalId,
    --category,
    --path_name,
  FROM
    double_data
  ORDER BY
    localid;
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
    Name_1 AS param_name,
    name_3 AS param_value,
    category_1 AS param_category,
    --GlobalId,
    --category,
    --path_name,
  FROM
    entity_data
  WHERE
    entity_data.category_1 != '__DOCUMENT__'
  ORDER BY
    localid;
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
    Name_1 AS param_name,
    VALUE AS param_value,
    "GROUP" AS param_group,
    --GlobalId,
    --category,
    --path_name,
  FROM
    int_data
  ORDER BY
    localid;
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
    name_1 AS param_name,
    X,
    Y,
    Z,
    --GlobalId,
    --category,
    --path_name,
  FROM
    pt_data
  ORDER BY
    localid;
`;

export const denormPointsParamsPivot = (categoryName: string) => sql`
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
    localid,
    name,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Min' THEN x
      END
    ) AS bounds_min_x,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Min' THEN y
      END
    ) AS bounds_min_y,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Min' THEN z
      END
    ) AS bounds_min_z,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Max' THEN x
      END
    ) AS bounds_max_x,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Max' THEN y
      END
    ) AS bounds_max_y,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Bounds.Max' THEN z
      END
    ) AS bounds_max_z,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.Point' THEN x
      END
    ) AS location_pt_x,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.Point' THEN y
      END
    ) AS location_pt_y,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.Point' THEN z
      END
    ) AS location_pt_z,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.StartPoint' THEN x
      END
    ) AS location_start_pt_x,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.StartPoint' THEN y
      END
    ) AS location_start_pt_y,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.StartPoint' THEN z
      END
    ) AS location_start_pt_z,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.EndPoint' THEN x
      END
    ) AS location_end_pt_x,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.EndPoint' THEN y
      END
    ) AS location_end_pt_y,
    MAX(
      CASE
        WHEN name_1 = 'rvt:Element:Location.EndPoint' THEN z
      END
    ) AS location_end_pt_z
  FROM
    pt_data
  GROUP BY
    localid,
    name
  ORDER BY
    localid;
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
    Name_1 AS param_name,
    Strings AS param_value,
    "GROUP" AS param_group,
    --GlobalId,
    --category,
    --path_name,
  FROM
    str_data
  ORDER BY
    localid;
`;
