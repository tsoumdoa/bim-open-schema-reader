import { findCategoryGroup } from "./categorize-categories";
import { GenerailCategoryObj } from "./types";

export function cleanCategoryCount(rows: (string | number)[][]) {
  const categoryGorupMap = new Map<string, [GenerailCategoryObj, number][]>();
  for (const row of rows) {
    const categoryObj = findCategoryGroup(row[0] as string);
    if (!categoryGorupMap.has(categoryObj.generalCategory)) {
      categoryGorupMap.set(categoryObj.generalCategory, []);
    }
    categoryGorupMap
      .get(categoryObj.generalCategory)
      ?.push([categoryObj, row[1] as number]);
  }
  return categoryGorupMap;
}
