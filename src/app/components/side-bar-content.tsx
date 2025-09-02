import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DisplayTableInfo } from "./display-table-info";
import * as duckdb from "@duckdb/duckdb-wasm";
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
export default function SideBarContent(props: {
  duckDbConnection: duckdb.AsyncDuckDBConnection;
}) {
  return (
    <div className="space-y-1">
      <AccordionDisplay accordionTitle="Analytical">
        <DisplayTableInfo c={props.duckDbConnection} />
      </AccordionDisplay>
      <AccordionDisplay accordionTitle="Category">
        <ListDataByCategories c={props.duckDbConnection} />
      </AccordionDisplay>
    </div>
  );
}
