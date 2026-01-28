import { sql } from "../utils/queries";

export const floorScheduleByType = sql`
	WITH
		pt_data AS (
			SELECT
				LocalId,
				e.Name,
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Floors'
		),
		double_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_single_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Floors'
		),
		pivot_double_data AS (
			PIVOT double_data ON name_1 IN ('Thickness', 'Area', 'Volume') USING first (VALUE),
			GROUP BY
				LocalId,
				name
		),
		joint_table AS (
			SELECT DISTINCT
				pt_data.*,
				pivot_double_data.* EXCLUDE (LocalId, name),
			FROM
				pivot_double_data
				JOIN pt_data ON pivot_double_data.LocalId = pt_data.LocalId
		)
	SELECT
		name,
		min(Thickness) * 304.8 AS thickness_mm,
		sum(Area) * 0.092903 AS area_m2,
		sum(Volume) * 0.0283168 AS volume_m3,
		count(*) AS element_count
	FROM
		joint_table
	GROUP BY
		Name
	ORDER BY
		Name;
`;
