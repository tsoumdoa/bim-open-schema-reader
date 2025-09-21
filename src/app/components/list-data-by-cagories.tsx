import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { useDuckDb } from "./use-db";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { denormParamQueryBuilderName } from "../utils/queries-selector-list";
import { Separator } from "@/components/ui/separator";
import { useQueryObjCtx } from "./query-obj-provider";
import { denormParamQueryBuilder } from "../utils/denorm-param-query-builder";
import { DenormTableName, UseExpandDisplay } from "../utils/types";
import { useEffect, useState } from "react";

function DropDownMenu(props: {
	categoryName: string;
	useExpandDisplay: UseExpandDisplay;
	setFocused: (focused: number) => void;
	index: number;
}) {
	const { useQueryObjects } = useQueryObjCtx();
	const { setDisplayExpanded } = props.useExpandDisplay;
	const { addQueries, addQuery, queryObjects } = useQueryObjects;

	useEffect(() => {
		setDisplayExpanded(-1);
		requestAnimationFrame(() => {
			window.scrollTo({
				top: document.documentElement.scrollHeight + 600,
				behavior: "smooth",
			});
		});
	}, [queryObjects]);

	const handleClick = (tableName: DenormTableName) => {
		const queryObj = denormParamQueryBuilder(tableName, props.categoryName);
		addQuery(queryObj);
	};

	const addAll = () => {
		const q = denormParamQueryBuilderName.map((item) => {
			return denormParamQueryBuilder(item.tableName, props.categoryName);
		});
		addQueries(q);
	};

	return (
		<DropdownMenu
			onOpenChange={(open) => {
				if (open) {
					props.setFocused(props.index);
				} else {
					props.setFocused(-1);
				}
			}}
		>
			<DropdownMenuTrigger asChild>
				<span className="w-fit hover:cursor-pointer">
					{props.categoryName || "undefined"}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				{denormParamQueryBuilderName.map((item, index) => (
					<DropdownMenuItem
						key={`item-${index}`}
						className="text-xs"
						onClick={() => handleClick(item.tableName)}
					>
						{item.displayName}
					</DropdownMenuItem>
				))}
				<Separator className="" />
				<DropdownMenuItem
					className="text-xs font-bold"
					onClick={() => addAll()}
				>
					All
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function ListDataByCategories(props: {
	useExpandDisplay: UseExpandDisplay;
}) {
	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const [focused, setFocused] = useState(-1);
	useEffect(() => {
		console.log(focused);
	}, [focused]);

	return (
		<div className="flex flex-col text-xs">
			<div className="overflow-x-auto">
				<table className="w-full table-auto">
					<thead>
						<tr className="tracking-tight">
							<th className="text-left">Name</th>
							<th className="text-left">Count</th>
						</tr>
					</thead>
					<tbody>
						{rows &&
							rows.map((row, index) => (
								<tr
									key={`category-count-${index}`}
									className={`transition-all hover:bg-neutral-200 ${focused !== -1 && focused !== index && "opacity-20"} `}
								>
									<td className="px-1 text-left tracking-tight">
										<DropDownMenu
											categoryName={(row[0] as string) || ""}
											useExpandDisplay={props.useExpandDisplay}
											setFocused={setFocused}
											index={index}
										/>
									</td>
									<td className="pr-1 text-right">{row[1].toLocaleString()}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
