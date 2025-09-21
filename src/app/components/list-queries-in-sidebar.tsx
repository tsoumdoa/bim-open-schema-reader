import { UseExpandDisplay } from "../utils/types";
import { useQueryObjCtx } from "./query-obj-provider";

export default function ListQueriesInSidebar(props: {
	useExpandDisplay: UseExpandDisplay;
}) {
	const { useQueryObjects } = useQueryObjCtx();
	const queryObjs = useQueryObjects.queryObjects;

	const { setDisplayExpanded } = props.useExpandDisplay;
	const handleClick = (id: number) => {
		setDisplayExpanded(id);
	};

	const indexMap = new Map<string, number>();
	queryObjs.forEach((q, i) => {
		indexMap.set(q.id ?? "", i);
	});

	const availableCategories = new Set(queryObjs.map((q) => q.queryCategory));
	const sorted = Array.from(availableCategories).sort();

	return (
		<div>
			{sorted.map((category, i) => (
				<div key={`category-${i}`} className="pb-1">
					<div className="text-xs leading-tight font-bold">{category}</div>
					{queryObjs
						.filter((q) => q.queryCategory === category)
						.map((queryObject, i) => (
							<ul key={queryObject.id ?? `query-object-${i}`}>
								<li className="w-full truncate pl-2 text-sm leading-tight">
									<button
										type="button"
										className="text-xs hover:cursor-pointer hover:underline"
										onClick={() => {
											handleClick(indexMap.get(queryObject.id ?? "") ?? -1);
										}}
									>
										{queryObject.queryTitle}
									</button>
								</li>
							</ul>
						))}
				</div>
			))}
		</div>
	);
}
