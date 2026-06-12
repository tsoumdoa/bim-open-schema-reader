"use client";

import { useEffect, RefObject } from "react";

export function useEscapeKey(
	containerRef: RefObject<HTMLDivElement | null>,
	highlightedEntityIndices: Set<number>,
	clearHighlight: () => void,
	isExpanded: boolean,
	onCollapse: () => void
) {
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key !== "Escape") return;

			if (highlightedEntityIndices.size > 0) {
				e.preventDefault();
				clearHighlight();
				return;
			}

			if (isExpanded) {
				e.preventDefault();
				onCollapse();
			}
		}
		el.addEventListener("keydown", onKeyDown);
		return () => el.removeEventListener("keydown", onKeyDown);
	}, [
		containerRef,
		highlightedEntityIndices.size,
		clearHighlight,
		isExpanded,
		onCollapse,
	]);
}
