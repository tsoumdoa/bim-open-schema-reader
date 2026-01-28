import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function GoBackToTop() {
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// check if user scrolled more than 1.5x viewport height
			if (window.scrollY > window.innerHeight * 0.8) {
				setShowScrollTop(true);
			} else {
				setShowScrollTop(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	if (showScrollTop) {
		return (
			<Button
				onClick={scrollToTop}
				className="fixed right-2 bottom-2"
				variant="outline"
			>
				↑ Top
			</Button>
		);
	}
}
