import { denormParamQueryBuilder } from "../utils/denorm-param-query-builder";
import { denormParamQueryBuilderName } from "../utils/queries-selector-list";
import { DenormParamQueryType, DenormTableName } from "../utils/types";
import { useQueryObjCtx } from "./query-obj-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { RefObject } from "react";

export default function DropDownMenu(props: {
  onClose: () => void;
  categoryName: string;
  setFocused: (focused: string) => void;
  indexKey: string;
  disableShortcutRef?: RefObject<boolean>;
  children: React.ReactNode;
}) {
  const { useQueryObjects } = useQueryObjCtx();
  const { addQueries, addQuery } = useQueryObjects;

  const handleClick = (
    tableName: DenormTableName,
    usePivot: DenormParamQueryType
  ) => {
    const queryObj = denormParamQueryBuilder(
      tableName,
      props.categoryName,
      usePivot
    );
    addQuery(queryObj);
    if (props.disableShortcutRef) {
      props.disableShortcutRef.current = false;
    }
    props.onClose();
  };

  const addAll = (usePivot: DenormParamQueryType) => {
    const q = denormParamQueryBuilderName.map((item) => {
      return denormParamQueryBuilder(
        item.tableName,
        props.categoryName,
        usePivot
      );
    });
    addQueries(q);
    if (props.disableShortcutRef) {
      props.disableShortcutRef.current = false;
    }
    props.onClose();
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
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="text-xs">
        {denormParamQueryBuilderName.map((item, index) => (
          <DropdownMenuSub key={`query-builder-dropdown-item-${index}`}>
            <DropdownMenuSubTrigger className="text-xs">
              {item.displayName}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-fit">
              <DropdownMenuItem
                className="w-fit text-xs font-medium hover:cursor-pointer"
                onClick={() => handleClick(item.tableName, "flatten")}
              >
                Flatten
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-fit text-xs font-medium hover:cursor-pointer"
                onClick={() => handleClick(item.tableName, "pivot")}
              >
                Pivot
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-fit text-xs font-medium hover:cursor-pointer"
                onClick={() => handleClick(item.tableName, "stats")}
              >
                Stats
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
              onClick={() => addAll("flatten")}
            >
              Flatten
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-fit text-xs font-medium hover:cursor-pointer"
              onClick={() => addAll("pivot")}
            >
              Pivot
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-fit text-xs font-medium hover:cursor-pointer"
              onClick={() => addAll("stats")}
            >
              Stats
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
