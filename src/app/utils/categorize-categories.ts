import { CategoryObj, CategoryObjs, GeneralCategory } from "./types";

const projectSettingCategory: CategoryObj = {
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

const archCategory: CategoryObj = {
	generalCategory: "Architecture",
	categoryNames: [
		"<Stair/Ramp Sketch: Boundary>",
		"<Stair/Ramp Sketch: Landing Center>",
		"<Stair/Ramp Sketch: Riser>",
		"<Stair/Ramp Sketch: Run>",
		"<Stair/Ramp Sketch: Stair Path>",
		"<Path of Travel Lines>",
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
		"Wall Sweeps",
	],
};

const curtainWallSystemCategory: CategoryObj = {
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

const levelGridCategory: CategoryObj = {
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

const roomAreaCategory: CategoryObj = {
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
		"Space Type Settings",
		"Analytical Spaces",
	],
};

const structureCategory: CategoryObj = {
	generalCategory: "Structure",
	categoryNames: [
		"Bearings",
		"Cover Type",
		"Plates",
		"Point Loads",
		"Slab Edges",
		"Structural Columns",
		"Structural Connections",
		"Structural Foundations",
		"Structural Framing",
		"Structural Load Cases",
		"Structural Loads",
		"Structural Rebar",
		"Structural Trusses",
		"StructuralDeck",
		"Supports",
	],
};

const mepCategory: CategoryObj = {
	generalCategory: "M&E",
	categoryNames: [
		"Air Terminals",
		"Mechanical Equipment",
		"Plumbing Fixtures",
		"Plumbing Equipment",
		"Pipe Fittings",
		"Pipe Accessories",
		"Pipe Segments",
		"Pipes",
		"Piping Systems",
		"Valves",
		"Ducts",
		"Duct Fittings",
		"Duct Systems",
		"Flex Ducts",
		"Conduits",
		"Conduit Runs",
		"Conduit Fittings",
		"Electrical Fixtures",
		"Lighting Fixtures",
		"Lighting Devices",
		"Electrical Equipment",
		"Data Devices",
		"Distribution Systems",
		"Wires",
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

const annotateCategory: CategoryObj = {
	generalCategory: "Annotate",
	categoryNames: [
		"Callout Heads",
		"Color Fill Legends",
		"Color Fill Schema",
		"Cut Marks",
		"Cut Profile",
		"Detail Groups",
		"Detail Item Tags",
		"Detail Items",
		"Dimensions",
		"Elevation Marks",
		"Generic Annotations",
		"Keynote Tags",
		"Legend Components",
		"Material Tags",
		"Multi-Category Tags",
		"Path of Travel Lines",
		"Revision Cloud Tags",
		"Revision Clouds",
		"Revision Numbering Sequences",
		"Section Marks",
		"Span Direction Symbol",
		"Spot Coordinates",
		"Spot Elevation Symbols",
		"Spot Elevations",
		"Spot Slopes",
		"Text Notes",
		"View Titles",
	],
};

const massingSiteCategory: CategoryObj = {
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
		"Primary Contours",
		"Shared Site",
		"Survey Point",
		"Toposolid",
		"Hardscape",
		"Parking",
		"Planting",
	],
};

const modelElementsCategory: CategoryObj = {
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

const viewCategory: CategoryObj = {
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
		"Elevations",
		"Plan Region",
		"Raster Images",
		"Cameras",
		"Design Options",
		"Design Option Sets",
	],
};

const materialsCategory: CategoryObj = {
	generalCategory: "Materials",
	categoryNames: [
		"Materials",
		"Material Assets",
		"Material Tags",
		"<Insulation Batting Lines>",
	],
};

const wallAssemblyCategory: CategoryObj = {
	generalCategory: "Wall Assembly",
	categoryNames: [
		"Substrate",
		"Membrane",
		"Finish1",
		"Finish2",
		"Insulation",
		"Structure",
	],
};

const analyticalCategory: CategoryObj = {
	generalCategory: "Analytical",
	categoryNames: [
		"Analytical Members",
		"Analytical Nodes",
		"Analytical Openings",
		"Analytical Panels",
	],
};

const architectureTagsCategory: CategoryObj = {
	generalCategory: "Architecture Tags",
	categoryNames: [
		"Area Tags",
		"Ceiling Tags",
		"Curtain Panel Tags",
		"Door Tags",
		"Floor Tags",
		"Furniture Tags",
		"Generic Model Tags",
		"Parking Tags",
		"Path of Travel Tags",
		"Planting Tags",
		"Property Line Segment Tags",
		"Railing Tags",
		"Roof Tags",
		"Room Tags",
		"Space Tags",
		"Stair Tags",
		"Wall Sweep Tags",
		"Wall Tags",
		"Window Tags",
	],
};

const structureTagsCategory: CategoryObj = {
	generalCategory: "Structure Tags",
	categoryNames: [
		"Area Based Load Tags",
		"Structural Beam System Tags",
		"Structural Beam Systems",
		"Structural Column Tags",
		"Structural Foundation Tags",
		"Structural Framing Tags",
	],
};

const mepTagsCategory: CategoryObj = {
	generalCategory: "M&E Tags",
	categoryNames: [
		"Conduit Tags",
		"Duct Tags",
		"Electrical Equipment Tags",
		"Electrical Fixture Tags",
		"Flex Duct Tags",
		"Lighting Fixture Tags",
		"Mechanical Equipment Tags",
		"Pipe Tags",
		"Plumbing Equipment Tags",
		"Wire Tags",
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
