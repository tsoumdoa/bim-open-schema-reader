import { sql } from "../utils/queries";

export const listLevelWithCoredStatus = sql`
  WITH
    level_per_model AS (
      SELECT
        p.name,
        p.project_name, -- convert to mm and round
        ROUND(r0.value * 304.8, 0) AS elevation
      FROM
        denorm_entities AS p
        INNER JOIN denorm_string_params AS r2 ON p.index = r2.entity
        INNER JOIN denorm_single_params AS r0 ON p.index = r0.entity
      WHERE
        p.category LIKE 'Levels'
        AND r0.name LIKE 'Elevation'
      GROUP BY
        p.name,
        p.project_name,
        r0.value
    ),
    -- Add reference elevation for each level (first model in group)
    level_with_reference AS (
      SELECT
        *,
        FIRST (elevation) OVER (
          PARTITION BY
            name
        ) AS ref_elevation
      FROM
        level_per_model
    ),
    -- Mark each model as OK or Wrong
    level_with_flags AS (
      SELECT
        *,
        CASE
          WHEN elevation = ref_elevation THEN 'OK'
          ELSE 'Wrong'
        END AS model_status
      FROM
        level_with_reference
    ),
    -- Aggregate to get one row per level name
    level_across_models AS (
      SELECT
        name,
        ref_elevation,
        CASE
          WHEN BOOL_AND (model_status = 'OK') THEN 'OK'
          ELSE 'Uncoordinated level'
        END AS cord_status,
        LIST (DISTINCT project_name) AS models,
        LIST (
          DISTINCT CASE
            WHEN model_status = 'Wrong' THEN project_name
          END
        ) AS wrong_models,
        LIST (DISTINCT elevation) AS elevations
      FROM
        level_with_flags
      GROUP BY
        name,
        ref_elevation
    )
  SELECT
    name,
    cord_status,
    ref_elevation,
    wrong_models,
    CASE
      WHEN cord_status = 'Uncoordinated level' THEN elevations
    END AS mismatched_elevations,
    models
  FROM
    level_across_models
  ORDER BY
    ref_elevation DESC;
`;

export const listGridWithCoredStatus = sql`
  WITH
    grid_per_model AS (
      SELECT
        e.index,
        e.name,
        dp2.strings AS grid_type,
        e.project_name,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:StartPoint' THEN dp1.x
          END
        ) AS start_x,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:StartPoint' THEN dp1.y
          END
        ) AS start_y,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:EndPoint' THEN dp1.x
          END
        ) AS end_x,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:EndPoint' THEN dp1.y
          END
        ) AS end_y,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN dp1.x
          END
        ) AS center_x,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN dp1.y
          END
        ) AS center_y,
        MAX(
          CASE
            WHEN dp1.name = 'rvt:Grid:CenterPoint' THEN dp3.value
          END
        ) AS arc_radius
      FROM
        denorm_entities AS e
        INNER JOIN denorm_points_params AS dp1 ON e.index = dp1.entity
        INNER JOIN denorm_string_params AS dp2 ON e.index = dp2.entity
        LEFT JOIN denorm_single_params AS dp3 ON e.index = dp3.entity
      WHERE
        e.category LIKE 'Grids'
        AND dp2.name LIKE 'rvt:Grid:Type'
      GROUP BY
        e.index,
        e.name,
        dp2.strings,
        e.project_name
    ),
    -- Compute normalized direction vectors for Linear grids
    grid_with_vectors AS (
      SELECT
        *,
        CASE
          WHEN grid_type = 'Linear' THEN (end_x - start_x) / SQRT(
            POWER(end_x - start_x, 2) + POWER(end_y - start_y, 2)
          )
        END AS dir_x,
        CASE
          WHEN grid_type = 'Linear' THEN (end_y - start_y) / SQRT(
            POWER(end_x - start_x, 2) + POWER(end_y - start_y, 2)
          )
        END AS dir_y
      FROM
        grid_per_model
    ),
    -- Compare each model to the reference model
    grid_with_comparison AS (
      SELECT
        *,
        FIRST (dir_x) OVER (
          PARTITION BY
            name,
            grid_type
        ) AS ref_dir_x,
        FIRST (dir_y) OVER (
          PARTITION BY
            name,
            grid_type
        ) AS ref_dir_y,
        FIRST (center_x) OVER (
          PARTITION BY
            name,
            grid_type
        ) AS ref_center_x,
        FIRST (center_y) OVER (
          PARTITION BY
            name,
            grid_type
        ) AS ref_center_y,
        FIRST (arc_radius) OVER (
          PARTITION BY
            name,
            grid_type
        ) AS ref_arc_radius
      FROM
        grid_with_vectors
    ),
    grid_with_flags AS (
      SELECT
        *,
        CASE
          WHEN grid_type = 'Linear' THEN CASE
            WHEN ABS(dir_x * ref_dir_x + dir_y * ref_dir_y) >= 0.999999 THEN 'OK'
            ELSE 'Wrong'
          END
          WHEN grid_type = 'Arc' THEN CASE
            WHEN center_x = ref_center_x
            AND center_y = ref_center_y
            AND arc_radius = ref_arc_radius THEN 'OK'
            ELSE 'Wrong'
          END
        END AS model_status
      FROM
        grid_with_comparison
    ),
    -- Aggregate to get overall status and wrong models
    grid_across_models AS (
      SELECT
        name,
        CASE
          WHEN (model_status = 'OK') THEN 'OK'
          ELSE 'Uncoordinated'
        END AS cord_status,
        LIST (
          DISTINCT CASE
            WHEN model_status = 'Wrong' THEN project_name
          END
        ) AS wrong_models,
        LIST (DISTINCT project_name) AS models
      FROM
        grid_with_flags
      GROUP BY
        name,
        model_status
    )
  SELECT
    *
  FROM
    grid_across_models
  ORDER BY
    name;
`;
