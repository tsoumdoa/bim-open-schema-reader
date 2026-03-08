import { sql } from "../utils/init-queries";

export const floorSchedule = sql`
	WITH
		pt_data AS (
			SELECT
				e.LocalId,
				e.name,
				e.index
			FROM
				denorm_entities e
				JOIN denorm_points_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Floors'
		),
		single_data AS (
			SELECT
				e.LocalId,
				e.name,
				p.d_name,
				p.v_value
			FROM
				denorm_entities e
				JOIN denorm_single_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Floors'
		),
		pivot_single_data AS (
			PIVOT single_data ON d_name IN ('Thickness', 'Area', 'Volume') USING FIRST (v_value)
			GROUP BY
				LocalId,
				name
		),
		joint_table AS (
			SELECT DISTINCT
				pt_data.*,
				pivot_single_data.* EXCLUDE (LocalId, name)
			FROM
				pivot_single_data
				JOIN pt_data ON pivot_single_data.LocalId = pt_data.LocalId
		)
	SELECT
		LocalId,
		name,
		index,
		Thickness * 304.8 AS thickness_mm,
		Area * 0.092903 AS area_m2,
		Volume * 0.0283168 AS volume_m3
	FROM
		joint_table
	ORDER BY
		LocalId;
`;
