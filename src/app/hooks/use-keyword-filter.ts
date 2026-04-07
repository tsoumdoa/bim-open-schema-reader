import { useCallback, useEffect, useRef, useState } from "react";

export function useKeywordFilter() {
	const [keyword, setKeyword] = useState("");
	const hasKeyword = keyword !== "";
	const inputRef = useRef<HTMLInputElement | null>(null);
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			e.stopPropagation();
			inputRef.current?.focus();
		}
	}, []);
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		inputRef.current?.focus();
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);
	return {
		keyword,
		setKeyword,
		hasKeyword,
		inputRef,
	};
}
