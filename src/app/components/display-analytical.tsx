import { useDuckDB } from "../hooks/use-duckdb";
import { useImportParquet } from "../hooks/use-import-parquet";
import { useQueryObjects } from "../hooks/use-query-objects";
import { ParquetBlob } from "../utils/types";
import DashboardContainer from "./dashboard-container";
import QueryObjProvider from "./query-obj-provider";
import { SimpleErrMessage } from "./simple-err-message";
import { DuckDbProvider, useDuckDb } from "./use-db";

function DbProvider(props: {
  children: React.ReactNode;
  parquetFileEntries: ParquetBlob[];
}) {
  const { db, conn } = useDuckDb();
  const { error, isInitializing, isInitialized } = useImportParquet(
    db,
    conn,
    props.parquetFileEntries
  );
  if (isInitializing) {
    return <div>Initializing...</div>;
  }
  if (isInitialized) {
    return props.children;
  }
  return (
    <SimpleErrMessage
      error={error!}
      customMessage="Error loading parquet files"
    />
  );
}

export default function AnalyticalDisplay(props: {
  fileName: string;
  parquetFileEntries: ParquetBlob[];
}) {
  const { dbRef, connectionRef, error, loading } = useDuckDB();
  const useQueryObj = useQueryObjects();

  if (!error && loading) {
    return <div>Initializing...</div>;
  }

  if (dbRef.current && connectionRef.current) {
    return (
      <DuckDbProvider
        db={dbRef.current}
        c={connectionRef.current}
        useQueryObjects={useQueryObj}
      >
        <QueryObjProvider useQueryObjects={useQueryObj}>
          <DbProvider parquetFileEntries={props.parquetFileEntries}>
            <DashboardContainer fileName={props.fileName} />
          </DbProvider>
        </QueryObjProvider>
      </DuckDbProvider>
    );
  }

  return <SimpleErrMessage error={error!} />;
}
