import { QueryObjectCtx, UseQueryObjects } from "../utils/types";
import { createContext, useContext } from "react";

const DbContext = createContext<QueryObjectCtx | null>(null);

export default function QueryObjProvider(props: {
  useQueryObjects: UseQueryObjects;
  children: React.ReactNode;
}) {
  return (
    <DbContext.Provider
      value={{
        useQueryObjects: props.useQueryObjects,
      }}
    >
      {props.children}
    </DbContext.Provider>
  );
}

export function useQueryObjCtx() {
  const ctx = useContext(DbContext);
  if (!ctx) {
    throw new Error("useQueryObjCtx must be used within a QueryObjProvider");
  }
  return ctx;
}
