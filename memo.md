## Issues

- list type is not parased correctly...

## Query

to get number of times each instance type appears (as instances) in the dataset, use this query:

```sql
SELECT
	instance_entity_index,
	count(*) AS appear_count,
	list (index)
FROM
	denorm_entities
WHERE
	instance_entity_index != -1
GROUP BY
	instance_entity_index
ORDER BY
	instance_entity_index;
```
