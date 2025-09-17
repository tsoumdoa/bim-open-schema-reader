import { UseExpandDisplay, UseQueryObjects } from "../utils/types";

export default function ListQueriesInSidebar(props: {
	useQueryObjects: UseQueryObjects;
	useExpandDisplay: UseExpandDisplay;
}) {
	const queryObjs = props.useQueryObjects.queryObjects;
	const { handleScrollBack, setDisplayExpanded } = props.useExpandDisplay;
	const handleClick = (id: number) => {
		setDisplayExpanded(id);
		handleScrollBack();
	};
	return (
		<div>
			{queryObjs.map((queryObject, i) => (
				<ul key={`query-object-${i}`}>
					<li
						className="pl-2 text-sm leading-tight"
						onClick={() => {
							handleClick(i);
						}}
					>
						<p className="hover:cursor-pointer hover:underline">
							{queryObject.queryTitle}
						</p>
					</li>
				</ul>
			))}
		</div>
	);
}
