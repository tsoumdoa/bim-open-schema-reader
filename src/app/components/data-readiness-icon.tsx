import { AnalyticsReadinessLevels } from "../utils/types";
import { Box, ChartBar, DiamondMinus, Hash, Logs } from "lucide-react";

export default function DataReadinessIcon(props: {
	dataReadiness: AnalyticsReadinessLevels;
	useThin: boolean;
}) {
	if (props.dataReadiness === "GEO") {
		return <Box className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />;
	}
	if (props.dataReadiness === "ANA") {
		return <ChartBar className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />;
	}
	if (props.dataReadiness === "MLT") {
		return <Logs className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />;
	}
	if (props.dataReadiness === "QTY") {
		return <Hash className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />;
	}
	if (props.dataReadiness === "LOW") {
		return (
			<DiamondMinus className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />
		);
	}
	return (
		<DiamondMinus className="h-3 w-3" strokeWidth={props.useThin ? 1 : 2} />
	);
}
