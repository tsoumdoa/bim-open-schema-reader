import { sql } from "../utils/queries";

export const viewCountUnplacedViews = sql`
  WITH
    str_data AS (
      SELECT
        e.LocalId,
        p.Strings
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
      WHERE
        e.category = 'Views'
        AND p.Name = 'Sheet Name'
    )
  SELECT
    status,
    COUNT(DISTINCT LocalId) AS view_count
  FROM
    (
      SELECT
        LocalId,
        CASE
          WHEN Strings = '---' THEN 'Unplaced'
          WHEN Strings <> '---' THEN 'Placed'
          ELSE 'Unknown'
        END AS status
      FROM
        str_data
    ) t
  GROUP BY
    status
  UNION ALL
  SELECT
    'Total' AS status,
    COUNT(DISTINCT LocalId)
  FROM
    str_data;
`;
