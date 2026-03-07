import { sql } from "../utils/init-queries";

export const listLevels = sql`
	SELECT
		p.index,
		p.name,
		p.project_name,
		round(r0.value * 304.8, 0) AS elevation
	FROM
		denorm_entities AS p
		INNER JOIN denorm_string_params AS r2 ON p.index = r2.entity
		INNER JOIN denorm_single_params AS r0 ON p.index = r0.entity
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
	WITH
		grid_points AS (
			SELECT
				p_Entity,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:StartPoint' THEN ROUND(v_X * 304.8, 0)
					END
				) AS start_x,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:StartPoint' THEN ROUND(v_Y * 304.8, 0)
					END
				) AS start_y,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:EndPoint' THEN ROUND(v_X * 304.8, 0)
					END
				) AS end_x,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:EndPoint' THEN ROUND(v_Y * 304.8, 0)
					END
				) AS end_y,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:CenterPoint' THEN ROUND(v_X * 304.8, 0)
					END
				) AS center_x,
				MAX(
					CASE
						WHEN d_name = 'rvt:Grid:CenterPoint' THEN ROUND(v_Y * 304.8, 0)
					END
				) AS center_y
			FROM
				denorm_points_params
			WHERE
				d_name IN (
					'rvt:Grid:StartPoint',
					'rvt:Grid:EndPoint',
					'rvt:Grid:CenterPoint'
				)
			GROUP BY
				p_Entity
		),
		grid_radius AS (
			SELECT
				p_Entity,
				MAX(ROUND(v_value * 304.8, 0)) AS arc_radius
			FROM
				denorm_single_params
			WHERE
				d_name = 'rvt:Grid:ArcRadius'
			GROUP BY
				p_Entity
		),
		grid_type AS (
			SELECT
				p_Entity,
				v_Strings AS grid_type
			FROM
				denorm_string_params
			WHERE
				d_name = 'rvt:Grid:Type'
		)
	SELECT
		e.index,
		e.name,
		e.title,
		gt.grid_type,
		CASE
			WHEN gp.start_x = gp.end_x THEN 'y'
			WHEN gp.start_y = gp.end_y THEN 'x'
			ELSE 'diagonal'
		END AS grid_dir,
		gp.start_x,
		gp.start_y,
		gp.end_x,
		gp.end_y,
		gp.center_x,
		gp.center_y,
		gr.arc_radius
	FROM
		denorm_entities e
		JOIN grid_points gp ON e.index = gp.p_Entity
		JOIN grid_type gt ON e.index = gt.p_Entity
		LEFT JOIN grid_radius gr ON e.index = gr.p_Entity
	WHERE
		e.type = 'Grids'
	ORDER BY
		e.name;
`;
