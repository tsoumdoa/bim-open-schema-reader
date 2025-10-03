import { findCategoryGroup } from "./categorize-categories";

export function cleanCategoryCount(rows: (string | number)[][]) {
	const categoryGorupMap = new Map<string, [string, number][]>();
	for (const row of rows) {
		const categoryName = findCategoryGroup(row[0] as string);
		if (!categoryGorupMap.has(categoryName)) {
			categoryGorupMap.set(categoryName, []);
		}
		categoryGorupMap
			.get(categoryName)
			?.push([row[0] as string, row[1] as number]);
	}
	return categoryGorupMap;
}
