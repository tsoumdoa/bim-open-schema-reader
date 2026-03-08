import { sql } from "../utils/init-queries";

export const roomScheduleByLevel = sql`
	WITH
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
				e.type = 'Rooms'
		),
		pivot_single_data AS (
			PIVOT single_data ON d_name IN ('Volume', 'Area', 'Unbounded Height', 'Perimeter') USING FIRST (v_value)
			GROUP BY
				LocalId,
				name
		),
		str_data AS (
			SELECT
				e.LocalId,
				e.name,
				p.d_name,
				p.v_Strings
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Rooms'
		),
		pivot_str_data AS (
			PIVOT str_data ON d_name IN (
				'Level',
				'Floor Finish',
				'Wall Finish',
				'Base Finish',
				'Ceiling Finish',
				'Comments',
				'Department'
			) USING FIRST (v_Strings)
			GROUP BY
				LocalId,
				name
		),
		joint AS (
			SELECT
				psd.*,
				(pdd.Area * 0.092903) AS area_m2,
				(pdd.Perimeter * 304.8) AS perimeter_mm,
				(pdd."Unbounded Height" * 304.8) AS height_mm,
				(pdd.Volume * 0.0283168) AS volume_m3
			FROM
				pivot_str_data psd
				LEFT JOIN pivot_single_data pdd ON psd.LocalId = pdd.LocalId
		)
	SELECT
		COALESCE(Level, 'Unplaced') AS Level,
		COUNT(*) AS room_count,
		SUM(area_m2) AS total_area_m2,
		SUM(perimeter_mm) AS total_perimeter_mm,
		MIN(height_mm) AS min_height_mm,
		MAX(height_mm) AS max_height_mm,
		SUM(volume_m3) AS total_volume_m3
	FROM
		joint
	GROUP BY
		Level
	ORDER BY
		Level;
`;
