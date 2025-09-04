import { listGrids, listLevels } from "../sql/level-and-grid";
import {
	listGridWithCoredStatus,
	listLevelWithCoredStatus,
} from "../sql/level-and-grid-codrination-status";
import { listWallBuildUps } from "../sql/wall-build-ups";
import { wallDoubleAndPointParameters } from "../sql/wall-double-and-pt-parameters";
import { wallElementBasicInfo } from "../sql/wall-element-basic-info";
import { wallIntStrEntityParameters } from "../sql/wall-int-str-entity-parameters";
import { QueriesSelector } from "./types";

export const queriesSelectorList: QueriesSelector[] = [
	{
		queryCategory: "Level and Grid",
		queryObjects: [
			{
				queryTile: "List all levels",
				sqlQuery: listLevels,
				explaination: "List all levels along with their coordinates",
			},
			{
				queryTile: "List all grids",
				sqlQuery: listGrids,
				explaination: "List all grids along with their coordinates",
			},
			{
				queryTile: "Levels cordination view",
				sqlQuery: listLevelWithCoredStatus,
				explaination:
					"Compare levels with the linked models to check if they are in the same location",
			},
			{
				queryTile: "Grids cordination view",
				sqlQuery: listGridWithCoredStatus,
				explaination:
					"Compare grids with the linked models to check if they are in the same location",
			},
		],
	},
	{
		queryCategory: "Wall",
		queryObjects: [
			{
				queryTile: "Wall double and point parameters",
				sqlQuery: wallDoubleAndPointParameters,
				explaination: "Wall double and point parameters",
			},
			{
				queryTile: "Wall element basic info",
				sqlQuery: wallElementBasicInfo,
				explaination: "Wall element basic info",
			},
			{
				queryTile: "Wall int, str, and entity parameters",
				sqlQuery: wallIntStrEntityParameters,
				explaination: "Wall int, str, and entity parameters",
			},
			{
				queryTile: "Wall build up schedule",
				sqlQuery: listWallBuildUps,
				explaination: "Wall build up schedule",
			},
		],
	},
] as const;
