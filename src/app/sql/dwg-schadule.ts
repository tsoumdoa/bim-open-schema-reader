import { sql } from "../utils/queries";

export const dwgSchedule = sql`
  WITH
    double_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_double_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Rooms'
    ),
    pivot_double_data AS (
      PIVOT double_data ON name_1 IN ("Volume", "Area", "Unbounded Height") USING first (VALUE),
      -- first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    ),
    str_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Rooms'
    ),
    pivot_str_data AS (
      PIVOT str_data ON name_1 IN (
        "Level",
        "Floor Finish",
        "Wall Finish",
        "Base Finish",
        "Ceiling Finish",
        "Comments",
        "Department"
      ) USING first (Strings)
      GROUP BY
        LocalId,
        name
    ),
    joint AS (
      SELECT DISTINCT
        psd.*,
        pdd.Area * 0.092903 AS area_m2,
        pdd."Unbounded Height" * 304.8 AS height_mm,
        pdd.Volume * 0.0283168 volume_m3,
      FROM
        pivot_str_data AS psd
        LEFT JOIN pivot_double_data AS pdd ON psd.LocalId = pdd.LocalId
    )
  SELECT
    *
  FROM
    joint
  ORDER BY
    Level,
    name;
`;
