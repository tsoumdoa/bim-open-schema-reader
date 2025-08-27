import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

function mergeNameAndType(names: string | number, types: string | number) {
	//bad bad bad but i know what i'm doing
	//@ts-ignore
	const nameArray = names.toArray() as string[];
	//@ts-ignore
	const typeArray = types.toArray() as string[];
	return nameArray
		.map((name, i) => `${name} <${typeArray[i].toLowerCase()}>`)
		.join(", ");
}

export function DisplayTableInfo(props: {
	headers: string[];
	rows: (string | number)[][];
}) {
	return (
		<Table className="w-full">
			<TableCaption>Table Info</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Table Name</TableHead>
					<TableHead>Column info [col_name: col_type]</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.rows.map((row, i) => (
					<TableRow key={i}>
						<TableCell className="font-medium text-left">{row[0]}</TableCell>
						<TableCell className="text-left">{mergeNameAndType(row[1], row[2])}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
