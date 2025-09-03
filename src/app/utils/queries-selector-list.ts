import { createBosTable } from "./queries";
import { QueriesSelector } from "./types";

export const queriesSelectorList: QueriesSelector[] = [
	{
		queryCategory: "Level and Grid",
		queryObjects: [
			{
				queryTile: "List all levels",
				sqlQuery: createBosTable(),
				explaination: "List all levels along with their coordinates",
			},
			{
				queryTile: "List all grids",
				sqlQuery: "SELECT * FROM Grids",
				explaination: "List all grids along with their coordinates",
			},
			{
				queryTile: "Levels cordination view",
				sqlQuery: "SELECT * FROM Levels_Coordinate",
				explaination:
					"Compare levels with the linked models to check if they are in the same location",
			},
			{
				queryTile: "Grids cordination view",
				sqlQuery: "SELECT * FROM Grids_Coordinate",
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
				sqlQuery: "SELECT * FROM Wall_Double_Parameters",
				explaination: "Wall double and point parameters",
			},
			{
				queryTile: "Wall element basic info",
				sqlQuery: "SELECT * FROM Wall_Element_Basic_Info",
				explaination: "Wall element basic info",
			},
			{
				queryTile: "Wall int, str, and entity parameters",
				sqlQuery: "SELECT * FROM Wall_Int_Str_Entity_Parameters",
				explaination: "Wall int, str, and entity parameters",
			},
			{
				queryTile: "Wall build up schadule",
				sqlQuery: "SELECT * FROM Wall_Buildup_Schedule",
				explaination: "Wall build up schadule",
			},
		],
	},
] as const;
