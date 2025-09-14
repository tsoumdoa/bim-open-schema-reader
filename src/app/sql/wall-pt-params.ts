import { sql } from "../utils/queries";

export const wallPtParams = sql`
  WITH
    pt_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_points_params AS p ON e.index = p.entity
      WHERE
        e.category = 'Walls'
    )
  SELECT
    *
  FROM
    pt_data
  ORDER BY
    index
`;
