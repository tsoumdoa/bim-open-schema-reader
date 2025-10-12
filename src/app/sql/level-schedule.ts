import { sql } from "../utils/queries";

export const levelSchedule = sql`
  WITH
    level_data AS (
      SELECT
        p.index,
        p.name,
        p.LocalId,
        p.project_name,
        round(r0.value * 304.8, 0) AS elevation
      FROM
        denorm_entities AS p
        INNER JOIN denorm_string_params AS r2 ON p.index = r2.entity
        INNER JOIN denorm_double_params AS r0 ON p.index = r0.entity
      WHERE
        p.category LIKE 'Levels'
        AND r0.name LIKE 'Elevation'
      GROUP BY
        p.name,
        p.index,
        p.LocalId,
        p.project_name,
        r0.value
    ),
    int_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_integer_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Levels'
    ),
    filtered_int_data AS (
      SELECT
        LocalId,
        name,
        MAX(
          CASE
            WHEN Name_1 = 'Building Story' THEN CASE
              WHEN VALUE = 1 THEN 'True'
              ELSE 'False'
            END
          END
        ) AS building_story,
        MAX(
          CASE
            WHEN Name_1 = 'Structural' THEN CASE
              WHEN VALUE = 1 THEN 'True'
              ELSE 'False'
            END
          END
        ) AS structural
      FROM
        int_data
      GROUP BY
        LocalId,
        name
    ),
    joint_table AS (
      SELECT DISTINCT
        level_data.*,
        filtered_int_data.* EXCLUDE (LocalId, name),
      FROM
        level_data
        JOIN filtered_int_data ON level_data.LocalId = filtered_int_data.LocalId
    )
  SELECT
    -- index,
    -- LocalId,
    project_name,
    name,
    elevation,
    building_story,
    structural
  FROM
    joint_table
    -- WHERE
    --   project_name = 'Snowdon Towers Sample Architectural'
  ORDER BY
    elevation DESC,
    project_name;
`;
