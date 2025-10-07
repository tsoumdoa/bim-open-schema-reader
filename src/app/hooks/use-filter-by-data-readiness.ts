import { useState } from "react";
import {
	analyticReadinessLevels,
	AnalyticsReadinessLevels,
} from "../utils/types";
export default function useFilterByDataReadiness() {
	const initialSet = new Set(analyticReadinessLevels);

	const [selected, setSelected] = useState(initialSet);

	const toggle = (value: AnalyticsReadinessLevels) => {
		if (selected.has(value)) {
			selected.delete(value);
		} else {
			selected.add(value);
		}
		setSelected(new Set(selected));
	};

	const isolate = (value: AnalyticsReadinessLevels) => {
		setSelected(new Set([value]));
	};

	const resest = () => {
		setSelected(new Set(analyticReadinessLevels));
	};

	const isSelected = (value: AnalyticsReadinessLevels) => {
		return selected.has(value);
	};

	const showReset = selected.size !== analyticReadinessLevels.length;
	return {
		selected,
		isolate,
		toggle,
		resest,
		isSelected,
		showReset,
	};
}
