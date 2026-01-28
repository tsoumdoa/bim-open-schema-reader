import { sql } from "../utils/queries";

// NOTE: Using CTE and PIVOT pattern exploration
export const wallDoubleAndPointParameters = sql`
	WITH
		pt_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Walls'
		),
		pt_data_pivot AS (
			PIVOT pt_data ON name_1 IN (
				'rvt:Element:Location.StartPoint',
				'rvt:Element:Location.EndPoint'
			) USING first (x) AS x,
			first (y) AS y,
			first (z) AS z,
			GROUP BY
				LocalId,
				name
		),
		double_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_single_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Walls'
		),
		converted AS (
			SELECT
				LocalId,
				name,
				name_1,
				CASE
					WHEN name_1 IN (
						'Base Extension Distance',
						'Base Offset',
						'Bottom Width',
						'Length',
						'Level Offset',
						'Top Extension Distance',
						'Top Offset',
						'Unconnected Height',
						'Width'
					) THEN VALUE * 304.8
					WHEN name_1 = 'Area' THEN VALUE * 0.092903
					WHEN name_1 = 'Volume' THEN VALUE * 0.0283168
					ELSE VALUE
				END AS value_converted
			FROM
				double_data
		),
		pivot_double_data AS (
			PIVOT converted /* or double_data */ ON name_1 IN (
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
			) USING IFNULL (FIRST (value_converted /* or value */), 0),
			GROUP BY
				LocalId,
				name
		),
		join_data AS (
			SELECT
				pt.LocalId,
				pt.name,
				pt.* EXCLUDE (LocalId, name),
				pd.* EXCLUDE (LocalId, name)
			FROM
				pt_data_pivot AS pt
				LEFT JOIN pivot_double_data AS pd ON pt.LocalId = pd.LocalId
		)
	SELECT
		*
	FROM
		join_data
	ORDER BY
		LocalId
`;
