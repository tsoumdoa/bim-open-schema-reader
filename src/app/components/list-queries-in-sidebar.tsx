import { useQueryObjCtx } from "./query-obj-provider";

export default function ListQueriesInSidebar() {
	const { useQueryObjects } = useQueryObjCtx();
	const queryObjs = useQueryObjects.queryObjects;

	return (
		<div>
			{queryObjs.map((queryObject, i) => (
				<ul key={queryObject.id ?? `query-object-${i}`}>
					<li className="w-full truncate pl-2 text-sm leading-tight">
						<span className="text-xs font-bold">Q{i + 1} </span>
						<span className="text-xs">{queryObject.queryTitle}</span>
					</li>
				</ul>
			))}
		</div>
	);
}
