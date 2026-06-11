import { useQueryObjects } from "../hooks/use-query-objects";
import { BosFileType, UseQueryObjects } from "../utils/types";
import { createContext, useContext } from "react";

const QueryObjCtx = createContext<UseQueryObjects | null>(null);

export default function QueryObjProvider(props: {
	children: React.ReactNode;
	bosFileType: BosFileType;
}) {
	const queryObjInstance = useQueryObjects(props.bosFileType);

	return (
		<QueryObjCtx.Provider value={queryObjInstance}>
			{props.children}
		</QueryObjCtx.Provider>
	);
}

export function useQueryObjCtx() {
	const ctx = useContext(QueryObjCtx);
	if (!ctx) {
		throw new Error("useQueryObjCtx must be used within a QueryObjProvider");
	}
	return ctx;
}
