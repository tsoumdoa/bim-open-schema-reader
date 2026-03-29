import { useExpandDisplayCtx } from "../components/expand-display-context";
import { useLayoutEffect } from "react";

export function useExpandDisplay() {
	const {
		displayExpanded,
		setDisplayExpanded,
		handleScrollBack,
		queryItemRefs,
	} = useExpandDisplayCtx();

	useLayoutEffect(() => {
		handleScrollBack();
	}, [displayExpanded, handleScrollBack]);

	return {
		displayExpanded,
		setDisplayExpanded,
		handleScrollBack,
		queryItemRefs,
	};
}
