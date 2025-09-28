import { sql } from "../utils/queries";

export const basicViewInfo = sql`
  WITH
    str_data AS (
      SELECT
        e.LocalId,
        e.name,
        p.Strings,
        p.Name
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Views'
    )
  SELECT
    LocalId,
    name,
    MAX(
      CASE
        WHEN Name_1 = 'Family' THEN Strings
      END
    ) AS Family,
    MAX(
      CASE
        WHEN Name_1 = 'Type' THEN Strings
      END
    ) AS Type,
    MAX(
      CASE
        WHEN Name_1 = 'Family and Type' THEN Strings
      END
    ) AS Family_and_Type,
    MAX(
      CASE
        WHEN Name_1 = 'Dependency' THEN Strings
      END
    ) AS dependency,
    MAX(
      CASE
        WHEN Name_1 = 'Sheet Name' THEN Strings
      END
    ) AS sheet_name,
    MAX(
      CASE
        WHEN Name_1 = 'Associated Level' THEN Strings
      END
    ) AS associated_level,
  FROM
    str_data
  GROUP BY
    LocalId,
    name;
`;
