import { findCategoryGroup } from "./categorize-categories";
import { GeneralCategoryObj } from "./types";

export function cleanCategoryCount(rows: (string | number)[][]) {
	const categoryGroupMap = new Map<string, [GeneralCategoryObj, number][]>();
	for (const row of rows) {
		const categoryObj = findCategoryGroup(row[0] as string);
		if (!categoryGroupMap.has(categoryObj.generalCategory)) {
			categoryGroupMap.set(categoryObj.generalCategory, []);
		}
		categoryGroupMap
			.get(categoryObj.generalCategory)
			?.push([categoryObj, row[1] as number]);
	}
	return categoryGroupMap;
}
