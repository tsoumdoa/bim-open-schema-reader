import { sql } from "../utils/init-queries";

export const listWallBuildUps = sql`
	SELECT
		e1.index AS entity_index,
		FIRST (e1.name) AS family_name,
		ROUND(SUM(dp.v_value * 304.8), 1) AS total_thickness,
		LIST (e2.name) AS names,
		LIST (e3.name) AS materials,
		LIST (ROUND(dp.v_value * 304.8, 1)) AS thicknesses,
		LIST (e2.category) AS categories
	FROM
		denorm_entities e1
		LEFT JOIN relations r1 ON e1.index = r1.entityA
		LEFT JOIN denorm_entities e2 ON r1.entityB = e2.index
		LEFT JOIN denorm_single_params dp ON r1.entityB = dp.p_Entity
		AND dp.d_name = 'Width'
		LEFT JOIN relations r2 ON r1.entityB = r2.entityA
		LEFT JOIN denorm_entities e3 ON r2.entityB = e3.index
	WHERE
		e1.type = 'Walls'
		AND r1.relationType = 6
	GROUP BY
		e1.index
	ORDER BY
		e1.index;
`;

//TODO: it's not quite working.. probably need to use new instance vs type index
//distinction...
