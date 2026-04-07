import { sql } from "../utils/init-queries";

export const denormNumberParams = (categoryName: string) => sql`
	WITH
		single_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_number_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		)
	SELECT
		* EXCLUDE (path, title, p_Entity)
	FROM
		single_data
	ORDER BY
		localid;
`;

export const denormNumberParamsPivot = (categoryName: string) => sql`
	WITH
		single_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_number_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		pivot_single_data AS (
			PIVOT single_data ON d_name USING first (v_value) AS param_value,
			first (d_units) AS param_units
			GROUP BY
				LocalId,
				index,
				instance_entity_index,
				name
		)
	SELECT
		*
		--<param_name_in_returned_column>
	FROM
		pivot_single_data AS pdd
		--where <param_name_in_returned_column> is not null and <param_name_in_returned_column> != ''
	ORDER BY
		LocalId
`;

export const denormNumberParamsStats = (categoryName: string) => sql`
  WITH
    single_data AS (
      SELECT
        e.LocalId,
        p.d_name AS param_name,
        p.v_value AS raw_value,
      FROM
        denorm_entities AS e
        INNER JOIN denorm_number_params AS p ON e.index = p.p_Entity
      WHERE e.type = '${categoryName}'
    ),
    norm AS (
      SELECT
        LocalId,
        param_name,
        CASE
          WHEN raw_value::text IS NULL THEN NULL
          WHEN trim(raw_value::text) = '' THEN NULL
          WHEN (raw_value)::float8 = 0 THEN NULL
          ELSE raw_value
        END AS norm_value
      FROM
        single_data
    )
  SELECT
    param_name,
    COUNT(DISTINCT LocalId) AS total_rows_per_param,
    COUNT(DISTINCT LocalId) FILTER (
      WHERE
        norm_value IS NOT NULL
    ) AS rows_with_value_defined,
    COUNT(DISTINCT LocalId) - COUNT(DISTINCT LocalId) FILTER (
      WHERE
        norm_value IS NOT NULL
    ) AS rows_with_value_undefined,
    COUNT(DISTINCT norm_value) AS distinct_values
  FROM
    norm
  GROUP BY
    param_name
  ORDER BY
    param_name;
`;

export const denormEntityParams = (categoryName: string) => sql`
	WITH
		entity_data AS (
			SELECT
				*
			FROM
				denorm_entities e
				INNER JOIN denorm_entity_params p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		)
	SELECT
		*
	FROM
		entity_data
	ORDER BY
		localid;
`;

export const denormEntityParamsPivot = (categoryName: string) => sql`
	WITH
		entity_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_entity_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		pivot_entity_data AS (
			PIVOT entity_data ON d_name USING first (d_name) AS param_value,
			first (Category) AS param_category
			GROUP BY
				LocalId,
				index,
				instance_entity_index,
				name
		)
	SELECT
		*
		--<param_name_in_returned_column>
	FROM
		pivot_entity_data AS ped
		--where <param_name_in_returned_column> is not null and <param_name_in_returned_column> != ''
	ORDER BY
		LocalId;
`;

export const denormEntityParamsStats = (categoryName: string) => sql`
	WITH
		entity_data AS (
			SELECT
				e.LocalId,
				e.Name AS param_value,
				p.d_name AS param_name,
				e.category AS param_category
			FROM
				denorm_entities AS e
				INNER JOIN denorm_entity_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		norm AS (
			SELECT
				LocalId,
				param_name,
				NULLIF(TRIM(param_value), '') AS norm_value,
				param_category
			FROM
				entity_data
		)
	SELECT
		param_name,
		COUNT(DISTINCT LocalId) AS total_rows_per_param,
		COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_defined,
		COUNT(DISTINCT LocalId) - COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_undefined,
		COUNT(DISTINCT norm_value) AS distinct_values
	FROM
		norm
	GROUP BY
		param_name
	ORDER BY
		param_name;
`;

export const denormIntegerParams = (categoryName: string) => sql`
	WITH
		int_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_integer_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		)
	SELECT
		* EXCLUDE (path, title, p_Entity)
	FROM
		int_data
	ORDER BY
		localid;
`;

export const denormIntegerParamsPivot = (categoryName: string) => sql`
	WITH
		int_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_integer_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		pivot_int_data AS (
			PIVOT int_data ON d_name USING first (p_Value)
			GROUP BY
				LocalId,
				index,
				instance_entity_index,
				name
		)
	SELECT
		*
		--<param_name_in_returned_column>
	FROM
		pivot_int_data AS pid
		--where <param_name_in_returned_column> is not null and <param_name_in_returned_column> != ''
	ORDER BY
		localid;
`;

export const denormIntegerParamsStats = (categoryName: string) => sql`
	WITH
		int_data AS (
			SELECT
				e.LocalId,
				p.d_name AS param_name,
				p.p_Value AS raw_value
			FROM
				denorm_entities AS e
				INNER JOIN denorm_integer_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		norm AS (
			SELECT
				LocalId,
				param_name,
				CASE
					WHEN raw_value IS NULL THEN NULL
					ELSE raw_value
				END AS norm_value
			FROM
				int_data
		)
	SELECT
		param_name,
		COUNT(DISTINCT LocalId) AS total_rows_per_param,
		COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_defined,
		COUNT(DISTINCT LocalId) - COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_undefined,
		COUNT(DISTINCT norm_value) AS distinct_values
	FROM
		norm
	GROUP BY
		param_name
	ORDER BY
		param_name;
`;

export const denormPointsParams = (categoryName: string) => sql`
	WITH
		pt_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		)
	SELECT
		* EXCLUDE (path, title, p_Entity)
	FROM
		pt_data
	ORDER BY
		localid;
`;

export const denormPointsParamsPivot = (categoryName: string) => sql`
	WITH
		pt_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		pt_data_pivot AS (
			PIVOT pt_data ON d_name,
			USING first (v_X) AS x,
			first (v_y) AS y,
			first (v_z) AS z,
			GROUP BY
				LocalId,
				index,
				instance_entity_index,
				name
		)
	SELECT
		*
	FROM
		pt_data_pivot
	ORDER BY
		LocalId
`;

export const denormPointsParamsStats = (categoryName: string) => sql`
	WITH
		pt_data AS (
			SELECT
				e.LocalId,
				p.d_name AS param_name,
				p.v_X AS raw_x,
				p.v_Y AS raw_y,
				p.v_Z AS raw_z
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		norm AS (
			SELECT
				LocalId,
				param_name,
				CASE
					WHEN raw_x IS NULL
					OR raw_x = 0 THEN NULL
					ELSE raw_x
				END AS X,
				CASE
					WHEN raw_y IS NULL
					OR raw_y = 0 THEN NULL
					ELSE raw_y
				END AS Y,
				CASE
					WHEN raw_z IS NULL
					OR raw_z = 0 THEN NULL
					ELSE raw_z
				END AS Z
			FROM
				pt_data
		)
	SELECT
		param_name,
		COUNT(DISTINCT LocalId) AS total_rows_per_param,
		COUNT(DISTINCT LocalId) FILTER (
			WHERE
				X IS NOT NULL
				OR Y IS NOT NULL
				OR Z IS NOT NULL
		) AS rows_with_value_defined,
		COUNT(DISTINCT LocalId) - COUNT(DISTINCT LocalId) FILTER (
			WHERE
				X IS NOT NULL
				OR Y IS NOT NULL
				OR Z IS NOT NULL
		) AS rows_with_value_undefined,
		COUNT(DISTINCT (X, Y, Z)) AS distinct_values
	FROM
		norm
	GROUP BY
		param_name
	ORDER BY
		param_name;
`;

export const denormStringParams = (categoryName: string) => sql`
	WITH
		str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		)
	SELECT
		* EXCLUDE (path, title, p_Entity)
	FROM
		str_data
	ORDER BY
		localid;
`;

export const denormStringParamsPivot = (categoryName: string) => sql`
	WITH
		str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		pivot_str_data AS (
			PIVOT str_data ON d_name USING first (v_Strings)
			GROUP BY
				LocalId,
				index,
				instance_entity_index,
				name
		)
	SELECT
		*
		--<param_name_in_returned_column>
	FROM
		pivot_str_data AS psd
		--where <param_name_in_returned_column> is not null and <param_name_in_returned_column> != ''
	ORDER BY
		localid;
`;

export const denormStringParamsStats = (categoryName: string) => sql`
	WITH
		str_data AS (
			SELECT
				e.LocalId,
				p.d_name AS param_name,
				p.v_Strings AS param_value,
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.p_Entity
			WHERE
				e.type = '${categoryName}'
		),
		norm AS (
			SELECT
				LocalId,
				param_name,
				NULLIF(TRIM(param_value), '') AS norm_value,
			FROM
				str_data
		)
	SELECT
		param_name,
		COUNT(DISTINCT LocalId) AS total_rows_per_param,
		COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_defined,
		COUNT(DISTINCT LocalId) - COUNT(DISTINCT LocalId) FILTER (
			WHERE
				norm_value IS NOT NULL
		) AS rows_with_value_undefined,
		COUNT(DISTINCT norm_value) AS distinct_values
	FROM
		norm
	GROUP BY
		param_name
	ORDER BY
		param_name;
`;
