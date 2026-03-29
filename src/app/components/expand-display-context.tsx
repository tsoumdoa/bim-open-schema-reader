import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

export type ExpandDisplayCtx = {
	displayExpanded: number;
	setDisplayExpanded: (index: number) => void;
	handleScrollBack: () => void;
	queryItemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

const ExpandDisplayContext = createContext<ExpandDisplayCtx | null>(null);

export function ExpandDisplayProvider(props: { children: React.ReactNode }) {
	const [displayExpanded, setDisplayExpandedState] = useState(-1);
	const queryItemRefs = useRef<(HTMLDivElement | null)[]>([]);

	const setDisplayExpanded = useCallback((index: number) => {
		setDisplayExpandedState(index);
	}, []);

	useEffect(() => {
		const escListener = (e: KeyboardEvent) => {
			if (e.key === "Escape" && displayExpanded !== -1) {
				setDisplayExpandedState(-1);
			}
		};
		document.addEventListener("keydown", escListener);
		return () => {
			document.removeEventListener("keydown", escListener);
		};
	}, [displayExpanded]);

	useEffect(() => {
		if (displayExpanded === -1) {
			document.body.style.overflow = "";
		}
	}, [displayExpanded]);

	const handleScrollBack = useCallback(() => {
		if (displayExpanded !== -1 && queryItemRefs.current[displayExpanded]) {
			const headerOffset = 50;
			const elementPosition =
				queryItemRefs.current[displayExpanded].getBoundingClientRect().top +
				window.scrollY;
			const offsetPosition = elementPosition - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			document.body.style.overflow = "hidden";
		}
	}, [displayExpanded]);

	return (
		<ExpandDisplayContext.Provider
			value={{
				displayExpanded,
				setDisplayExpanded,
				handleScrollBack,
				queryItemRefs,
			}}
		>
			{props.children}
		</ExpandDisplayContext.Provider>
	);
}

export function useExpandDisplayCtx() {
	const ctx = useContext(ExpandDisplayContext);
	if (!ctx) {
		throw new Error(
			"useExpandDisplayCtx must be used within ExpandDisplayProvider"
		);
	}
	return ctx;
}
