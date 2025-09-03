import { sql } from "../utils/queries";

export const listWallBuildUps = sql`
  SELECT
    e1.index AS entity_index,
    FIRST (e1.name) AS family_name,
    LIST (e2.name) AS names,
    LIST (e3.name) AS materials,
    LIST (ROUND(dp.value * 304.8, 1)) AS thicknesses,
    LIST (e2.category) AS categories,
    ROUND(SUM(dp.value * 304.8), 1) AS total_thickness
  FROM
    denorm_entities AS e1
    LEFT JOIN relations AS rls1 ON e1.index = rls1.entitya
    LEFT JOIN denorm_entities AS e2 ON rls1.entityb = e2.index
    LEFT JOIN doubleparameters AS dp ON rls1.entityb = dp.entity
    LEFT JOIN descriptors AS dsp ON dp.descriptor = dsp.index
    LEFT JOIN strings AS str1 ON dsp.name = str1.index
    LEFT JOIN relations AS rls2 ON rls1.entityb = rls2.entitya
    LEFT JOIN denorm_entities AS e3 ON rls2.entityb = e3.index
  WHERE
    e1.category LIKE 'Walls'
    AND rls1.relationtype = 6
  GROUP BY
    e1.index
  ORDER BY
    e1.index;
`;
