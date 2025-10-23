import { dwgSchedule } from "../sql/dwg-schedule";
import { floorSchedule } from "../sql/floor-schedule";
import { floorScheduleByType } from "../sql/floor-schedule-by-type";
import { listGrids, listLevels } from "../sql/level-and-grid";
import {
	listGridWithCoredStatus,
	listLevelWithCoredStatus,
} from "../sql/level-and-grid-codrination-status";
import { levelSchedule } from "../sql/level-schedule";
import { basicMaterialsInfo } from "../sql/materials-basic-info";
import { roomScheduleByLevel } from "../sql/room-count-by-level";
import { simpleRoomSchedule } from "../sql/room-simple-schedule";
import { rvtSchedule } from "../sql/rvt-schedule";
import { sheetSchedule } from "../sql/sheets-schedule";
import { structuralColumnMaterials } from "../sql/structural-column-materials";
import { structuralColumnSchedule } from "../sql/structural-column-schedule";
import { structuralFrameMaterials } from "../sql/structural-frame-materials";
import { structuralFrameSchedule } from "../sql/structural-frame-schedule";
import { tagsTotalCountByCategory } from "../sql/tags-total-count-by-category";
import { tagsTotalCountByFamily } from "../sql/tags-total-count-by-family";
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
			queryTitle: "Level Schedule",
			sqlQuery: levelSchedule,
			explaination: "List all levels along with their coordinates",
		},
		{
			queryTitle: "Levels Cordination View",
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
			queryTitle: "List all Grids",
			sqlQuery: listGrids,
			explaination: "List all grids along with their coordinates",
		},
		{
			queryTitle: "Grids Cordination View",
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
			queryTitle: "Materials Basic Info",
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
			queryTitle: "Wall Double and Point Parameters",
			sqlQuery: wallDoubleAndPointParameters,
			explaination: "Wall double and point parameters (metric)",
		},
		{
			queryTitle: "Wall Element Basic Info",
			sqlQuery: wallElementBasicInfo,
			explaination: "Wall element basic info",
		},
		{
			queryTitle: "Wall Build up Schedule",
			sqlQuery: listWallBuildUps,
			explaination: "Wall build up schedule (metric)",
		},
	],
};

const views: QueriesSelector = {
	queryCategory: "Views",
	queryObjects: [
		{
			queryTitle: "Count Unplaced Views",
			sqlQuery: countUnplacedViews,
			explaination: "Count number of placed and unplaced views",
		},
		{
			queryTitle: "Count by View Family",
			sqlQuery: countByViewFamily,
			explaination: "Count number of views by view family",
		},
		{
			queryTitle: "Count by View Type",
			sqlQuery: countByViewType,
			explaination: "Count number of views by view type",
		},
		{
			queryTitle: "Count by View Family and Type",
			sqlQuery: countViewByFamilyAndType,
			explaination: "Count number of views by view family and type",
		},
	],
};

const tags: QueriesSelector = {
	queryCategory: "Tags",
	queryObjects: [
		{
			queryTitle: "Count Total Tags by  Category",
			sqlQuery: tagsTotalCountByCategory,
			explaination:
				"Count total number of tags in the Revit project by category",
		},
		{
			queryTitle: "Count Total Tags by Family",
			sqlQuery: tagsTotalCountByFamily,
			explaination: "Count total number of tags in the Revit project by family",
		},
		// NOTE: can't use this untill the exporter is improved with fily type
		// support due to the duplicated names of type under different families
		// {
		// 	queryTitle: "Count Total Tags by Type",
		// 	sqlQuery: tagsTotalCountByType,
		// 	explaination: "Count total number of tags in the Revit project by type",
		// },
	],
};

const sheets: QueriesSelector = {
	queryCategory: "Sheets",
	queryObjects: [
		{
			queryTitle: "Sheet Schedule",
			sqlQuery: sheetSchedule,
			explaination: "Simple sheets schedule",
		},
	],
};

const rooms: QueriesSelector = {
	queryCategory: "Rooms",
	queryObjects: [
		{
			queryTitle: "Simple Room Schedule",
			sqlQuery: simpleRoomSchedule,
			explaination: "Simple room schedule",
		},
		{
			queryTitle: "Room Schedule by Level",
			sqlQuery: roomScheduleByLevel,
			explaination: "Room Schedule by Level",
		},
	],
};

const cadLinks: QueriesSelector = {
	queryCategory: "CAD & RVT Links",
	queryObjects: [
		{
			queryTitle: "CAD Links",
			sqlQuery: dwgSchedule,
			explaination: "CAD Links",
		},
		{
			queryTitle: "RVT Links",
			sqlQuery: rvtSchedule,
			explaination: "RVT Links",
		},
	],
};

const floors: QueriesSelector = {
	queryCategory: "Floors",
	queryObjects: [
		{
			queryTitle: "Floor Schedule",
			sqlQuery: floorSchedule,
			explaination: "Floor Schedule",
		},
		{
			queryTitle: "Floor Schedule by Floor Type",
			sqlQuery: floorScheduleByType,
			explaination: "Floor Schedule by Floor Type",
		},
	],
};

const structure: QueriesSelector = {
	queryCategory: "Structure",
	queryObjects: [
		{
			queryTitle: "Column Schedule",
			sqlQuery: structuralColumnSchedule,
			explaination: "Structural column Schedule",
		},
		{
			queryTitle: "Column Materials",
			sqlQuery: structuralColumnMaterials,
			explaination: "Structural column Materials",
		},
		{
			queryTitle: "Frame Schedule",
			sqlQuery: structuralFrameSchedule,
			explaination: "Structural frame Schedule",
		},
		{
			queryTitle: "Frame Materials",
			sqlQuery: structuralFrameMaterials,
			explaination: "Structural frame Materials",
		},
	],
};

export const queriesSelectorList: QueriesSelector[] = [
	levels,
	grids,
	materials,
	walls,
	views,
	tags,
	sheets,
	rooms,
	cadLinks,
	floors,
	structure,
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
