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
import { DenormTableName } from "../utils/types";

function DropDownMenu(props: { categoryName: string }) {
	const { useQueryObjects } = useQueryObjCtx();
	const { addQueries, addQuery } = useQueryObjects;
	const handleClick = (tableName: DenormTableName) => {
		const queryObj = denormParamQueryBuilder(tableName, props.categoryName);
		addQuery(queryObj);
	};

	const addAll = () => {
		const d = denormParamQueryBuilderName.map((item) => {
			return denormParamQueryBuilder(item.tableName, props.categoryName);
		});
		addQueries(d);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<span className="w-fit hover:cursor-pointer hover:bg-neutral-50">
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

export default function ListDataByCategories() {
	const { conn } = useDuckDb();
	const { rows } = useRunDuckDbQuery(conn, listCountByCategory);
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
								<tr key={`category-count-${index}`}>
									<td className="text-left tracking-tight">
										<DropDownMenu categoryName={(row[0] as string) || ""} />
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
