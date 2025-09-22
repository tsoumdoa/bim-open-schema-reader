import { CategoryObj, CategoryObjs, GeneralCategory } from "./types";

// ================== Architecture ==================
export const archCategory: CategoryObj = {
	generalCategory: "Architecture",
	categoryNames: [
		"Walls",
		"Doors",
		"Windows",
		"Floors",
		"Roofs",
		"Ceilings",
		"Casework",
		"Furniture",
		"Curtain Panels",
		"Curtain Wall Grids",
		"Curtain Wall Mullions",
		"Railings",
		"Top Rails",
		"Handrails",
		"Balusters",
		"Stairs",
		"Stair Paths",
		"Ramps",
		"Vertical Circulation",
		"Specialty Equipment",
		"<Stair/Ramp Sketch: Boundary>",
		"<Stair/Ramp Sketch: Landing Center>",
		"<Stair/Ramp Sketch: Riser>",
		"<Stair/Ramp Sketch: Run>",
		"<Stair/Ramp Sketch: Stair Path>",
	],
};

// ================== Level & Grid ==================
export const levelGridCategory: CategoryObj = {
	generalCategory: "Level & Grid",
	categoryNames: [
		"Levels",
		"Level Heads",
		"Grids",
		"Grid Heads",
		"Center Line",
		"Reference Planes",
		"Scope Boxes",
		"Guide Grid",
	],
};

// ================== Room & Area ==================
export const roomAreaCategory: CategoryObj = {
	generalCategory: "Room & Area",
	categoryNames: [
		"<Area Based Load Boundary>",
		"<Area Boundary>",
		"Rooms",
		"Room Tags",
		"Areas",
		"Area Tags",
		"Area Schemes",
		"Area Based Load Tags",
		"Space Separation",
		"Spaces",
		"Space Tags",
		"Space Type Settings",
		"Analytical Spaces",
	],
};

// ================== Structure ==================
export const structureCategory: CategoryObj = {
	generalCategory: "Structure",
	categoryNames: [
		"Structural Columns",
		"Structural Column Tags",
		"Structural Foundations",
		"Structural Foundation Tags",
		"Structural Connections",
		"Structural Framing",
		"Structural Framing Tags",
		"Structural Beam Systems",
		"Structural Beam System Tags",
		"Structural Rebar",
		"Structural Load Cases",
		"Slab Edges",
		"Supports",
		"Structure",
		"StructuralDeck",
	],
};

// ================== M&E ==================
export const meCategory: CategoryObj = {
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
	],
};

// ================== Annotate ==================
export const annotateCategory: CategoryObj = {
	generalCategory: "Annotate",
	categoryNames: [
		"Dimensions",
		"Text Notes",
		"Generic Annotations",
		"Detail Items",
		"Detail Item Tags",
		"Detail Groups",
		"Color Fill Legends",
		"Color Fill Schema",
		"Legend Components",
		"Path of Travel Lines",
		"Path of Travel Tags",
		"Room Tags",
		"Door Tags",
		"Window Tags",
		"Wall Tags",
		"Material Tags",
		"Multi-Category Tags",
		"Revision Clouds",
		"Revision Cloud Tags",
		"Revision Numbering Sequences",
		"View Titles",
		"Callout Heads",
		"Elevation Marks",
		"Section Marks",
		"Cut Marks",
		"Cut Profile",
		"Keynote Tags",
		"Spot Coordinates",
		"Spot Elevations",
		"Spot Elevation Symbols",
		"Spot Slopes",
		"Span Direction Symbol",
	],
};

// ================== Massing & Site ==================
export const massingSiteCategory: CategoryObj = {
	generalCategory: "Massing & Site",
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
		"Project Base Point",
		"Parking",
		"Parking Tags",
		"Planting",
		"Planting Tags",
		"Hardscape",
		"Toposolid",
	],
};

// ================== View ==================
export const viewCategory: CategoryObj = {
	generalCategory: "View",
	categoryNames: [
		"Views",
		"Viewports",
		"View Reference",
		"Sheets",
		"Schedules",
		"Schedule Graphics",
		"Panel Schedule Graphics",
		"Panel Schedule Templates - Branch Panel",
		"Panel Schedule Templates - Data Panel",
		"Panel Schedule Templates - Switchboard",
		"Section Boxes",
		"Sections",
		"Section Marks",
		"Elevations",
		"Elevation Marks",
		"Plan Region",
		"Raster Images",
		"Cameras",
		"Scope Boxes",
		"Design Options",
		"Design Option Sets",
		"Sun Path",
		"Model Groups",
	],
};

// ================== Materials ==================
export const materialsCategory: CategoryObj = {
	generalCategory: "Materials",
	categoryNames: [
		"Materials",
		"Material Assets",
		"Material Tags",
		"Cover Type",
		"Profiles",
		"Substrate",
		"Membrane",
		"Finish1",
		"Finish2",
		"Insulation",
		"<Insulation Batting Lines>",
	],
};

// ================== Collect All ==================
export const categoriesCategory: CategoryObjs = [
	archCategory,
	levelGridCategory,
	roomAreaCategory,
	structureCategory,
	meCategory,
	annotateCategory,
	massingSiteCategory,
	viewCategory,
	materialsCategory,
	// miscCategory, // don't include Misc as whatever are not here should be in Misc
];

export function findCategoryGroup(categoryName: string): GeneralCategory {
	for (const group of categoriesCategory) {
		if (group.categoryNames.includes(categoryName)) {
			return group.generalCategory;
		}
	}
	return "Misc"; // nothing found
}
