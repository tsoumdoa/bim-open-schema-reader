import { CategoryObj, CategoryObjs, GeneralCategory } from "./types";

export const projectSettingCategory: CategoryObj = {
	generalCategory: "Project Setting",
	categoryNames: [
		"Design Option Sets",
		"Design Options",
		"Internal Origin",
		"Location Data",
		"Phases",
		"Project Information",
		"Revision",
		"Project Base Point",
		"Survey Point",
		"__DOCUMENT__",
	],
};

export const archCategory: CategoryObj = {
	generalCategory: "Architecture",
	categoryNames: [
		"<Stair/Ramp Sketch: Boundary>",
		"<Stair/Ramp Sketch: Landing Center>",
		"<Stair/Ramp Sketch: Riser>",
		"<Stair/Ramp Sketch: Run>",
		"<Stair/Ramp Sketch: Stair Path>",
		"Balusters",
		"Casework",
		"Ceilings",
		"Columns",
		"Doors",
		"Fascias",
		"Floors",
		"Furniture Systems",
		"Furniture",
		"Gutters",
		"Handrails",
		"Landings",
		"Railings",
		"Ramps",
		"Roofs",
		"Runs",
		"Specialty Equipment",
		"Stair Paths",
		"Stairs",
		"Top Rails",
		"Vertical Circulation",
		"Walls",
		"Windows",
	],
};

export const curtainWallSystemCategory: CategoryObj = {
	generalCategory: "Curtain Wall System",
	categoryNames: [
		"Curtain Panels",
		"Curtain Roof Grids",
		"Curtain System Grid Layout",
		"Curtain Systems",
		"Curtain Wall Grids",
		"Curtain Wall Mullions",
	],
};

export const levelGridCategory: CategoryObj = {
	generalCategory: "Level & Grid",
	categoryNames: [
		"Center Line",
		"Grid Heads",
		"Grids",
		"Guide Grid",
		"Level Heads",
		"Levels",
		"Reference Planes",
		"Scope Boxes",
		"Scope Boxes",
	],
};

export const roomAreaCategory: CategoryObj = {
	generalCategory: "Room & Area",
	categoryNames: [
		"<Area Based Load Boundary>",
		"<Area Boundary>",
		"<Room Separation>",
		"<Space Separation>",
		"Rooms",
		"Areas",
		"Area Schemes",
		"Space Separation",
		"Spaces",
		"Space Tags",
		"Space Type Settings",
		"Analytical Spaces",
	],
};

export const structureCategory: CategoryObj = {
	generalCategory: "Structure",
	categoryNames: [
		"Bearings",
		"Cover Type",
		"Plates",
		"Point Loads",
		"Slab Edges",
		"Structural Beam System Tags",
		"Structural Beam Systems",
		"Structural Column Tags",
		"Structural Columns",
		"Structural Connections",
		"Structural Foundation Tags",
		"Structural Foundations",
		"Structural Framing Tags",
		"Structural Framing",
		"Structural Load Cases",
		"Structural Loads",
		"Structural Rebar",
		"Structural Trusses",
		"StructuralDeck",
		"Structure",
		"Supports",
	],
};

export const mepCategory: CategoryObj = {
	generalCategory: "M&E",
	categoryNames: [
		"Air Terminals",
		"Mechanical Equipment",
		"Mechanical Equipment Tags",
		"Plumbing Fixtures",
		"Plumbing Equipment",
		"Plumbing Equipment Tags",
		"Pipe Fittings",
		"Pipe Accessories",
		"Pipe Segments",
		"Pipes",
		"Pipe Tags",
		"Piping Systems",
		"Valves",
		"Ducts",
		"Duct Tags",
		"Duct Fittings",
		"Duct Systems",
		"Flex Ducts",
		"Flex Duct Tags",
		"Conduits",
		"Conduit Runs",
		"Conduit Tags",
		"Conduit Fittings",
		"Electrical Fixtures",
		"Electrical Fixture Tags",
		"Lighting Fixtures",
		"Lighting Fixture Tags",
		"Lighting Devices",
		"Electrical Equipment",
		"Electrical Equipment Tags",
		"Data Devices",
		"Distribution Systems",
		"Wires",
		"Wire Tags",
		"Wire Materials",
		"Wire Insulations",
		"Electrical Circuits",
		"Electrical Load Areas",
		"HVAC Zones",
		"HVAC Load Schedules",
		"Electrical Analytical Bus",
		"Electrical Analytical Loads",
		"Electrical Analytical Power Source",
		"Electrical Analytical Transformer",
		"Electrical Demand Factor Definitions",
		"Electrical Load Classification Parameter Element",
		"Electrical Load Classifications",
		"Electrical Spare/Space Circuits",
		"Voltages",
	],
};

export const annotateCategory: CategoryObj = {
	generalCategory: "Annotate",
	categoryNames: [
		"Room Tags",
		"Area Tags",
		"Area Based Load Tags",
		"Callout Heads",
		"Color Fill Legends",
		"Color Fill Schema",
		"Cut Marks",
		"Cut Profile",
		"Detail Groups",
		"Detail Item Tags",
		"Detail Items",
		"Dimensions",
		"Door Tags",
		"Elevation Marks",
		"Generic Annotations",
		"Keynote Tags",
		"Legend Components",
		"Material Tags",
		"Multi-Category Tags",
		"Parking Tags",
		"Path of Travel Lines",
		"Path of Travel Tags",
		"Planting Tags",
		"Revision Cloud Tags",
		"Revision Clouds",
		"Revision Numbering Sequences",
		"Room Tags",
		"Section Marks",
		"Span Direction Symbol",
		"Spot Coordinates",
		"Spot Elevation Symbols",
		"Spot Elevations",
		"Spot Slopes",
		"Text Notes",
		"View Titles",
		"Wall Tags",
		"Window Tags",
		"Roof Tags",
		"Stair Tags",
		"Railing Tags",
		"Curtain Panel Tags",
		"Ceiling Tags",
		"Furniture Tags",
		"Generic Model Tags",
		"Wall Sweep Tags",
		"Floor Tags",
	],
};

export const massingSiteCategory: CategoryObj = {
	generalCategory: "Massing, Site & Landscape",
	categoryNames: [
		"Mass",
		"Mass Floors",
		"Mass Opening",
		"Mass Roof",
		"Mass Shade",
		"Mass Walls",
		"Mass Windows and Skylights",
		"Site",
		"Property Lines",
		"Property Line Segments",
		"Property Line Segment Tags",
		"Primary Contours",
		"Shared Site",
		"Survey Point",
		"Toposolid",
		"Hardscape",
		"Parking",
		"Planting",
	],
};

export const modelElementsCategory: CategoryObj = {
	generalCategory: "Model Elements",
	categoryNames: [
		"Model Groups",
		"Generic Models",
		"Entourage",
		"Shaft Openings",
		"Array",
		"Adaptive Points",
		"Analytical Surfaces",
		"Work Plane Grid",
		"Profiles",
		"Lines",
		"Constraints",
		"Rectangular Arc Wall Opening",
		"Rectangular Straight Wall Opening",
		"Floor opening cut",
		"Structural opening cut",
	],
};

export const viewCategory: CategoryObj = {
	generalCategory: "View",
	categoryNames: [
		"Views",
		"Viewports",
		"View Reference",
		"Sheets",
		"Schedules",
		"Schedule Graphics",
		"Section Boxes",
		"Sections",
		"Section Marks",
		"Elevations",
		"Elevation Marks",
		"Plan Region",
		"Raster Images",
		"Cameras",
		"Design Options",
		"Design Option Sets",
	],
};

export const materialsCategory: CategoryObj = {
	generalCategory: "Materials",
	categoryNames: [
		"Materials",
		"Material Assets",
		"Material Tags",
		"<Insulation Batting Lines>",
	],
};

export const wallAssemblyCategory: CategoryObj = {
	generalCategory: "Wall Assembly",
	categoryNames: ["Substrate", "Membrane", "Finish1", "Finish2", "Insulation"],
};

export const analyticalCategory: CategoryObj = {
	generalCategory: "Analytical",
	categoryNames: [
		"Analytical Members",
		"Analytical Nodes",
		"Analytical Openings",
		"Analytical Panels",
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
	// miscCategory, // don't include Misc as whatever are not here should be in Misc
];

export function findCategoryGroup(categoryName: string): GeneralCategory {
	if (categoryName === "RVT Links") {
		return "RVT & CAD Links";
	}

	for (const group of categoriesCategory) {
		if (group.categoryNames.includes(categoryName)) {
			return group.generalCategory;
		}
	}

	if (/\.(dwg)(\s*[\(\[].*[\)\]])?$/i.test(categoryName)) {
		return "RVT & CAD Links";
	}
	return "Misc"; // nothing found
}
