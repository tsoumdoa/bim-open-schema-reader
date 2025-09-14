import { sql } from "../utils/queries";

export const wallDoubleParams = sql`
  WITH
    double_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_double_params AS p ON e.index = p.entity
      WHERE
        e.category = 'Walls'
    )
  SELECT
    *
  FROM
    double_data
  ORDER BY
    index
`;
