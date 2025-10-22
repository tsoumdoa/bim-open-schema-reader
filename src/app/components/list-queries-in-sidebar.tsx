import { UseExpandDisplay } from "../utils/types";
import { useQueryObjCtx } from "./query-obj-provider";

export default function ListQueriesInSidebar(props: {
  useExpandDisplay: UseExpandDisplay;
}) {
  const { useQueryObjects } = useQueryObjCtx();
  const queryObjs = useQueryObjects.queryObjects;

  const { setDisplayExpanded } = props.useExpandDisplay;
  const handleClick = (id: number) => {
    setDisplayExpanded(id);
  };

  const indexMap = new Map<string, number>();
  queryObjs.forEach((q, i) => {
    indexMap.set(q.id ?? "", i);
  });

  return (
    <div>
      {queryObjs.map((queryObject, i) => (
        <ul key={queryObject.id ?? `query-object-${i}`}>
          <li className="w-full truncate pl-2 text-sm leading-tight">
            <button
              type="button"
              className="text-base hover:cursor-pointer hover:underline"
              onClick={() => {
                handleClick(indexMap.get(queryObject.id ?? "") ?? -1);
              }}
            >
              <span className="text-xs font-bold">Q{i + 1} </span>
              <span className="text-xs">{queryObject.queryTitle}</span>
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
}
