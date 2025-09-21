import { UseExpandDisplay, UseQueryObjects } from "../utils/types";

export default function ListQueriesInSidebar(props: {
	useQueryObjects: UseQueryObjects;
	useExpandDisplay: UseExpandDisplay;
}) {
	const queryObjs = props.useQueryObjects.queryObjects;
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
								<li className="pl-2 text-sm leading-tight">
									<button
										type="button"
										className="hover:cursor-pointer hover:underline"
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
