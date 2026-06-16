import { sql } from "../utils/init-queries";

export const listLevelWithCoredStatus = sql`
	WITH
		level_data AS (
			SELECT
				p.name,
				p.title,
				ROUND(r0.v_value * 304.8, 0) AS elevation
			FROM
				denorm_entities p
				JOIN denorm_number_params r0 ON p.index = r0.p_Entity
			WHERE
				p.type = 'Levels'
				AND r0.d_name = 'Elevation'
		),
		level_ref AS (
			SELECT
				name,
				title,
				elevation,
				FIRST_VALUE(elevation) OVER (
					PARTITION BY
						name
				) AS ref_elevation
			FROM
				level_data
		)
	SELECT
		name,
		ref_elevation,
		CASE
			WHEN BOOL_AND(elevation = ref_elevation) THEN 'OK'
			ELSE 'Uncoordinated level'
		END AS cord_status,
		LIST (DISTINCT title) AS models,
		LIST (
			DISTINCT CASE
				WHEN elevation <> ref_elevation THEN title
			END
		) AS wrong_models,
		CASE
			WHEN NOT BOOL_AND(elevation = ref_elevation) THEN LIST (DISTINCT elevation)
		END AS mismatched_elevations
	FROM
		level_ref
	GROUP BY
		name,
		ref_elevation
	ORDER BY
		ref_elevation DESC;
`;

export const listGridWithCoredStatus = sql`
	WITH
		grid_per_model AS (
			SELECT
				e.index,
				e.name,
				e.title,
				dp2.v_Strings AS grid_type,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:StartPoint' THEN dp1.v_X
					END
				) AS start_x,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:StartPoint' THEN dp1.v_Y
					END
				) AS start_y,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:EndPoint' THEN dp1.v_X
					END
				) AS end_x,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:EndPoint' THEN dp1.v_Y
					END
				) AS end_y,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:CenterPoint' THEN dp1.v_X
					END
				) AS center_x,
				MAX(
					CASE
						WHEN dp1.d_name = 'rvt:Grid:CenterPoint' THEN dp1.v_Y
					END
				) AS center_y,
				MAX(
					CASE
						WHEN dp3.d_name = 'rvt:Grid:ArcRadius' THEN dp3.v_value
					END
				) AS arc_radius
			FROM
				denorm_entities e
				JOIN denorm_points_params dp1 ON e.index = dp1.p_Entity
				JOIN denorm_string_params dp2 ON e.index = dp2.p_Entity
				LEFT JOIN denorm_number_params dp3 ON e.index = dp3.p_Entity
			WHERE
				e.type = 'Grids'
				AND dp2.d_name = 'rvt:Grid:Type'
			GROUP BY
				e.index,
				e.name,
				e.title,
				dp2.v_Strings
		),
		grid_vectors AS (
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
		grid_compare AS (
			SELECT
				*,
				FIRST_VALUE(dir_x) OVER (
					PARTITION BY
						name,
						grid_type
				) AS ref_dir_x,
				FIRST_VALUE(dir_y) OVER (
					PARTITION BY
						name,
						grid_type
				) AS ref_dir_y,
				FIRST_VALUE(center_x) OVER (
					PARTITION BY
						name,
						grid_type
				) AS ref_center_x,
				FIRST_VALUE(center_y) OVER (
					PARTITION BY
						name,
						grid_type
				) AS ref_center_y,
				FIRST_VALUE(arc_radius) OVER (
					PARTITION BY
						name,
						grid_type
				) AS ref_arc_radius
			FROM
				grid_vectors
		),
		grid_flags AS (
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
				grid_compare
		)
	SELECT
		name,
		CASE
			WHEN BOOL_AND(model_status = 'OK') THEN 'OK'
			ELSE 'Uncoordinated'
		END AS cord_status,
		LIST (DISTINCT title) AS models,
		LIST (
			DISTINCT CASE
				WHEN model_status = 'Wrong' THEN title
			END
		) AS wrong_models
	FROM
		grid_flags
	GROUP BY
		name
	ORDER BY
		name;
`;
