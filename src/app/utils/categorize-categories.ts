import { CategoryObj, CategoryObjs, GeneralCategoryObj } from "./types";

const projectSettingCategory: CategoryObj = {
	generalCategory: "Project Setting",
	categoryWithReadiness: [
		{
			categoryName: "Design Option Sets",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Design Options",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Internal Origin",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Location Data",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Phases",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Project Information",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Revision",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Project Base Point",
			analyticalReadiness: "GEO",
		},
		{
			categoryName: "Survey Point",
			analyticalReadiness: "GEO",
		},
		{
			categoryName: "__DOCUMENT__",
			analyticalReadiness: "MLT",
		},
	],
};

const archCategory: CategoryObj = {
	generalCategory: "Architecture",
	categoryWithReadiness: [
		{
			categoryName: "<Stair/Ramp Sketch: Boundary>",
			analyticalReadiness: "LOW",
		},
		{
			categoryName: "<Stair/Ramp Sketch: Landing Center>",
			analyticalReadiness: "LOW",
		},
		{ categoryName: "<Stair/Ramp Sketch: Riser>", analyticalReadiness: "LOW" },
		{ categoryName: "<Stair/Ramp Sketch: Run>", analyticalReadiness: "LOW" },
		{
			categoryName: "<Stair/Ramp Sketch: Stair Path>",
			analyticalReadiness: "LOW",
		},
		{ categoryName: "<Path of Travel Lines>", analyticalReadiness: "GEO" },
		{ categoryName: "Balusters", analyticalReadiness: "MLT" },
		{ categoryName: "Casework", analyticalReadiness: "ANA" },
		{ categoryName: "Ceilings", analyticalReadiness: "ANA" },
		{ categoryName: "Columns", analyticalReadiness: "GEO" },
		{ categoryName: "Doors", analyticalReadiness: "ANA" },
		{ categoryName: "Fascias", analyticalReadiness: "MLT" },
		{ categoryName: "Floors", analyticalReadiness: "ANA" },
		{ categoryName: "Furniture Systems", analyticalReadiness: "MLT" },
		{ categoryName: "Furniture", analyticalReadiness: "MLT" },
		{ categoryName: "Gutters", analyticalReadiness: "MLT" },
		{ categoryName: "Handrails", analyticalReadiness: "MLT" },
		{ categoryName: "Landings", analyticalReadiness: "GEO" },
		{ categoryName: "Railings", analyticalReadiness: "MLT" },
		{ categoryName: "Ramps", analyticalReadiness: "GEO" },
		{ categoryName: "Roofs", analyticalReadiness: "ANA" },
		{ categoryName: "Runs", analyticalReadiness: "LOW" },
		{ categoryName: "Specialty Equipment", analyticalReadiness: "MLT" },
		{ categoryName: "Stair Paths", analyticalReadiness: "LOW" },
		{ categoryName: "Stairs", analyticalReadiness: "GEO" },
		{ categoryName: "Top Rails", analyticalReadiness: "MLT" },
		{ categoryName: "Vertical Circulation", analyticalReadiness: "GEO" },
		{ categoryName: "Walls", analyticalReadiness: "GEO" },
		{ categoryName: "Windows", analyticalReadiness: "ANA" },
		{ categoryName: "Wall Sweeps", analyticalReadiness: "MLT" },
	],
};

const curtainWallSystemCategory: CategoryObj = {
	generalCategory: "Curtain Wall System",
	categoryWithReadiness: [
		{ categoryName: "Curtain Panels", analyticalReadiness: "GEO" },
		{ categoryName: "Curtain Roof Grids", analyticalReadiness: "MLT" },
		{ categoryName: "Curtain System Grid Layout", analyticalReadiness: "MLT" },
		{ categoryName: "Curtain Systems", analyticalReadiness: "ANA" },
		{ categoryName: "Curtain Wall Grids", analyticalReadiness: "MLT" },
		{ categoryName: "Curtain Wall Mullions", analyticalReadiness: "GEO" },
	],
};

const levelGridCategory: CategoryObj = {
	generalCategory: "Level & Grid",
	categoryWithReadiness: [
		{ categoryName: "Grid Heads", analyticalReadiness: "LOW" },
		{ categoryName: "Grids", analyticalReadiness: "GEO" },
		{ categoryName: "Guide Grid", analyticalReadiness: "LOW" },
		{ categoryName: "Level Heads", analyticalReadiness: "LOW" },
		{ categoryName: "Levels", analyticalReadiness: "GEO" },
		{ categoryName: "Reference Planes", analyticalReadiness: "QTY" },
		{ categoryName: "Scope Boxes", analyticalReadiness: "MLT" },
	],
};

const roomAreaCategory: CategoryObj = {
	generalCategory: "Room & Area",
	categoryWithReadiness: [
		{ categoryName: "<Area Based Load Boundary>", analyticalReadiness: "GEO" },
		{ categoryName: "<Area Boundary>", analyticalReadiness: "GEO" },
		{ categoryName: "<Room Separation>", analyticalReadiness: "GEO" },
		{ categoryName: "<Space Separation>", analyticalReadiness: "GEO" },
		{ categoryName: "Rooms", analyticalReadiness: "ANA" },
		{ categoryName: "Areas", analyticalReadiness: "ANA" },
		{ categoryName: "Area Schemes", analyticalReadiness: "LOW" },
		{ categoryName: "Space Separation", analyticalReadiness: "MLT" },
		{ categoryName: "Spaces", analyticalReadiness: "ANA" },
		{ categoryName: "Space Type Settings", analyticalReadiness: "ANA" },
		{ categoryName: "Analytical Spaces", analyticalReadiness: "ANA" },
	],
};

const structureCategory: CategoryObj = {
	generalCategory: "Structure",
	categoryWithReadiness: [
		{ categoryName: "Bearings", analyticalReadiness: "GEO" },
		{ categoryName: "Cover Type", analyticalReadiness: "MLT" },
		{ categoryName: "Plates", analyticalReadiness: "GEO" },
		{ categoryName: "Structural Beam Systems", analyticalReadiness: "ANA" },
		{ categoryName: "Point Loads", analyticalReadiness: "MLT" },
		{ categoryName: "Slab Edges", analyticalReadiness: "GEO" },
		{ categoryName: "Structural Columns", analyticalReadiness: "ANA" },
		{ categoryName: "Structural Connections", analyticalReadiness: "MLT" },
		{ categoryName: "Structural Foundations", analyticalReadiness: "ANA" },
		{ categoryName: "Structural Framing", analyticalReadiness: "ANA" },
		{ categoryName: "Structural Load Cases", analyticalReadiness: "LOW" },
		{ categoryName: "Structural Loads", analyticalReadiness: "MLT" },
		{ categoryName: "Structural Rebar", analyticalReadiness: "GEO" },
		{ categoryName: "Structural Trusses", analyticalReadiness: "GEO" },
		{ categoryName: "StructuralDeck", analyticalReadiness: "GEO" },
		{ categoryName: "Supports", analyticalReadiness: "MLT" },
	],
};

const mepCategory: CategoryObj = {
	generalCategory: "M&E",
	categoryWithReadiness: [
		{ categoryName: "Air Terminals", analyticalReadiness: "ANA" },
		{ categoryName: "Mechanical Equipment", analyticalReadiness: "ANA" },
		{ categoryName: "Center Line", analyticalReadiness: "GEO" },
		{ categoryName: "Plumbing Fixtures", analyticalReadiness: "ANA" },
		{ categoryName: "Plumbing Equipment", analyticalReadiness: "ANA" },
		{ categoryName: "Pipe Fittings", analyticalReadiness: "ANA" },
		{ categoryName: "Pipe Accessories", analyticalReadiness: "MLT" },
		{ categoryName: "Pipe Segments", analyticalReadiness: "ANA" },
		{ categoryName: "Pipes", analyticalReadiness: "ANA" },
		{ categoryName: "Piping Systems", analyticalReadiness: "ANA" },
		{ categoryName: "Valves", analyticalReadiness: "ANA" },
		{ categoryName: "Ducts", analyticalReadiness: "ANA" },
		{ categoryName: "Duct Fittings", analyticalReadiness: "ANA" },
		{ categoryName: "Duct Systems", analyticalReadiness: "ANA" },
		{ categoryName: "Flex Ducts", analyticalReadiness: "ANA" },
		{ categoryName: "Conduits", analyticalReadiness: "ANA" },
		{ categoryName: "Conduit Runs", analyticalReadiness: "ANA" },
		{ categoryName: "Conduit Fittings", analyticalReadiness: "ANA" },
		{ categoryName: "Electrical Fixtures", analyticalReadiness: "MLT" },
		{ categoryName: "Lighting Fixtures", analyticalReadiness: "ANA" },
		{ categoryName: "Lighting Devices", analyticalReadiness: "MLT" },
		{ categoryName: "Electrical Equipment", analyticalReadiness: "ANA" },
		{ categoryName: "Data Devices", analyticalReadiness: "MLT" },
		{ categoryName: "Distribution Systems", analyticalReadiness: "MLT" },
		{ categoryName: "Wires", analyticalReadiness: "ANA" },
		{ categoryName: "Wire Materials", analyticalReadiness: "LOW" },
		{ categoryName: "Wire Insulations", analyticalReadiness: "LOW" },
		{ categoryName: "Electrical Circuits", analyticalReadiness: "ANA" },
		{ categoryName: "Electrical Load Areas", analyticalReadiness: "ANA" },
		{ categoryName: "HVAC Zones", analyticalReadiness: "ANA" },
		{ categoryName: "HVAC Load Schedules", analyticalReadiness: "MLT" },
		{ categoryName: "Electrical Analytical Bus", analyticalReadiness: "MLT" },
		{ categoryName: "Electrical Analytical Loads", analyticalReadiness: "ANA" },
		{
			categoryName: "Electrical Analytical Power Source",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Electrical Analytical Transformer",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Electrical Demand Factor Definitions",
			analyticalReadiness: "LOW",
		},
		{
			categoryName: "Electrical Load Classification Parameter Element",
			analyticalReadiness: "LOW",
		},
		{
			categoryName: "Electrical Load Classifications",
			analyticalReadiness: "MLT",
		},
		{
			categoryName: "Electrical Spare/Space Circuits",
			analyticalReadiness: "MLT",
		},
		{ categoryName: "Voltages", analyticalReadiness: "MLT" },
	],
};

const annotateCategory: CategoryObj = {
	generalCategory: "Annotate & Graphics",
	categoryWithReadiness: [
		{ categoryName: "Callout Heads", analyticalReadiness: "LOW" },
		{ categoryName: "Color Fill Legends", analyticalReadiness: "LOW" },
		{ categoryName: "Color Fill Schema", analyticalReadiness: "LOW" },
		{ categoryName: "Cut Marks", analyticalReadiness: "LOW" },
		{ categoryName: "Cut Profile", analyticalReadiness: "LOW" },
		{ categoryName: "Detail Groups", analyticalReadiness: "LOW" },
		{ categoryName: "Detail Item Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Detail Items", analyticalReadiness: "LOW" },
		{ categoryName: "Dimensions", analyticalReadiness: "LOW" },
		{ categoryName: "Elevation Marks", analyticalReadiness: "LOW" },
		{ categoryName: "Generic Annotations", analyticalReadiness: "LOW" },
		{ categoryName: "Keynote Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Legend Components", analyticalReadiness: "LOW" },
		{ categoryName: "Multi-Category Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Path of Travel Lines", analyticalReadiness: "LOW" },
		{ categoryName: "Revision Cloud Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Revision Clouds", analyticalReadiness: "LOW" },
		{
			categoryName: "Revision Numbering Sequences",
			analyticalReadiness: "LOW",
		},
		{ categoryName: "Section Marks", analyticalReadiness: "LOW" },
		{ categoryName: "Span Direction Symbol", analyticalReadiness: "LOW" },
		{ categoryName: "Spot Coordinates", analyticalReadiness: "LOW" },
		{ categoryName: "Spot Elevation Symbols", analyticalReadiness: "LOW" },
		{ categoryName: "Spot Elevations", analyticalReadiness: "LOW" },
		{ categoryName: "Text Notes", analyticalReadiness: "LOW" },
		{ categoryName: "Spot Slopes", analyticalReadiness: "LOW" },
		{ categoryName: "Raster Images", analyticalReadiness: "ANA" },
	],
};

const massingSiteCategory: CategoryObj = {
	generalCategory: "Massing, Site & Landscape",
	categoryWithReadiness: [
		{ categoryName: "Mass", analyticalReadiness: "MLT" },
		{ categoryName: "Mass Floors", analyticalReadiness: "QTY" },
		{ categoryName: "Mass Opening", analyticalReadiness: "QTY" },
		{ categoryName: "Mass Roof", analyticalReadiness: "QTY" },
		{ categoryName: "Mass Shade", analyticalReadiness: "QTY" },
		{ categoryName: "Mass Walls", analyticalReadiness: "QTY" },
		{ categoryName: "Mass Windows and Skylights", analyticalReadiness: "QTY" },
		{ categoryName: "Site", analyticalReadiness: "ANA" },
		{ categoryName: "Property Lines", analyticalReadiness: "MLT" },
		{ categoryName: "Property Line Segments", analyticalReadiness: "MLT" },
		{ categoryName: "Primary Contours", analyticalReadiness: "MLT" },
		{ categoryName: "Shared Site", analyticalReadiness: "LOW" },
		{ categoryName: "Survey Point", analyticalReadiness: "MLT" },
		{ categoryName: "Toposolid", analyticalReadiness: "ANA" },
		{ categoryName: "Hardscape", analyticalReadiness: "ANA" },
		{ categoryName: "Parking", analyticalReadiness: "ANA" },
		{ categoryName: "Planting", analyticalReadiness: "ANA" },
	],
};

const modelElementsCategory: CategoryObj = {
	generalCategory: "Model Elements",
	categoryWithReadiness: [
		{ categoryName: "Model Groups", analyticalReadiness: "MLT" },
		{ categoryName: "Generic Models", analyticalReadiness: "MLT" },
		{ categoryName: "Entourage", analyticalReadiness: "ANA" },
		{ categoryName: "Shaft Openings", analyticalReadiness: "MLT" },
		{ categoryName: "Array", analyticalReadiness: "LOW" },
		{ categoryName: "Adaptive Points", analyticalReadiness: "GEO" },
		{ categoryName: "Analytical Surfaces", analyticalReadiness: "ANA" },
		{ categoryName: "Work Plane Grid", analyticalReadiness: "LOW" },
		{ categoryName: "Profiles", analyticalReadiness: "MLT" },
		{ categoryName: "Lines", analyticalReadiness: "GEO" }, // TODO:check where these lines actually are in 3D space...
		{ categoryName: "Constraints", analyticalReadiness: "QTY" },
		{
			categoryName: "Rectangular Arc Wall Opening",
			analyticalReadiness: "ANA",
		},
		{
			categoryName: "Rectangular Straight Wall Opening",
			analyticalReadiness: "ANA",
		},
		{ categoryName: "Floor opening cut", analyticalReadiness: "ANA" },
		{ categoryName: "Structural opening cut", analyticalReadiness: "ANA" },
	],
};

const viewCategory: CategoryObj = {
	generalCategory: "View",
	categoryWithReadiness: [
		{ categoryName: "Views", analyticalReadiness: "ANA" },
		{ categoryName: "Viewports", analyticalReadiness: "ANA" },
		{ categoryName: "View Reference", analyticalReadiness: "ANA" },
		{ categoryName: "Section Boxes", analyticalReadiness: "QTY" },
		{ categoryName: "Sections", analyticalReadiness: "ANA" },
		{ categoryName: "Elevations", analyticalReadiness: "ANA" },
		{ categoryName: "Plan Region", analyticalReadiness: "ANA" },
		{ categoryName: "Cameras", analyticalReadiness: "ANA" },
	],
};

const materialsCategory: CategoryObj = {
	generalCategory: "Materials",
	categoryWithReadiness: [
		{ categoryName: "Materials", analyticalReadiness: "ANA" },
		{ categoryName: "Material Assets", analyticalReadiness: "ANA" },
		{ categoryName: "<Insulation Batting Lines>", analyticalReadiness: "MLT" },
	],
};

const wallAssemblyCategory: CategoryObj = {
	generalCategory: "Wall Assembly",
	categoryWithReadiness: [
		{ categoryName: "Substrate", analyticalReadiness: "ANA" },
		{ categoryName: "Membrane", analyticalReadiness: "ANA" },
		{ categoryName: "Finish1", analyticalReadiness: "ANA" },
		{ categoryName: "Finish2", analyticalReadiness: "ANA" },
		{ categoryName: "Insulation", analyticalReadiness: "ANA" },
		{ categoryName: "Structure", analyticalReadiness: "ANA" },
	],
};

const analyticalCategory: CategoryObj = {
	generalCategory: "Analytical",
	categoryWithReadiness: [
		{ categoryName: "Analytical Members", analyticalReadiness: "GEO" },
		{ categoryName: "Analytical Nodes", analyticalReadiness: "MLT" },
		{ categoryName: "Analytical Openings", analyticalReadiness: "GEO" },
		{ categoryName: "Analytical Panels", analyticalReadiness: "GEO" },
	],
};

const architectureTagsCategory: CategoryObj = {
	generalCategory: "Architecture Tags",
	categoryWithReadiness: [
		{ categoryName: "Area Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Ceiling Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Curtain Panel Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Door Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Floor Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Furniture Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Generic Model Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Parking Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Path of Travel Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Planting Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Property Line Segment Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Railing Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Roof Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Room Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Space Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Stair Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Wall Sweep Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Wall Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Window Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Material Tags", analyticalReadiness: "QTY" },
	] as const,
};

const structureTagsCategory: CategoryObj = {
	generalCategory: "Structure Tags",
	categoryWithReadiness: [
		{ categoryName: "Area Based Load Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Structural Beam System Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Structural Column Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Structural Foundation Tags", analyticalReadiness: "LOW" },
		{ categoryName: "Structural Framing Tags", analyticalReadiness: "LOW" },
	],
};

const mepTagsCategory: CategoryObj = {
	generalCategory: "M&E Tags",
	categoryWithReadiness: [
		{ categoryName: "Conduit Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Duct Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Electrical Equipment Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Electrical Fixture Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Flex Duct Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Lighting Fixture Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Mechanical Equipment Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Pipe Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Plumbing Equipment Tags", analyticalReadiness: "QTY" },
		{ categoryName: "Wire Tags", analyticalReadiness: "QTY" },
	],
};

const sheetsSchedulesCategory: CategoryObj = {
	generalCategory: "Sheets and Schedules",
	categoryWithReadiness: [
		{ categoryName: "Sheets", analyticalReadiness: "ANA" },
		{ categoryName: "Schedules", analyticalReadiness: "QTY" },
		{ categoryName: "Schedule Graphics", analyticalReadiness: "QTY" },
		{ categoryName: "Title Blocks", analyticalReadiness: "QTY" },
		{ categoryName: "View Titles", analyticalReadiness: "LOW" },
	],
};

export const categoriesCategory: CategoryObjs = [
	projectSettingCategory,
	archCategory,
	levelGridCategory,
	curtainWallSystemCategory,
	roomAreaCategory,
	structureCategory,
	mepCategory,
	massingSiteCategory,
	materialsCategory,
	wallAssemblyCategory,
	viewCategory,
	annotateCategory,
	analyticalCategory,
	modelElementsCategory,
	architectureTagsCategory,
	structureTagsCategory,
	mepTagsCategory,
	sheetsSchedulesCategory,
	// miscCategory, // don't include Misc as whatever are not here should be in Misc
];

export function findCategoryGroup(categoryName: string): GeneralCategoryObj {
	if (categoryName === "RVT Links") {
		return {
			generalCategory: "RVT & CAD Links",
			categoryName: categoryName,
			analyticalReadiness: "MLT",
		};
	}

	for (const group of categoriesCategory) {
		const match = group.categoryWithReadiness.find(
			(n) => n.categoryName === categoryName
		);
		if (match) {
			return {
				generalCategory: group.generalCategory,
				categoryName: categoryName,
				analyticalReadiness: match.analyticalReadiness,
			};
		}
	}

	if (/\.(dwg)(\s*[\(\[].*[\)\]])?$/i.test(categoryName)) {
		// return "RVT & CAD Links";
		return {
			generalCategory: "RVT & CAD Links",
			categoryName: categoryName,
			analyticalReadiness: "QTY",
		};
	}
	return {
		generalCategory: "Misc",
		categoryName: categoryName,
		analyticalReadiness: "LOW",
	};
}
