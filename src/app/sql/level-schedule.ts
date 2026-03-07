import { sql } from "../utils/init-queries";

export const levelSchedule = sql`
	WITH
		level_data AS (
			SELECT
				p.index,
				p.name,
				p.LocalId,
				p.title,
				ROUND(r0.v_value * 304.8, 0) AS elevation
			FROM
				denorm_entities p
				JOIN denorm_single_params r0 ON p.index = r0.p_Entity
			WHERE
				p.type = 'Levels'
				AND r0.d_name = 'Elevation'
		),
		level_flags AS (
			SELECT
				e.LocalId,
				MAX(
					CASE
						WHEN p.d_name = 'Building Story'
						AND p.p_Value = 1 THEN 'True'
						ELSE 'False'
					END
				) AS building_story,
				MAX(
					CASE
						WHEN p.d_name = 'Structural'
						AND p.p_Value = 1 THEN 'True'
						ELSE 'False'
					END
				) AS structural
			FROM
				denorm_entities e
				JOIN denorm_integer_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Levels'
				AND p.d_name IN ('Building Story', 'Structural')
			GROUP BY
				e.LocalId
		)
	SELECT
		l.title,
		l.name,
		l.elevation,
		f.building_story,
		f.structural
	FROM
		level_data l
		LEFT JOIN level_flags f ON l.LocalId = f.LocalId
	ORDER BY
		l.elevation DESC,
		l.title;
`;
