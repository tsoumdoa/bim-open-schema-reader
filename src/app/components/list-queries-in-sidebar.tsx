import { useQueryObjCtx } from "./query-obj-provider";

export default function ListQueriesInSidebar() {
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
		</div>
	);
}
