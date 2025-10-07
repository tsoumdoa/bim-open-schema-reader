import { Box, ChartBar, DiamondMinus, Hash, Logs } from "lucide-react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
	analyticReadinessLevels,
	analyticReadinessTitles,
} from "../utils/types";
import { useDataReadinessFilter } from "./use-data-readiness-filter";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Icons = [
	{
		icon: <Box className="h-3 w-3" />,
		title: analyticReadinessTitles[0],
		abb: analyticReadinessLevels[0],
	},
	{
		icon: <ChartBar className="h-3 w-3" />,
		title: analyticReadinessTitles[1],
		abb: analyticReadinessLevels[1],
	},
	{
		icon: <Logs className="h-3 w-3" />,
		title: analyticReadinessTitles[2],

		abb: analyticReadinessLevels[2],
	},
	{
		icon: <Hash className="h-3 w-3" />,
		title: analyticReadinessTitles[3],
		abb: analyticReadinessLevels[3],
	},
	{
		icon: <DiamondMinus className="h-3 w-3" />,
		title: analyticReadinessTitles[4],
		abb: analyticReadinessLevels[4],
	},
];

function DataReadinessHelpDialog(props: { children: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger>{props.children}</DialogTrigger>
			<DialogContent className="max-w-[500px] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>Data Readiness</DialogTitle>
					<DialogDescription className="">
						Data quality varies due to Revit API limits and our current
						exporter. Use these guidelines to evaluate data readiness for your
						specific use case.
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[30rem]">
					<section className="text-gray-900">
						<header className="flex items-center gap-1 text-base font-semibold">
							<Box className="h-3 w-3" />
							<h3>Geometric reconstruction ready - GEO</h3>
						</header>
						<div className="space-y-1 pl-0 text-sm">
							<p>
								Contains sufficient numeric attributes to approximate element
								geometry and derive basic shapes and dimensions, with minimal
								qualitative context to interpret those shapes.
							</p>
							<p className="text-gray-500">
								Examples: Grids, Levels, Columns, Beams, etc.
							</p>
						</div>
					</section>
					<Separator className="my-2" />

					<section className="text-gray-900">
						<header className="flex items-center gap-1 text-base font-semibold">
							<ChartBar className="h-3 w-3" />
							Analytics rich - ANA
						</header>
						<div className="space-y-1 pl-0 text-sm">
							<p>
								Contains enough quantitative attributes and meaningful
								categorical/contextual properties to support
								descriptive/diagnostic analytics modeling, even if geometric
								fidelity is lower than GEO.
							</p>
							<p className="text-gray-500">
								e.g. Hardscape, Parking, Planiting, Door, Materials etc
							</p>
						</div>
					</section>
					<Separator className="my-2" />

					<section className="text-gray-900">
						<header className="flex items-center gap-1 text-base font-semibold">
							<Logs className="h-3 w-3" />
							Metric light - MLT
						</header>
						<div className="space-y-1 pl-0 text-sm">
							<p>
								Contains more information than QTY (beyond simple counts) but
								clearly less than ANA. Has minimal numeric metrics for basic
								insight, and typically lacks the contextual/relational data
								needed for deeper analysis.
							</p>
							<p className="text-gray-500">
								e.g. Revisions include a revision number and basic info, but
								lack links to elements or phases, so you can’t query which
								elements were created or modified in each revision.
							</p>
						</div>
					</section>
					<Separator className="my-2" />

					<section className="text-gray-900">
						<header className="flex items-center gap-1 text-base font-semibold">
							<Hash className="h-3 w-3" />
							Quantities only - QTY
						</header>
						<div className="space-y-1 pl-0 text-sm">
							<p>
								Limited to counts or totals with minimal or no supporting
								metrics; useful only for checking quantities in Revit model
								without other useful data.
							</p>
							<p className="text-gray-500">
								e.g. Number of tags, counts of annotations, instance counts
								without dimensions or properties.
							</p>
						</div>
					</section>
					<Separator className="my-2" />

					<section className="text-gray-900">
						<header className="flex items-center gap-1 text-base font-semibold">
							<DiamondMinus className="h-3 w-3" />
							Low analytical value - LOW
						</header>
						<div className="space-y-1 pl-0 text-sm">
							<p>
								Data rarely used in general analytics workflows, typically
								context-specific or requiring specialized models/assumptions to
								be actionable.
							</p>
							<p className="text-gray-500">
								e.g. Structural load cases (without results), sun path settings,
								view-specific graphics overrides, which often do not contain
								useful data.
							</p>
						</div>
					</section>
				</ScrollArea>
				<footer className="text-xs text-gray-500">
					Note: Category assignments may shift as coverage improves. Please open
					an issue or pull request on GitHub if you spot gaps or
					misclassifications.
				</footer>
			</DialogContent>
		</Dialog>
	);
}

export default function FilterByDataReadiness() {
	const { toggle, resest, isSelected, showReset, isolate } =
		useDataReadinessFilter();

	return (
		<div className="py-1">
			<div className="animate flex flex-row items-center justify-items-center gap-1 pb-1 transition-all">
				<div className="text-xs font-medium hover:cursor-help">
					<DataReadinessHelpDialog>
						Filter by Data Readiness
					</DataReadinessHelpDialog>
				</div>
				<div
					className={`text-xs font-light transition-opacity hover:cursor-pointer ${showReset
							? "pointer-events-auto opacity-100"
							: "pointer-events-none opacity-0"
						}`}
					onClick={resest}
					aria-disabled={!showReset}
				>
					- Reset
				</div>
			</div>
			<div className="flex flex-row gap-2">
				{Icons.map((icon, index) => (
					<Tooltip delayDuration={500} key={`filter-icon-${index}`}>
						<TooltipTrigger
							onClick={() => toggle(icon.abb)}
							onDoubleClick={() => isolate(icon.abb)}
							className={`${!isSelected(icon.abb) && "opacity-15"} animate transition-all hover:cursor-pointer`}
						>
							{icon.icon}
						</TooltipTrigger>
						<TooltipContent>{icon.title}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</div>
	);
}
