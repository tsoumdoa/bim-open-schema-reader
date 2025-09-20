import { listCountByCategory } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { useDuckDb } from "./use-db";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { denormParamQueryBuilder } from "../utils/queries-selector-list";
import { Separator } from "@/components/ui/separator";

function DropDownMenu(props: { categoryName: string }) {
	const handleClick = (tableName: string) => {
		console.log(tableName);
		// NOTE: this is where i left off..
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<span className="w-fit hover:cursor-pointer hover:bg-neutral-50">
					{props.categoryName || "undefined"}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				{denormParamQueryBuilder.map((item, index) => (
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
					onClick={() => handleClick("all")}
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
