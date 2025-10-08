import { useState } from "react";
import {
	analyticReadinessLevels,
	AnalyticsReadinessLevels,
} from "../utils/types";
export default function useFilterByDataReadiness() {
	const initialSet = new Set(analyticReadinessLevels);

	const [selected, setSelected] = useState(initialSet);

	const toggle = (value: AnalyticsReadinessLevels) => {
		const newSet = new Set(selected);
		if (newSet.has(value)) {
			newSet.delete(value);
		} else {
			newSet.add(value);
		}
		setSelected(newSet);
	};

	const isolate = (value: AnalyticsReadinessLevels) => {
		setSelected(new Set([value]));
	};

	const reset = () => {
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
		reset,
		isSelected,
		showReset,
	};
}
