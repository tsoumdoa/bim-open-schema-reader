import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseKeywordFilter } from "../utils/types";

export default function KeywordFilter(props: {
	useKeywordFilter: UseKeywordFilter;
}) {
	const { keyword, setKeyword, hasKeyword, inputRef } = props.useKeywordFilter;
	return (
		<div className="relative">
			<Input
				ref={inputRef}
				type="search"
				placeholder="Keyword"
				className="h-6"
				value={keyword ?? ""}
				onChange={(e) => setKeyword(e.target.value)}
			/>
			{hasKeyword && (
				<button
					className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2"
					onClick={() => {
						setKeyword("");
					}}
				>
					<div className="absolute inset-0 rounded-full bg-black/80" />
					<X
						className="absolute inset-0 m-auto h-3 w-3 text-white"
						strokeWidth={3}
					/>
				</button>
			)}
		</div>
	);
}
