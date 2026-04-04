import { useQueryObjCtx } from "./query-obj-provider";

export default function ListQueriesInSidebar(props: {
	deleteAll: () => void;
	objLength: number;
}) {
	const { queryObjects, selectedQueryId, setSelectedQueryId } =
		useQueryObjCtx();

	return (
		<div>
			{queryObjects.map((queryObject, i) => {
				const isSelected = selectedQueryId === queryObject.id;
				return (
					<button
						key={queryObject.id ?? `query-object-${i}`}
						onClick={() => setSelectedQueryId(queryObject.id ?? null)}
						className="w-full truncate pl-2 text-sm leading-tight text-left"
					>
						<span className={`text-xs ${isSelected ? "font-bold" : ""}`}>
							Q{i + 1}{" "}
						</span>
						<span className={`text-xs ${isSelected ? "font-bold" : ""}`}>
							{queryObject.queryTitle}
						</span>
					</button>
				);
			})}
			{props.objLength > 2 && (
				<button
					onClick={props.deleteAll}
					className="mt-1 w-full pl-2  font-semibold text-left text-xs text-zinc-400 hover:text-red-400 transition-colors duration-150"
				>
					Delete All
				</button>
			)}
		</div>
	);
}
