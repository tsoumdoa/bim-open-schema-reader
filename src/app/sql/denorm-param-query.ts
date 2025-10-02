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

export const denormDoubleParamsPivot = (categoryName: string) => sql`
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
    ),
    pivot_double_data AS (
      PIVOT double_data ON name_1 -- IN ('Base Diameter')
      USING first (VALUE) AS param_value,
      first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
    --<param_name_in_returned_column>
  FROM
    pivot_double_data AS pdd
    --where <param_name_in_returned_column> is not null
  ORDER BY
    LocalId
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

export const denormEntityParamsPivot = (categoryName: string) => sql`
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
    ),
    pivot_entity_data AS (
      PIVOT entity_data ON name_1 --IN (<name_of_param_to_filter>)
      USING first (name_3) AS param_value,
      first (category_1) AS param_category
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
    --<param_name_in_returned_column>
  FROM
    pivot_entity_data AS ped
    --WHERE <param_name_in_returned_column> is not null
  ORDER BY
    LocalId;
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

export const denormIntegerParamsPivot = (categoryName: string) => sql`
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
    ),
    pivot_int_data AS (
      PIVOT int_data ON name_1 --IN (<name_of_param_to_filter>)
      USING first (VALUE) AS param_value,
      first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
    --<param_name_in_returned_column>
  FROM
    pivot_int_data AS pid
    --where <param_name_in_returned_column> is not null
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
    ),
    pt_data_pivot AS (
      PIVOT pt_data ON name_1 --IN ('rvt:Element:Bounds.Max')
      USING first (x) AS x,
      first (y) AS y,
      first (z) AS z,
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
  FROM
    pt_data_pivot
  ORDER BY
    LocalId
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

export const denormStringParamsPivot = (categoryName: string) => sql`
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
    ),
    pivot_str_data AS (
      PIVOT str_data ON name_1 --IN (<name_of_param_to_filter>)
      USING first (Strings) AS param_value,
      first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
    --<param_name_in_returned_column>
  FROM
    pivot_str_data AS psd
    --where <param_name_in_returned_column> is not null
  ORDER BY
    localid;
`;
