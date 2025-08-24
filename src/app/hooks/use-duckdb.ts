import { useEffect, useState } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

async function initDuckDB() {
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {
      type: "text/javascript",
    })
  );

  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  return await db.connect();
}

export function useDuckDB() {
  const [db, setDb] = useState<duckdb.AsyncDuckDBConnection | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      const db = await initDuckDB();
      setDb(db);
      setLoading(false);
    } catch (e) {
      setError(e as Error);
    }
  };

  useEffect(() => {
    init();
    return () => {
      db?.close();
    };
  }, []);

  return { db, error, loading };
}
