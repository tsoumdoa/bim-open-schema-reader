import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { cleanCategoryCount } from "../utils/clean-category-count";
import { listCountByCategory } from "../utils/queries";
import { generalCategory, UseExpandDisplay } from "../utils/types";
import DropDownMenu from "./data-category-list-dropdown";
import DataReadinessIcon from "./data-readiness-icon";
import FilterByDataReadiness from "./filter-by-data-readiness";
import { useDataReadinessFilter } from "./use-data-readiness-filter";
import { useDuckDb } from "./use-db";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function ListDataByCategories(props: {
	useExpandDisplay: UseExpandDisplay;
}) {
	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
	const [focused, setFocused] = useState("");
	const categoryGroupMap = cleanCategoryCount(rows);
	const { setDisplayExpanded } = props.useExpandDisplay;
	const { isSelected } = useDataReadinessFilter();
	return (
		<div className="flex flex-col text-xs ">
			<div className="overflow-x-auto">
				<FilterByDataReadiness />
				{generalCategory.map((categoryName, categoryIndex) => {
					const rawRows = categoryGroupMap.get(categoryName) ?? [];
					const visibleRows = rawRows.filter((row) =>
						isSelected(row[0].analyticalReadiness)
					);

					if (visibleRows.length === 0) return null;

					const dimmedCategory =
						focused !== "" && focused.split("-")[0] !== `${categoryIndex}`;

					return (
						<div key={`category-${categoryIndex}`}>
							<div
								className={`text-sm font-bold ${dimmedCategory ? "opacity-20" : ""}`}
							>
								{categoryName}
							</div>

							<table className="w-full table-auto">
								<thead className={dimmedCategory ? "opacity-20" : ""}>
									<tr className="tracking-tight text-neutral-800">
										<th className="w-3"></th>
										<th className="pl-1 text-left">Name</th>
										<th className="text-right">Count</th>
									</tr>
								</thead>
								<tbody>
									{visibleRows.map((row, groupIndex) => {
										const dimmedRow =
											focused !== "" &&
											focused !== `${categoryIndex}-${groupIndex}`;

										return (
											<tr
												key={`category-count-${groupIndex}`}
												className={`transition-all hover:bg-neutral-200 ${
													dimmedRow ? "opacity-20" : ""
												}`}
											>
												<td className="text-xs font-bold">
													<DataReadinessIcon
														dataReadiness={row[0].analyticalReadiness}
														useThin={true}
													/>
												</td>

												<td className="px-1 text-left tracking-tight">
													<DropDownMenu
														onClose={() => {
															setDisplayExpanded(-1);
														}}
														categoryName={(row[0].categoryName as string) || ""}
														setFocused={setFocused}
														indexKey={`${categoryIndex}-${groupIndex}`}
													>
														<div className="w-fit hover:cursor-pointer">
															{row[0].categoryName || "<undefined>"}{" "}
														</div>
													</DropDownMenu>
												</td>

												<td className="pr-1 text-right">
													{row[1].toLocaleString()}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>

							<Separator className="my-2" />
						</div>
					);
				})}
			</div>
		</div>
	);
}
