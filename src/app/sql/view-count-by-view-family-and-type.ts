import { sql } from "../utils/init-queries";

export const countViewByFamilyAndType = sql`
	WITH
		ranked AS (
			SELECT
				e.LocalId,
				p.v_Strings AS string_val,
				p.d_name,
				ROW_NUMBER() OVER (
					PARTITION BY
						e.LocalId
					ORDER BY
						CASE
							WHEN p.d_name = 'Family and Type' THEN 1
							ELSE 2
						END,
						p.p_index DESC
				) AS rn
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Views'
		)
	SELECT
		CASE
			WHEN r.d_name = 'Family and Type'
			AND (
				r.string_val IS NULL
				OR r.string_val = ''
			) THEN NULL
			WHEN r.string_val IS NULL
			OR r.string_val = '' THEN '_uncategorized'
			ELSE r.string_val
		END AS view_type,
		COUNT(DISTINCT r.LocalId) AS distinct_view_count
	FROM
		ranked r
	WHERE
		r.rn = 1
		AND NOT (
			r.d_name = 'Family and Type'
			AND (
				r.string_val IS NULL
				OR r.string_val = ''
			)
		)
	GROUP BY
		CASE
			WHEN r.d_name = 'Family and Type'
			AND (
				r.string_val IS NULL
				OR r.string_val = ''
			) THEN NULL
			WHEN r.string_val IS NULL
			OR r.string_val = '' THEN '_uncategorized'
			ELSE r.string_val
		END
	ORDER BY
		view_type;
`;
