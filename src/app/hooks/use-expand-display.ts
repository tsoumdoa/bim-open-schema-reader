import { useState, useEffect, useRef, useLayoutEffect } from "react";

export function useExpandDisplay() {
	const queryItemRefs = useRef<(HTMLDivElement | null)[]>([]);
	useEffect(() => {
		const escListener = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setDisplayExpanded(-1);
			}
		};
		document.addEventListener("keydown", escListener);

		return () => {
			document.removeEventListener("keydown", escListener);
		};
	}, []);

	const [displayExpanded, setDisplayExpanded] = useState(-1);
	const handleScrollBack = () => {
		if (displayExpanded !== -1 && queryItemRefs.current[displayExpanded]) {
			const headerOffset = 84; // height of fixed header + some offset in px
			const elementPosition =
				queryItemRefs.current[displayExpanded].getBoundingClientRect().top +
				window.scrollY;
			const offsetPosition = elementPosition - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	};
	useLayoutEffect(() => {
		handleScrollBack();
	}, [displayExpanded]);

	return {
		displayExpanded,
		setDisplayExpanded,
		handleScrollBack,
		queryItemRefs,
	};
}
