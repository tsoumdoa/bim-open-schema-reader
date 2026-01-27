import { sql } from "../utils/queries";

export const roomScheduleByLevel = sql`
  WITH
    double_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_single_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Rooms'
    ),
    pivot_double_data AS (
      PIVOT double_data ON name_1 IN ("Volume", "Area", "Unbounded Height", "Perimeter") USING first (VALUE),
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
        (pdd.Area * 0.092903) AS area_m2,
        pdd.Perimeter * 304.8 AS perimeter_mm,
        (pdd."Unbounded Height" * 304.8) AS height_mm,
        (pdd.Volume * 0.0283168) AS volume_m3
      FROM
        pivot_str_data AS psd
        LEFT JOIN pivot_double_data AS pdd ON psd.LocalId = pdd.LocalId
    )
  SELECT
    COALESCE(Level, 'Unplaced') AS Level,
    COUNT(*) AS room_count,
    SUM(area_m2) AS total_area_m2,
    sum(perimeter_mm) AS total_perimeter_mm,
    MIN(height_mm) AS min_height_mm,
    MAX(height_mm) AS max_height_mm,
    SUM(volume_m3) AS total_volume_m3
  FROM
    joint
  GROUP BY
    Level
  ORDER BY
    Level;
`;
