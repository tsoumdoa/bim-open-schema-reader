import { sql } from "../utils/queries";

export const listLevels = sql`
  SELECT
    p.index,
    p.name,
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
    p.project_name,
    r0.value
  ORDER BY
    r0.value DESC;
`;

export const listGrids = sql`
  SELECT
    e.index,
    e.name,
    dp2.strings AS grid_type,
    CASE
      WHEN max(
        CASE
          WHEN dp1.name = 'rvt:Grid:StartPoint' THEN round(dp1.x * 304.8, 0)
        END
      ) = max(
        CASE
          WHEN dp1.name = 'rvt:Grid:EndPoint' THEN round(dp1.x * 304.8, 0)
        END
      ) THEN 'y'
      WHEN max(
        CASE
          WHEN dp1.name = 'rvt:Grid:StartPoint' THEN round(dp1.y * 304.8, 0)
        END
      ) = max(
        CASE
          WHEN dp1.name = 'rvt:Grid:EndPoint' THEN round(dp1.y * 304.8, 0)
        END
      ) THEN 'x'
      ELSE 'diagonal'
    END AS grid_dir,
    e.project_name,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:StartPoint' THEN round(dp1.x * 304.8, 0)
      END
    ) AS start_x,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:StartPoint' THEN round(dp1.y * 304.8, 0)
      END
    ) AS start_y,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:EndPoint' THEN round(dp1.x * 304.8, 0)
      END
    ) AS end_x,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:EndPoint' THEN round(dp1.y * 304.8, 0)
      END
    ) AS end_y,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN round(dp1.x * 304.8, 0)
      END
    ) AS center_x,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN round(dp1.y * 304.8, 0)
      END
    ) AS center_y,
    max(
      CASE
        WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN round(dp3.value * 304.8, 0)
      END
    ) AS arc_radius
  FROM
    denorm_entities AS e
    INNER JOIN denorm_points_params AS dp1 ON e.index = dp1.entity
    INNER JOIN denorm_string_params AS dp2 ON e.index = dp2.entity
    LEFT JOIN denorm_double_params AS dp3 ON e.index = dp3.entity
  WHERE
    e.category LIKE 'Grids'
    AND dp2.name LIKE 'rvt:Grid:Type'
  GROUP BY
    e.index,
    e.name,
    dp2.strings,
    e.project_name
  ORDER BY
    e.name;
`;
