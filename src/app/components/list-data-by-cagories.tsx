import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { useDuckDb } from "./use-db";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { denormParamQueryBuilderName } from "../utils/queries-selector-list";
import { Separator } from "@/components/ui/separator";
import { useQueryObjCtx } from "./query-obj-provider";
import { denormParamQueryBuilder } from "../utils/denorm-param-query-builder";
import {
	DenormTableName,
	generalCategory,
	UseExpandDisplay,
} from "../utils/types";
import { useState } from "react";
import { findCategoryGroup } from "../utils/categorize-categories";

function DropDownMenu(props: {
	categoryName: string;
	useExpandDisplay: UseExpandDisplay;
	setFocused: (focused: string) => void;
	indexKey: string;
}) {
	const { useQueryObjects } = useQueryObjCtx();
	const { addQueries, addQuery } = useQueryObjects;

	const handleClick = (
		tableName: DenormTableName,
		usePivot: boolean = false
	) => {
		const queryObj = denormParamQueryBuilder(
			tableName,
			props.categoryName,
			usePivot
		);
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
					props.setFocused(props.indexKey);
				} else {
					props.setFocused("");
				}
			}}
		>
			<DropdownMenuTrigger asChild>
				<span className="w-fit hover:cursor-pointer">
					{props.categoryName || "<undefined>"}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				{denormParamQueryBuilderName.map((item, index) =>
					item.hasPivot ? (
						<DropdownMenuSub key={`query-builder-dropdown-item-${index}`}>
							<DropdownMenuSubTrigger className="text-xs">
								{item.displayName}
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-fit">
								<DropdownMenuItem
									className="w-fit text-xs font-medium hover:cursor-pointer"
									onClick={() => handleClick(item.tableName)}
								>
									Flatten
								</DropdownMenuItem>
								<DropdownMenuItem
									className="w-fit text-xs font-medium hover:cursor-pointer"
									onClick={() => handleClick(item.tableName, true)}
								>
									Pivot
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					) : (
						<DropdownMenuItem
							key={`item-${index}`}
							className="text-xs hover:cursor-pointer"
							onClick={() => handleClick(item.tableName)}
						>
							{item.displayName}
						</DropdownMenuItem>
					)
				)}
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
	const [focused, setFocused] = useState("");

	const categoryGorupMap = new Map<string, [string, number][]>();

	for (const row of rows) {
		const categoryName = findCategoryGroup(row[0] as string);
		if (!categoryGorupMap.has(categoryName)) {
			categoryGorupMap.set(categoryName, []);
		}
		categoryGorupMap
			.get(categoryName)
			?.push([row[0] as string, row[1] as number]);
	}

	return (
		<div className="flex flex-col text-xs">
			<div className="overflow-x-auto">
				{generalCategory.map((categoryName, categoryIndex) => {
					if (categoryGorupMap.get(categoryName)?.length || 0 > 0) {
						return (
							<div key={`category-${categoryIndex}`}>
								<div
									className={`text-sm font-bold ${focused !== "" && focused.split("-")[0] !== `${categoryIndex}` && "opacity-20"} `}
								>
									{categoryName}
								</div>
								<table className="w-full table-auto">
									<thead
										className={`${focused !== "" && focused.split("-")[0] !== `${categoryIndex}` && "opacity-20"}`}
									>
										<tr className="tracking-tight text-neutral-800">
											<th className="text-left">Name</th>
											<th className="text-right">Count</th>
										</tr>
									</thead>
									<tbody>
										{categoryGorupMap
											.get(categoryName)
											?.map((row, groupIndex) => (
												<tr
													key={`category-count-${groupIndex}`}
													className={`transition-all hover:bg-neutral-200 ${focused !== "" && focused !== `${categoryIndex}-${groupIndex}` && "opacity-20"} `}
												>
													<td className="px-1 text-left tracking-tight">
														<DropDownMenu
															categoryName={(row[0] as string) || ""}
															useExpandDisplay={props.useExpandDisplay}
															setFocused={setFocused}
															indexKey={`${categoryIndex}-${groupIndex}`}
														/>
													</td>
													<td className="pr-1 text-right">
														{row[1].toLocaleString()}
													</td>
												</tr>
											))}
									</tbody>
								</table>
								<Separator className="my-2" />
							</div>
						);
					}
				})}
			</div>
		</div>
	);
}
