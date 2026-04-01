## Issues

- list type is not parased correctly...

## Query

to get number of times each instance type appears (as instances) in the dataset, use this query:

this query lists index of type and list_index lists out relevant geometrical
data

```sql
SELECT
	instance_entity_index,
	count(*) AS appear_count,
	list (index) AS list_index
FROM
	denorm_entities
WHERE
	instance_entity_index != -1
GROUP BY
	instance_entity_index
ORDER BY
	instance_entity_index;
```

wheere instan_entity_index != -1 means that the entity is an instance of the
type. and instance_entity_index points to the type of the instance queried above

```
WITH
  str_data AS (
    SELECT
      *
    FROM
      denorm_entities AS e
      INNER JOIN denorm_string_params AS p ON e.index = p.p_Entity
  )
SELECT
  * EXCLUDE (path, title, p_Entity)
FROM
  str_data
ORDER BY
  localid;
```
