## Issues

- list type is not parased correctly...

## Query

To get number of times each instance type appears (as instances) in the dataset:

```sql
SELECT
	instance_entity_index,
	count(*) AS appear_count,
	list (index) AS instance_indexes
FROM
	denorm_entities
WHERE
	instance_entity_index != -1
GROUP BY
	instance_entity_index
ORDER BY
	instance_entity_index;
```

- `instance_entity_index != -1` filters to entities that ARE instances (have a type reference)
- `instance_entity_index` = the TYPE's index (what type the instances are)
- `count(*)` = how many instances have that type
- `list(index)` = entity indexes of THE INSTANCES themselves (not geometry)

```
SELECT
  *
FROM
  denorm_entities AS e
ORDER BY
  localid;
```

## NOTE

the schema is fully denormalized - each instance stores its own complete geometry independently. The type/instance_entity_index relationship is purely metadata/categorization, not a geometry template pattern.
This is a different design philosophy than traditional IFC/BIM where:
Type = shared geometry definition (one mesh in buffer)
Instance = reference to type + transform
In this schema:
Type = just a category tag
Instance = full standalone geometry (own vertex_offset, index_offset)
This makes sense for file formats that also denormalize geometry for performance (like DWG, Revit files), trading storage space for faster loading since each element is self-contained.
