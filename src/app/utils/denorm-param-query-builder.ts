import {
  denormDoubleParams,
  denormDoubleParamsPivot,
  denormDoubleParamsStats,
  denormEntityParams,
  denormEntityParamsPivot,
  denormEntityParamsStats,
  denormIntegerParams,
  denormIntegerParamsPivot,
  denormIntegerParamsStats,
  denormPointsParams,
  denormPointsParamsPivot,
  denormPointsParamsStats,
  denormStringParams,
  denormStringParamsPivot,
  denormStringParamsStats,
} from "../sql/denorm-param-query";
import { denormParamQueryBuilderName } from "./queries-selector-list";
import { DenormTableName, QueryObject, DenormParamQueryType } from "./types";

function queryTypeTitle(queryType: DenormParamQueryType) {
  switch (queryType) {
    case "flatten":
      return "(Flatten)";
    case "pivot":
      return "(Pivot)";
    default:
      return "(Stats)";
  }
}

export function denormParamQueryBuilder(
  paramType: DenormTableName,
  categoryName: string,
  queryType: DenormParamQueryType
): QueryObject {
  const title = denormParamQueryBuilderName.find(
    (q) => q.tableName === paramType
  )?.displayName;
  const queryObj = {
    queryCategory: categoryName,
    queryTitle: `${title} - ${categoryName || "<undefined>"} ${queryTypeTitle(queryType)}`, //format category name
    sqlQuery: "",
    explaination: "",
  };
  denormParamQueryBuilder;
  switch (paramType) {
    case "denorm_double_params":
      if (queryType === "pivot") {
        queryObj.sqlQuery = denormDoubleParamsPivot(categoryName);
      }
      if (queryType === "flatten") {
        queryObj.sqlQuery = denormDoubleParams(categoryName);
      }
      if (queryType === "stats") {
        queryObj.sqlQuery = denormDoubleParamsStats(categoryName);
      }

      break;

    case "denorm_entity_params":
      if (queryType === "pivot") {
        queryObj.sqlQuery = denormEntityParamsPivot(categoryName);
      }
      if (queryType === "flatten") {
        queryObj.sqlQuery = denormEntityParams(categoryName);
      }
      if (queryType === "stats") {
        queryObj.sqlQuery = denormEntityParamsStats(categoryName);
      }
      break;

    case "denorm_integer_params":
      if (queryType === "pivot") {
        queryObj.sqlQuery = denormIntegerParamsPivot(categoryName);
      }
      if (queryType === "flatten") {
        queryObj.sqlQuery = denormIntegerParams(categoryName);
      }
      if (queryType === "stats") {
        queryObj.sqlQuery = denormIntegerParamsStats(categoryName);
      }
      break;
    case "denorm_points_params":
      if (queryType === "pivot") {
        queryObj.sqlQuery = denormPointsParamsPivot(categoryName);
      }
      if (queryType === "flatten") {
        queryObj.sqlQuery = denormPointsParams(categoryName);
      }
      if (queryType === "stats") {
        queryObj.sqlQuery = denormPointsParamsStats(categoryName);
      }
      break;

    case "denorm_string_params":
      if (queryType === "pivot") {
        queryObj.sqlQuery = denormStringParamsPivot(categoryName);
      }
      if (queryType === "flatten") {
        queryObj.sqlQuery = denormStringParams(categoryName);
      }
      if (queryType === "stats") {
        queryObj.sqlQuery = denormStringParamsStats(categoryName);
      }
      break;

    default:
      break;
  }
  return queryObj;
}
