import { Box, ChartBar, DiamondMinus, Hash, Logs } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	analyticReadinessLevels,
	analyticReadinessTitles,
} from "../utils/types";
import { useDataReadinessFilter } from "./use-data-readiness-filter";
import DataReadinessHelpDialog from "./data-readiness-help-dialog";

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

export default function FilterByDataReadiness() {
	const { toggle, reset, isSelected, showReset, isolateToggle } =
		useDataReadinessFilter();

	return (
		<div className="py-1">
			<div className="animate flex flex-row items-center justify-items-center gap-1 pb-1 transition-all">
				<DataReadinessHelpDialog>
					Filter by Data Readiness
				</DataReadinessHelpDialog>
				<div
					className={`text-xs font-light transition-opacity hover:cursor-pointer ${showReset
							? "pointer-events-auto opacity-100"
							: "pointer-events-none opacity-0"
						}`}
					onClick={reset}
					aria-disabled={!showReset}
				>
					- Reset
				</div>
			</div>
			<div className="flex flex-row gap-2">
				{Icons.map((icon, index) => (
					<Tooltip delayDuration={500} key={`filter-icon-${index}`}>
						<TooltipTrigger
							onClick={(e) => {
								if (e.shiftKey) {
									isolateToggle(icon.abb);
								} else {
									toggle(icon.abb);
								}
							}}
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
