import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DisplayTableInfo } from "./display-table-info";
import ListDataByCategories from "./list-data-by-cagories";
import { UseExpandDisplay } from "../utils/types";
import ListQueriesInSidebar from "./list-queries-in-sidebar";

function AccordionDisplay(props: {
	children: React.ReactNode;
	accordionTitle: string;
}) {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger className="py-0">
					{props.accordionTitle}
				</AccordionTrigger>
				<AccordionContent>{props.children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
export default function SideBarContent(props: {
	useExpandDisplay: UseExpandDisplay;
}) {
	return (
		<div className="space-y-1">
			<AccordionDisplay accordionTitle="Table Schema">
				<DisplayTableInfo />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Add Query by Category">
				<ListDataByCategories useExpandDisplay={props.useExpandDisplay} />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Query">
				<ListQueriesInSidebar useExpandDisplay={props.useExpandDisplay} />
			</AccordionDisplay>
		</div>
	);
}
