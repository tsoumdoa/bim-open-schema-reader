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
import { DenormTableName, UseExpandDisplay } from "../utils/types";

export default function DropDownMenu(props: {
	categoryName: string;
	useExpandDisplay?: UseExpandDisplay;
	count?: number;
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

	const addAll = (usePivot: boolean = false) => {
		const q = denormParamQueryBuilderName.map((item) => {
			return denormParamQueryBuilder(
				item.tableName,
				props.categoryName,
				usePivot
			);
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
					{props.categoryName || "<undefined>"}{" "}
					{props.count && `- ${props.count}`}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom" className="text-xs">
				{denormParamQueryBuilderName.map((item, index) => (
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
				))}
				<Separator className="my-1" />

				<DropdownMenuSub key={`query-builder-dropdown-item-all`}>
					<DropdownMenuSubTrigger className="text-xs font-bold">
						All
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent className="w-fit">
						<DropdownMenuItem
							className="w-fit text-xs font-medium hover:cursor-pointer"
							onClick={() => addAll()}
						>
							Flatten
						</DropdownMenuItem>
						<DropdownMenuItem
							className="w-fit text-xs font-medium hover:cursor-pointer"
							onClick={() => addAll(true)}
						>
							Pivot
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
