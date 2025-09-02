import { QueryObject, QueryObjects } from "../utils/types";
import { useState } from "react";

export function useQueryObjects() {
  const [queryObjects, setQueryObjects] = useState<QueryObjects>([]);
  const addQuery = (queryObject: QueryObject) => {
    setQueryObjects([...queryObjects, queryObject]);
  };
  const removeQuery = (queryObject: QueryObject) => {
    setQueryObjects(
      queryObjects.filter((q) => q.queryTile !== queryObject.queryTile)
    );
  };

  return {
    queryObjects,
    addQuery,
    removeQuery,
  };
}
