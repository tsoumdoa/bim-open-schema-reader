import {
	denormDoubleParams,
	denormEntityParams,
	denormIntegerParams,
	denormPointsParams,
	denormStringParams,
} from "../sql/denorm-param-query";
import { DenormTableName, QueryObject } from "./types";
import { denormParamQueryBuilderName } from "./queries-selector-list";

export function denormParamQueryBuilder(
	paramType: DenormTableName,
	categoryName: string
): QueryObject {
	const title = denormParamQueryBuilderName.find(
		(q) => q.tableName === paramType
	)?.displayName;
	const queryObj = {
		queryCategory: categoryName,
		queryTitle: `List ${title}`,
		sqlQuery: "",
		explaination: "",
	};
	denormParamQueryBuilder;
	switch (paramType) {
		case "denorm_double_params":
			queryObj.sqlQuery = denormDoubleParams(categoryName);
			break;

		case "denorm_entity_params":
			queryObj.sqlQuery = denormEntityParams(categoryName);
			break;

		case "denorm_integer_params":
			queryObj.sqlQuery = denormIntegerParams(categoryName);
			break;

		case "denorm_points_params":
			queryObj.sqlQuery = denormPointsParams(categoryName);
			break;

		case "denorm_string_params":
			queryObj.sqlQuery = denormStringParams(categoryName);
			break;

		default:
			break;
	}
	return queryObj;
}
