import { listGrids, listLevels } from "../sql/level-and-grid";
import {
	listGridWithCoredStatus,
	listLevelWithCoredStatus,
} from "../sql/level-and-grid-codrination-status";
import { basicMaterialsInfo } from "../sql/materials-basic-info";
import { basicViewInfo } from "../sql/view-basic-info";
import { countByViewFamily } from "../sql/view-count-by-view-family";
import { countViewByFamilyAndType } from "../sql/view-count-by-view-family-and-type";
import { countByViewType } from "../sql/view-count-by-view-type";
import { countUnplacedViews } from "../sql/view-count-unplaced-views";
import { listWallBuildUps } from "../sql/wall-build-ups";
import { wallDoubleAndPointParameters } from "../sql/wall-double-and-pt-parameters";
import { wallElementBasicInfo } from "../sql/wall-element-basic-info";
import { DenormTableName, QueriesSelector } from "./types";

const levels: QueriesSelector = {
	queryCategory: "Levels",
	queryObjects: [
		{
			queryTitle: "List all levels",
			sqlQuery: listLevels,
			explaination: "List all levels along with their coordinates",
		},
		{
			queryTitle: "Levels cordination view",
			sqlQuery: listLevelWithCoredStatus,
			explaination:
				"Compare levels with the linked models to check if they are in the same location",
		},
	],
};

const grids: QueriesSelector = {
	queryCategory: "Grids",
	queryObjects: [
		{
			queryTitle: "List all grids",
			sqlQuery: listGrids,
			explaination: "List all grids along with their coordinates",
		},
		{
			queryTitle: "Grids cordination view",
			sqlQuery: listGridWithCoredStatus,
			explaination:
				"Compare grids with the linked models to check if they are in the same location",
		},
	],
};

const materials: QueriesSelector = {
	queryCategory: "Materials",
	queryObjects: [
		{
			queryTitle: "Materials basic info",
			sqlQuery: basicMaterialsInfo,
			explaination:
				"List visual material properties: Color (hex RGB), Shine (0–128), Glow (0–100), Smoothness (0–100), Shininess (0–100).",
		},
	],
};

const walls: QueriesSelector = {
	queryCategory: "Walls",
	queryObjects: [
		{
			queryTitle: "Wall double and point parameters",
			sqlQuery: wallDoubleAndPointParameters,
			explaination: "Wall double and point parameters (metric)",
		},
		{
			queryTitle: "Wall element basic info",
			sqlQuery: wallElementBasicInfo,
			explaination: "Wall element basic info",
		},
		{
			queryTitle: "Wall build up schedule",
			sqlQuery: listWallBuildUps,
			explaination: "Wall build up schedule (metric)",
		},
	],
};

const views: QueriesSelector = {
	queryCategory: "Views",
	queryObjects: [
		// {
		// 	queryTitle: "Basic view info",
		// 	sqlQuery: basicViewInfo,
		// 	explaination: "Basic info for each view",
		// },
		{
			queryTitle: "Count unplaced views",
			sqlQuery: countUnplacedViews,
			explaination: "Count number of placed and unplaced views",
		},
		{
			queryTitle: "Count by view family",
			sqlQuery: countByViewFamily,
			explaination: "Count number of views by view family",
		},
		{
			queryTitle: "Count by view type",
			sqlQuery: countByViewType,
			explaination: "Count number of views by view type",
		},
		{
			queryTitle: "Count by view family and type",
			sqlQuery: countViewByFamilyAndType,
			explaination: "Count number of views by view family and type",
		},
	],
};

export const queriesSelectorList: QueriesSelector[] = [
	levels,
	grids,
	materials,
	walls,
	views,
];

export const denormParamQueryBuilderName: {
	tableName: DenormTableName;
	displayName: string;
}[] = [
	{
		tableName: "denorm_double_params",
		displayName: "Double Parameters",
	},
	{
		tableName: "denorm_entity_params",
		displayName: "Entity Parameters",
	},
	{
		tableName: "denorm_integer_params",
		displayName: "Integer Parameters",
	},
	{
		tableName: "denorm_points_params",
		displayName: "Point Parameters",
	},
	{
		tableName: "denorm_string_params",
		displayName: "String Parameters",
	},
] as const;
