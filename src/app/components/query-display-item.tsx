import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QueryObject } from "../utils/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useState } from "react";
import SqlQueryCodeBlock from "./sql-code-block";

function DropDownMenu(props: {
  queryObject: QueryObject;
  showSqlQuery: boolean;
  setShowSqlQuery: (b: boolean) => void;
  removeObject: (queryObject: QueryObject) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-fit hover:cursor-pointer hover:bg-neutral-50"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="text-xs">
        <DropdownMenuItem className="text-xs">
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <span className="text-md leading-tight font-bold hover:cursor-help">
                About
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" align="start">
              <p>{props.queryObject.explaination}</p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs"
          onClick={() => {
            props.setShowSqlQuery(!props.showSqlQuery);
          }}
        >
          {props.showSqlQuery ? "Hide SQL Query" : "Show SQL Query"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-red-500">
          <p onClick={() => props.removeObject(props.queryObject)}>Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function QueryDisplayItem(props: {
  queryObject: QueryObject;
  removeObject: (queryObject: QueryObject) => void;
}) {
  const [showSqlQuery, setShowSqlQuery] = useState(false);
  return (
    <div className="flex min-w-full flex-col gap-y-1">
      <div className="flex flex-row items-center justify-start gap-x-2">
        {`${props.queryObject.queryTile} `}{" "}
        <span className="text-xs text-neutral-500">{`<${props.queryObject.queryCategory || "n/a"}>`}</span>
        <DropDownMenu
          queryObject={props.queryObject}
          showSqlQuery={showSqlQuery}
          setShowSqlQuery={setShowSqlQuery}
          removeObject={props.removeObject}
        />
      </div>
      {showSqlQuery && (
        <SqlQueryCodeBlock sqlQuery={props.queryObject.sqlQuery} />
      )}
      <Separator className="my-4" />
    </div>
  );
}
