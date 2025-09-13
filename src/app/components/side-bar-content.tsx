import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DisplayTableInfo } from "./display-table-info";
import ListDataByCategories from "./list-data-by-cagories";

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
export default function SideBarContent() {
	return (
		<div className="space-y-1">
			<AccordionDisplay accordionTitle="Analytical">
				<DisplayTableInfo />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Category">
				<ListDataByCategories />
			</AccordionDisplay>
		</div>
	);
}
