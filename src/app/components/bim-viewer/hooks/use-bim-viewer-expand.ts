"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useBimViewerExpand() {
	const [isExpanded, setIsExpanded] = useState(false);
	const focusTargetRef = useRef<HTMLDivElement | null>(null);

	const expand = useCallback(() => setIsExpanded(true), []);
	const collapse = useCallback(() => setIsExpanded(false), []);
	const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

	useEffect(() => {
		if (!isExpanded) return;
		focusTargetRef.current?.focus();
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isExpanded]);

	return { isExpanded, expand, collapse, toggleExpand, focusTargetRef };
}
