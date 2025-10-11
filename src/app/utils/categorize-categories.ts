import { CategoryObj, CategoryObjs, GenerailCategoryObj } from "./types";

const projectSettingCategory: CategoryObj = {
	generalCategory: "Project Setting",
	categoryWithReadiness: [
		{
			categoryName: "Design Option Sets",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Design Options",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Internal Origin",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Location Data",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Phases",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Project Information",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Revision",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Project Base Point",
			analyticReadiness: "GEO",
		},
		{
			categoryName: "Survey Point",
			analyticReadiness: "GEO",
		},
		{
			categoryName: "__DOCUMENT__",
			analyticReadiness: "MLT",
		},
	],
};

const archCategory: CategoryObj = {
	generalCategory: "Architecture",
	categoryWithReadiness: [
		{ categoryName: "<Stair/Ramp Sketch: Boundary>", analyticReadiness: "LOW" },
		{
			categoryName: "<Stair/Ramp Sketch: Landing Center>",
			analyticReadiness: "LOW",
		},
		{ categoryName: "<Stair/Ramp Sketch: Riser>", analyticReadiness: "LOW" },
		{ categoryName: "<Stair/Ramp Sketch: Run>", analyticReadiness: "LOW" },
		{
			categoryName: "<Stair/Ramp Sketch: Stair Path>",
			analyticReadiness: "LOW",
		},
		{ categoryName: "<Path of Travel Lines>", analyticReadiness: "GEO" },
		{ categoryName: "Balusters", analyticReadiness: "MLT" },
		{ categoryName: "Casework", analyticReadiness: "ANA" },
		{ categoryName: "Ceilings", analyticReadiness: "ANA" },
		{ categoryName: "Columns", analyticReadiness: "GEO" },
		{ categoryName: "Doors", analyticReadiness: "ANA" },
		{ categoryName: "Fascias", analyticReadiness: "MLT" },
		{ categoryName: "Floors", analyticReadiness: "ANA" },
		{ categoryName: "Furniture Systems", analyticReadiness: "MLT" },
		{ categoryName: "Furniture", analyticReadiness: "MLT" },
		{ categoryName: "Gutters", analyticReadiness: "MLT" },
		{ categoryName: "Handrails", analyticReadiness: "MLT" },
		{ categoryName: "Landings", analyticReadiness: "GEO" },
		{ categoryName: "Railings", analyticReadiness: "MLT" },
		{ categoryName: "Ramps", analyticReadiness: "GEO" },
		{ categoryName: "Roofs", analyticReadiness: "ANA" },
		{ categoryName: "Runs", analyticReadiness: "LOW" },
		{ categoryName: "Specialty Equipment", analyticReadiness: "MLT" },
		{ categoryName: "Stair Paths", analyticReadiness: "LOW" },
		{ categoryName: "Stairs", analyticReadiness: "GEO" },
		{ categoryName: "Top Rails", analyticReadiness: "MLT" },
		{ categoryName: "Vertical Circulation", analyticReadiness: "GEO" },
		{ categoryName: "Walls", analyticReadiness: "GEO" },
		{ categoryName: "Windows", analyticReadiness: "ANA" },
		{ categoryName: "Wall Sweeps", analyticReadiness: "MLT" },
	],
};

const curtainWallSystemCategory: CategoryObj = {
	generalCategory: "Curtain Wall System",
	categoryWithReadiness: [
		{ categoryName: "Curtain Panels", analyticReadiness: "GEO" },
		{ categoryName: "Curtain Roof Grids", analyticReadiness: "MLT" },
		{ categoryName: "Curtain System Grid Layout", analyticReadiness: "MLT" },
		{ categoryName: "Curtain Systems", analyticReadiness: "ANA" },
		{ categoryName: "Curtain Wall Grids", analyticReadiness: "MLT" },
		{ categoryName: "Curtain Wall Mullions", analyticReadiness: "GEO" },
	],
};

const levelGridCategory: CategoryObj = {
	generalCategory: "Level & Grid",
	categoryWithReadiness: [
		{ categoryName: "Grid Heads", analyticReadiness: "LOW" },
		{ categoryName: "Grids", analyticReadiness: "GEO" },
		{ categoryName: "Guide Grid", analyticReadiness: "LOW" },
		{ categoryName: "Level Heads", analyticReadiness: "LOW" },
		{ categoryName: "Levels", analyticReadiness: "GEO" },
		{ categoryName: "Reference Planes", analyticReadiness: "QTY" },
		{ categoryName: "Scope Boxes", analyticReadiness: "MLT" },
	],
};

const roomAreaCategory: CategoryObj = {
	generalCategory: "Room & Area",
	categoryWithReadiness: [
		{ categoryName: "<Area Based Load Boundary>", analyticReadiness: "GEO" },
		{ categoryName: "<Area Boundary>", analyticReadiness: "GEO" },
		{ categoryName: "<Room Separation>", analyticReadiness: "GEO" },
		{ categoryName: "<Space Separation>", analyticReadiness: "GEO" },
		{ categoryName: "Rooms", analyticReadiness: "ANA" },
		{ categoryName: "Areas", analyticReadiness: "ANA" },
		{ categoryName: "Area Schemes", analyticReadiness: "LOW" },
		{ categoryName: "Space Separation", analyticReadiness: "MLT" },
		{ categoryName: "Spaces", analyticReadiness: "ANA" },
		{ categoryName: "Space Type Settings", analyticReadiness: "ANA" },
		{ categoryName: "Analytical Spaces", analyticReadiness: "ANA" },
	],
};

const structureCategory: CategoryObj = {
	generalCategory: "Structure",
	categoryWithReadiness: [
		{ categoryName: "Bearings", analyticReadiness: "GEO" },
		{ categoryName: "Cover Type", analyticReadiness: "MLT" },
		{ categoryName: "Plates", analyticReadiness: "GEO" },
		{ categoryName: "Structural Beam Systems", analyticReadiness: "ANA" },
		{ categoryName: "Point Loads", analyticReadiness: "MLT" },
		{ categoryName: "Slab Edges", analyticReadiness: "GEO" },
		{ categoryName: "Structural Columns", analyticReadiness: "ANA" },
		{ categoryName: "Structural Connections", analyticReadiness: "MLT" },
		{ categoryName: "Structural Foundations", analyticReadiness: "ANA" },
		{ categoryName: "Structural Framing", analyticReadiness: "ANA" },
		{ categoryName: "Structural Load Cases", analyticReadiness: "LOW" },
		{ categoryName: "Structural Loads", analyticReadiness: "MLT" },
		{ categoryName: "Structural Rebar", analyticReadiness: "GEO" },
		{ categoryName: "Structural Trusses", analyticReadiness: "GEO" },
		{ categoryName: "StructuralDeck", analyticReadiness: "GEO" },
		{ categoryName: "Supports", analyticReadiness: "MLT" },
	],
};

const mepCategory: CategoryObj = {
	generalCategory: "M&E",
	categoryWithReadiness: [
		{ categoryName: "Air Terminals", analyticReadiness: "ANA" },
		{ categoryName: "Mechanical Equipment", analyticReadiness: "ANA" },
		{ categoryName: "Center Line", analyticReadiness: "GEO" },
		{ categoryName: "Plumbing Fixtures", analyticReadiness: "ANA" },
		{ categoryName: "Plumbing Equipment", analyticReadiness: "ANA" },
		{ categoryName: "Pipe Fittings", analyticReadiness: "ANA" },
		{ categoryName: "Pipe Accessories", analyticReadiness: "MLT" },
		{ categoryName: "Pipe Segments", analyticReadiness: "ANA" },
		{ categoryName: "Pipes", analyticReadiness: "ANA" },
		{ categoryName: "Piping Systems", analyticReadiness: "ANA" },
		{ categoryName: "Valves", analyticReadiness: "ANA" },
		{ categoryName: "Ducts", analyticReadiness: "ANA" },
		{ categoryName: "Duct Fittings", analyticReadiness: "ANA" },
		{ categoryName: "Duct Systems", analyticReadiness: "ANA" },
		{ categoryName: "Flex Ducts", analyticReadiness: "ANA" },
		{ categoryName: "Conduits", analyticReadiness: "ANA" },
		{ categoryName: "Conduit Runs", analyticReadiness: "ANA" },
		{ categoryName: "Conduit Fittings", analyticReadiness: "ANA" },
		{ categoryName: "Electrical Fixtures", analyticReadiness: "MLT" },
		{ categoryName: "Lighting Fixtures", analyticReadiness: "ANA" },
		{ categoryName: "Lighting Devices", analyticReadiness: "MLT" },
		{ categoryName: "Electrical Equipment", analyticReadiness: "ANA" },
		{ categoryName: "Data Devices", analyticReadiness: "MLT" },
		{ categoryName: "Distribution Systems", analyticReadiness: "MLT" },
		{ categoryName: "Wires", analyticReadiness: "ANA" },
		{ categoryName: "Wire Materials", analyticReadiness: "LOW" },
		{ categoryName: "Wire Insulations", analyticReadiness: "LOW" },
		{ categoryName: "Electrical Circuits", analyticReadiness: "ANA" },
		{ categoryName: "Electrical Load Areas", analyticReadiness: "ANA" },
		{ categoryName: "HVAC Zones", analyticReadiness: "ANA" },
		{ categoryName: "HVAC Load Schedules", analyticReadiness: "MLT" },
		{ categoryName: "Electrical Analytical Bus", analyticReadiness: "MLT" },
		{ categoryName: "Electrical Analytical Loads", analyticReadiness: "ANA" },
		{
			categoryName: "Electrical Analytical Power Source",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Electrical Analytical Transformer",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Electrical Demand Factor Definitions",
			analyticReadiness: "LOW",
		},
		{
			categoryName: "Electrical Load Classification Parameter Element",
			analyticReadiness: "LOW",
		},
		{
			categoryName: "Electrical Load Classifications",
			analyticReadiness: "MLT",
		},
		{
			categoryName: "Electrical Spare/Space Circuits",
			analyticReadiness: "MLT",
		},
		{ categoryName: "Voltages", analyticReadiness: "MLT" },
	],
};

const annotateCategory: CategoryObj = {
	generalCategory: "Annotate & Graphics",
	categoryWithReadiness: [
		{ categoryName: "Callout Heads", analyticReadiness: "LOW" },
		{ categoryName: "Color Fill Legends", analyticReadiness: "LOW" },
		{ categoryName: "Color Fill Schema", analyticReadiness: "LOW" },
		{ categoryName: "Cut Marks", analyticReadiness: "LOW" },
		{ categoryName: "Cut Profile", analyticReadiness: "LOW" },
		{ categoryName: "Detail Groups", analyticReadiness: "LOW" },
		{ categoryName: "Detail Item Tags", analyticReadiness: "LOW" },
		{ categoryName: "Detail Items", analyticReadiness: "LOW" },
		{ categoryName: "Dimensions", analyticReadiness: "LOW" },
		{ categoryName: "Elevation Marks", analyticReadiness: "LOW" },
		{ categoryName: "Generic Annotations", analyticReadiness: "LOW" },
		{ categoryName: "Keynote Tags", analyticReadiness: "LOW" },
		{ categoryName: "Legend Components", analyticReadiness: "LOW" },
		{ categoryName: "Multi-Category Tags", analyticReadiness: "LOW" },
		{ categoryName: "Path of Travel Lines", analyticReadiness: "LOW" },
		{ categoryName: "Revision Cloud Tags", analyticReadiness: "LOW" },
		{ categoryName: "Revision Clouds", analyticReadiness: "LOW" },
		{ categoryName: "Revision Numbering Sequences", analyticReadiness: "LOW" },
		{ categoryName: "Section Marks", analyticReadiness: "LOW" },
		{ categoryName: "Span Direction Symbol", analyticReadiness: "LOW" },
		{ categoryName: "Spot Coordinates", analyticReadiness: "LOW" },
		{ categoryName: "Spot Elevation Symbols", analyticReadiness: "LOW" },
		{ categoryName: "Spot Elevations", analyticReadiness: "LOW" },
		{ categoryName: "Text Notes", analyticReadiness: "LOW" },
		{ categoryName: "Spot Slopes", analyticReadiness: "LOW" },
		{ categoryName: "Raster Images", analyticReadiness: "ANA" },
	],
};

const massingSiteCategory: CategoryObj = {
	generalCategory: "Massing, Site & Landscape",
	categoryWithReadiness: [
		{ categoryName: "Mass", analyticReadiness: "MLT" },
		{ categoryName: "Mass Floors", analyticReadiness: "QTY" },
		{ categoryName: "Mass Opening", analyticReadiness: "QTY" },
		{ categoryName: "Mass Roof", analyticReadiness: "QTY" },
		{ categoryName: "Mass Shade", analyticReadiness: "QTY" },
		{ categoryName: "Mass Walls", analyticReadiness: "QTY" },
		{ categoryName: "Mass Windows and Skylights", analyticReadiness: "QTY" },
		{ categoryName: "Site", analyticReadiness: "ANA" },
		{ categoryName: "Property Lines", analyticReadiness: "MLT" },
		{ categoryName: "Property Line Segments", analyticReadiness: "MLT" },
		{ categoryName: "Primary Contours", analyticReadiness: "MLT" },
		{ categoryName: "Shared Site", analyticReadiness: "LOW" },
		{ categoryName: "Survey Point", analyticReadiness: "MLT" },
		{ categoryName: "Toposolid", analyticReadiness: "ANA" },
		{ categoryName: "Hardscape", analyticReadiness: "ANA" },
		{ categoryName: "Parking", analyticReadiness: "ANA" },
		{ categoryName: "Planting", analyticReadiness: "ANA" },
	],
};

const modelElementsCategory: CategoryObj = {
	generalCategory: "Model Elements",
	categoryWithReadiness: [
		{ categoryName: "Model Groups", analyticReadiness: "MLT" },
		{ categoryName: "Generic Models", analyticReadiness: "MLT" },
		{ categoryName: "Entourage", analyticReadiness: "ANA" },
		{ categoryName: "Shaft Openings", analyticReadiness: "MLT" },
		{ categoryName: "Array", analyticReadiness: "LOW" },
		{ categoryName: "Adaptive Points", analyticReadiness: "GEO" },
		{ categoryName: "Analytical Surfaces", analyticReadiness: "ANA" },
		{ categoryName: "Work Plane Grid", analyticReadiness: "LOW" },
		{ categoryName: "Profiles", analyticReadiness: "MLT" },
		{ categoryName: "Lines", analyticReadiness: "ANA" },
		{ categoryName: "Constraints", analyticReadiness: "QTY" },
		{ categoryName: "Rectangular Arc Wall Opening", analyticReadiness: "ANA" },
		{
			categoryName: "Rectangular Straight Wall Opening",
			analyticReadiness: "ANA",
		},
		{ categoryName: "Floor opening cut", analyticReadiness: "ANA" },
		{ categoryName: "Structural opening cut", analyticReadiness: "ANA" },
	],
};

const viewCategory: CategoryObj = {
	generalCategory: "View",
	categoryWithReadiness: [
		{ categoryName: "Views", analyticReadiness: "ANA" },
		{ categoryName: "Viewports", analyticReadiness: "ANA" },
		{ categoryName: "View Reference", analyticReadiness: "ANA" },
		{ categoryName: "Section Boxes", analyticReadiness: "QTY" },
		{ categoryName: "Sections", analyticReadiness: "ANA" },
		{ categoryName: "Elevations", analyticReadiness: "ANA" },
		{ categoryName: "Plan Region", analyticReadiness: "ANA" },
		{ categoryName: "Cameras", analyticReadiness: "ANA" },
	],
};

const materialsCategory: CategoryObj = {
	generalCategory: "Materials",
	categoryWithReadiness: [
		{ categoryName: "Materials", analyticReadiness: "ANA" },
		{ categoryName: "Material Assets", analyticReadiness: "ANA" },
		{ categoryName: "<Insulation Batting Lines>", analyticReadiness: "MLT" },
	],
};

const wallAssemblyCategory: CategoryObj = {
	generalCategory: "Wall Assembly",
	categoryWithReadiness: [
		{ categoryName: "Substrate", analyticReadiness: "ANA" },
		{ categoryName: "Membrane", analyticReadiness: "ANA" },
		{ categoryName: "Finish1", analyticReadiness: "ANA" },
		{ categoryName: "Finish2", analyticReadiness: "ANA" },
		{ categoryName: "Insulation", analyticReadiness: "ANA" },
		{ categoryName: "Structure", analyticReadiness: "ANA" },
	],
};

const analyticalCategory: CategoryObj = {
	generalCategory: "Analytical",
	categoryWithReadiness: [
		{ categoryName: "Analytical Members", analyticReadiness: "GEO" },
		{ categoryName: "Analytical Nodes", analyticReadiness: "MLT" },
		{ categoryName: "Analytical Openings", analyticReadiness: "GEO" },
		{ categoryName: "Analytical Panels", analyticReadiness: "GEO" },
	],
};

const architectureTagsCategory: CategoryObj = {
	generalCategory: "Architecture Tags",
	categoryWithReadiness: [
		{ categoryName: "Area Tags", analyticReadiness: "QTY" },
		{ categoryName: "Ceiling Tags", analyticReadiness: "QTY" },
		{ categoryName: "Curtain Panel Tags", analyticReadiness: "QTY" },
		{ categoryName: "Door Tags", analyticReadiness: "QTY" },
		{ categoryName: "Floor Tags", analyticReadiness: "QTY" },
		{ categoryName: "Furniture Tags", analyticReadiness: "QTY" },
		{ categoryName: "Generic Model Tags", analyticReadiness: "QTY" },
		{ categoryName: "Parking Tags", analyticReadiness: "QTY" },
		{ categoryName: "Path of Travel Tags", analyticReadiness: "QTY" },
		{ categoryName: "Planting Tags", analyticReadiness: "QTY" },
		{ categoryName: "Property Line Segment Tags", analyticReadiness: "QTY" },
		{ categoryName: "Railing Tags", analyticReadiness: "QTY" },
		{ categoryName: "Roof Tags", analyticReadiness: "QTY" },
		{ categoryName: "Room Tags", analyticReadiness: "QTY" },
		{ categoryName: "Space Tags", analyticReadiness: "QTY" },
		{ categoryName: "Stair Tags", analyticReadiness: "QTY" },
		{ categoryName: "Wall Sweep Tags", analyticReadiness: "QTY" },
		{ categoryName: "Wall Tags", analyticReadiness: "QTY" },
		{ categoryName: "Window Tags", analyticReadiness: "QTY" },
		{ categoryName: "Material Tags", analyticReadiness: "QTY" },
	] as const,
};

const structureTagsCategory: CategoryObj = {
	generalCategory: "Structure Tags",
	categoryWithReadiness: [
		{ categoryName: "Area Based Load Tags", analyticReadiness: "LOW" },
		{ categoryName: "Structural Beam System Tags", analyticReadiness: "LOW" },
		{ categoryName: "Structural Column Tags", analyticReadiness: "LOW" },
		{ categoryName: "Structural Foundation Tags", analyticReadiness: "LOW" },
		{ categoryName: "Structural Framing Tags", analyticReadiness: "LOW" },
	],
};

const mepTagsCategory: CategoryObj = {
	generalCategory: "M&E Tags",
	categoryWithReadiness: [
		{ categoryName: "Conduit Tags", analyticReadiness: "QTY" },
		{ categoryName: "Duct Tags", analyticReadiness: "QTY" },
		{ categoryName: "Electrical Equipment Tags", analyticReadiness: "QTY" },
		{ categoryName: "Electrical Fixture Tags", analyticReadiness: "QTY" },
		{ categoryName: "Flex Duct Tags", analyticReadiness: "QTY" },
		{ categoryName: "Lighting Fixture Tags", analyticReadiness: "QTY" },
		{ categoryName: "Mechanical Equipment Tags", analyticReadiness: "QTY" },
		{ categoryName: "Pipe Tags", analyticReadiness: "QTY" },
		{ categoryName: "Plumbing Equipment Tags", analyticReadiness: "QTY" },
		{ categoryName: "Wire Tags", analyticReadiness: "QTY" },
	],
};

const sheetsSchedulesCategory: CategoryObj = {
	generalCategory: "Sheets and Schedules",
	categoryWithReadiness: [
		{ categoryName: "Sheets", analyticReadiness: "ANA" },
		{ categoryName: "Schedules", analyticReadiness: "QTY" },
		{ categoryName: "Schedule Graphics", analyticReadiness: "QTY" },
		{ categoryName: "Title Blocks", analyticReadiness: "QTY" },
		{ categoryName: "View Titles", analyticReadiness: "LOW" },
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

export function findCategoryGroup(categoryName: string): GenerailCategoryObj {
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
				analyticalReadiness: match.analyticReadiness,
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
