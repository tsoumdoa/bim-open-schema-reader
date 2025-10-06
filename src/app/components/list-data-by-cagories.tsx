import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { useDuckDb } from "./use-db";
import { Separator } from "@/components/ui/separator";
import { generalCategory, UseExpandDisplay } from "../utils/types";
import { useState } from "react";
import { cleanCategoryCount } from "../utils/clean-category-cout";
import DropDownMenu from "./data-category-list-dropdown";

export default function ListDataByCategories(props: {
	useExpandDisplay: UseExpandDisplay;
}) {
	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const [focused, setFocused] = useState("");
	const categoryGorupMap = cleanCategoryCount(rows);
	const { setDisplayExpanded } = props.useExpandDisplay;

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
															onClose={() => {
																setDisplayExpanded(-1);
															}}
															categoryName={(row[0] as string) || ""}
															setFocused={setFocused}
															indexKey={`${categoryIndex}-${groupIndex}`}
															count={row[1]}
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
