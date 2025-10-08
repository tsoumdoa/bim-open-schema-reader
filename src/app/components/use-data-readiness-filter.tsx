import { createContext, useContext } from "react";
import { UseFilterByDataReadiness } from "../utils/types";
import useFilterByDataReadiness from "../hooks/use-filter-by-data-readiness";

const DataReadinessFilterContext =
	createContext<UseFilterByDataReadiness | null>(null);

export function DataReadinessFilterProvider(props: {
	children: React.ReactNode;
}) {
	const useFilterHook = useFilterByDataReadiness();
	return (
		<DataReadinessFilterContext.Provider value={useFilterHook}>
			{props.children}
		</DataReadinessFilterContext.Provider>
	);
}

export function useDataReadinessFilter() {
	const ctx = useContext(DataReadinessFilterContext);
	if (!ctx) {
		throw new Error("useDb must be used within a DataReadinessFilterProvider");
	}
	return ctx;
}
