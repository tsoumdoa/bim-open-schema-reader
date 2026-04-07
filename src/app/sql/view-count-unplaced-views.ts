import { sql } from "../utils/init-queries";

export const countUnplacedViews = sql`
	WITH
		str_data AS (
			SELECT
				e.LocalId,
				name AS sheet_name
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Views'
				AND p.d_name = 'Sheet Name'
		)
	SELECT
		status,
		COUNT(DISTINCT LocalId) AS view_count
	FROM
		(
			SELECT
				LocalId,
				CASE
					WHEN sheet_name = '---' THEN 'Unplaced'
					WHEN sheet_name <> '---' THEN 'Placed'
					ELSE 'Unknown'
				END AS status
			FROM
				str_data
		) t
	GROUP BY
		status
	UNION ALL
	SELECT
		'Total' AS status,
		COUNT(DISTINCT LocalId)
	FROM
		str_data;
`;
