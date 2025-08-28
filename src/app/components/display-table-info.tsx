import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function mergeNameAndType(names: string | number, types: string | number) {
	//bad bad bad but i know what i'm doing
	//@ts-ignore
	const nameArray = names.toArray() as string[];
	//@ts-ignore
	const typeArray = types.toArray() as string[];

	const merged = new Map<string | number, string | number>();
	nameArray.forEach((name, i) => {
		if (!merged.has(name)) {
			merged.set(name, typeArray[i]);
		}
	});

	return (
		<ul>
			{Array.from(merged.entries()).map(([name, type], i) => (
				<li key={`${name}-${i}`}>
					{name}{" "}
					<span className="font-light text-neutral-600 text-xs">
						{`<${String(type).toLowerCase()}>`}
					</span>
				</li>
			))}
		</ul>
	);
}

export function DisplayTableInfo(props: {
	headers: string[];
	rows: (string | number)[][];
}) {
	return (
		<ScrollArea className="h-full  w-fit min-w-40 rounded-md border">
			<div className="p-4">
				<h4 className="pb-2 text-sm leading-none font-medium text-neutral-600">
					Table Info
				</h4>
				{props.rows.map((row, i) => (
					<React.Fragment key={`table-row-${i}`}>
						<div className="font-bold text-xs leading-tight">{row[0]}</div>
						<div className="text-xs">{mergeNameAndType(row[1], row[2])}</div>
						<Separator className="my-2" />
					</React.Fragment>
				))}
			</div>
		</ScrollArea>
	);
}
