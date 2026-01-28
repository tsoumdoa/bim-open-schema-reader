import { sql } from "../utils/queries";

export const countByViewFamily = sql`
	WITH
		ranked AS (
			SELECT
				e.LocalId,
				p.Strings,
				p.Name,
				ROW_NUMBER() OVER (
					PARTITION BY
						e.LocalId
					ORDER BY
						CASE
							WHEN p.Name = 'Family' THEN 1
							ELSE 2
						END,
						p.index DESC
				) AS rn
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
			WHERE
				e.category = 'Views'
		)
	SELECT
		CASE
			WHEN r.Name = 'Family'
			AND (
				r.Strings IS NULL
				OR r.Strings = ''
			) THEN NULL
			WHEN r.Strings IS NULL
			OR r.Strings = '' THEN '_uncategorized'
			ELSE r.Strings
		END AS view_type,
		COUNT(DISTINCT r.LocalId) AS distinct_view_count
	FROM
		ranked r
	WHERE
		r.rn = 1
		-- exclude the "Family" rows that have no Strings
		AND NOT (
			r.Name = 'Family'
			AND (
				r.Strings IS NULL
				OR r.Strings = ''
			)
		)
	GROUP BY
		CASE
			WHEN r.Name = 'Family'
			AND (
				r.Strings IS NULL
				OR r.Strings = ''
			) THEN NULL
			WHEN r.Strings IS NULL
			OR r.Strings = '' THEN '_uncategorized'
			ELSE r.Strings
		END
	ORDER BY
		view_type;
`;
