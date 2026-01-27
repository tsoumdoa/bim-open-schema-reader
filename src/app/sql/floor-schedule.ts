import { sql } from "../utils/queries";

export const floorSchedule = sql`
  WITH
    pt_data AS (
      SELECT
        LocalId,
        e.Name,
      FROM
        denorm_entities AS e
        INNER JOIN denorm_points_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Floors'
    ),
    double_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_single_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Floors'
    ),
    pivot_double_data AS (
      PIVOT double_data ON name_1 IN ('Thickness', 'Area', 'Volume') USING first (VALUE),
      -- first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    ),
    joint_table AS (
      SELECT DISTINCT
        pt_data.*,
        pivot_double_data.* EXCLUDE (LocalId, name),
      FROM
        pivot_double_data
        JOIN pt_data ON pivot_double_data.LocalId = pt_data.LocalId
    )
  SELECT
    LocalId,
    name,
    Thickness * 304.8 AS thickness_mm,
    Area * 0.092903 AS area_m2,
    Volume * 0.0283168 AS volume_m3
  FROM
    joint_table
  ORDER BY
    localid;
`;
