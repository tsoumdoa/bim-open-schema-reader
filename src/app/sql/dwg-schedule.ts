import { sql } from "../utils/queries";

// NOTE: it shoule be able to export more data from Revit
// e.g. isPinned, isImported, etc...
// https://better-doc.tzero.one/revit-2025/all/85b534b8-dd6c-bc13-7c46-c803c83481e4/#_top
export const dwgSchedule = sql`
  WITH
    str_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category LIKE '%.dwg%'
    ),
    pivot_str_data AS (
      PIVOT str_data ON name_1 --IN (<name_of_param_to_filter>)
      USING first (Strings) --AS param_value, s
      --first (Units) AS param_units
      GROUP BY
        LocalId,
        name
    )
  SELECT DISTINCT
    name
  FROM
    pivot_str_data AS psd
  ORDER BY
    name;
`;
