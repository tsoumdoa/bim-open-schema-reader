import { sql } from "../utils/init-queries";

// NOTE: Using CTE and PIVOT pattern exploration
export const wallDoubleAndPointParameters = sql`
	WITH
		pt_data AS (
			SELECT
				e.index,
				e.LocalId,
				e.name,
				p.d_name,
				p.v_X,
				p.v_Y,
				p.v_Z
			FROM
				denorm_entities e
				JOIN denorm_points_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Walls'
		),
		pt_data_pivot AS (
			PIVOT pt_data ON d_name IN (
				'Rvt:Element:Location.StartPoint',
				'Rvt:Element:Location.EndPoint'
			) USING FIRST (v_X) AS x,
			FIRST (v_Y) AS y,
			FIRST (v_Z) AS z
			GROUP BY
				index,
				LocalId,
				name
		),
		single_data AS (
			SELECT
				e.index,
				e.LocalId,
				e.name,
				p.d_name,
				p.v_value
			FROM
				denorm_entities e
				JOIN denorm_single_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Walls'
		),
		converted AS (
			SELECT
				index,
				LocalId,
				name,
				d_name,
				CASE
					WHEN d_name IN (
						'Base Extension Distance',
						'Base Offset',
						'Bottom Width',
						'Length',
						'Level Offset',
						'Top Extension Distance',
						'Top Offset',
						'Unconnected Height',
						'Width'
					) THEN v_value * 304.8
					WHEN d_name = 'Area' THEN v_value * 0.092903
					WHEN d_name = 'Volume' THEN v_value * 0.0283168
					ELSE v_value
				END AS value_converted
			FROM
				single_data
		),
		pivot_single_data AS (
			PIVOT converted ON d_name IN (
				'Area',
				'Base Extension Distance',
				'Base Offset',
				'Bottom Width',
				'Length',
				'Level Offset',
				'Top Extension Distance',
				'Top Offset',
				'Unconnected Height',
				'Volume',
				'Width'
			) USING IFNULL (FIRST (value_converted), 0)
			GROUP BY
				index,
				LocalId,
				name
		)
	SELECT
		pt.index,
		pt.LocalId,
		pt.name,
		pt.* EXCLUDE (index, LocalId, name),
		ps.* EXCLUDE (index, LocalId, name)
	FROM
		pt_data_pivot pt
		LEFT JOIN pivot_single_data ps ON pt.index = ps.index
	ORDER BY
		pt.LocalId;
`;
