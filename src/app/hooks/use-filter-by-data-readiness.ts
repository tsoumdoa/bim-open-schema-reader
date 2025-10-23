import {
  analyticReadinessLevels,
  AnalyticsReadinessLevels,
} from "../utils/types";
import { useState } from "react";

export default function useFilterByDataReadiness() {
  const initialSet = new Set(analyticReadinessLevels);

  const [selected, setSelected] = useState(initialSet);
  const allSelected = selected.size === analyticReadinessLevels.length;
  const showReset = selected.size !== analyticReadinessLevels.length;

  const toggle = (value: AnalyticsReadinessLevels) => {
    if (allSelected) {
      setSelected(new Set([value]));
    } else {
      const newSet = new Set(selected);
      newSet.has(value) ? newSet.delete(value) : newSet.add(value);
      setSelected(newSet);
    }
  };

  const isolateToggle = (value: AnalyticsReadinessLevels) => {
    const newSet = new Set(selected);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelected(newSet);
  };

  const reset = () => {
    setSelected(new Set(analyticReadinessLevels));
  };

  const isSelected = (value: AnalyticsReadinessLevels) => {
    return selected.has(value);
  };

  return {
    allSelected,
    selected,
    isolateToggle,
    toggle,
    reset,
    isSelected,
    showReset,
  };
}
