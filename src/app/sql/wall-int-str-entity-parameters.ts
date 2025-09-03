import { sql } from "../utils/queries";

export const wallIntStrEntityParameters = sql`
  WITH
    int_data AS (
      SELECT
        e.index,
        e.name,
        p1.group,
        p1.name,
        p1.value
      FROM
        denorm_entities AS e
        INNER JOIN denorm_integer_params AS p1 ON e.index = p1.entity
      WHERE
        e.category LIKE 'Walls'
    )
  SELECT
    *
  FROM
    int_data;

  WITH
    str_data AS (
      SELECT
        e.index,
        p1.group,
        p1.name,
        p1.strings
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p1 ON e.index = p1.entity
      WHERE
        e.category LIKE 'Walls'
    )
  SELECT
    *
  FROM
    str_data;

  WITH
    entity_data AS (
      SELECT
        e.index,
        e.name,
        p1.name AS des_name,
        p1.group AS des_group,
        p1.type AS des_type,
        p1.name_1 AS entity_name,
        p1.category AS entity_category,
        p1.index_1 AS entity_index
      FROM
        denorm_entities AS e
        INNER JOIN denorm_entity_params AS p1 ON e.index = p1.entity
      WHERE
        e.category = 'Walls'
    )
  SELECT
    *
  FROM
    entity_data
  ORDER BY
    index
`;
