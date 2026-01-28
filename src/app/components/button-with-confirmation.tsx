import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ButtonWithConfirmation(props: {
	children: React.ReactNode;
	action?: () => void;
}) {
	const [clicked, setClicked] = useState(false);
	const handleClick = () => {
		if (clicked) {
			props.action?.();
			setClicked(false);
			return;
		}
		setClicked(true);
		setTimeout(() => {
			setClicked(false);
		}, 3000);
	};

	return (
		<Button
			variant="outline"
			className={`w-fit transition-all  ${clicked ? "hover:text-orange-600 text-orange-600 " : ""}`}
			onClick={() => {
				handleClick();
			}}
		>
			{clicked ? "Confirm" : props.children}
		</Button>
	);
}
