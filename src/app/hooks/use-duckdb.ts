import { useEffect, useState, useRef } from "react";
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
	const c = await db.connect();

	return { db, c };
}

export function useDuckDB() {
	const connectionRef = useRef<duckdb.AsyncDuckDBConnection>(null);
	const dbRef = useRef<duckdb.AsyncDuckDB>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);

	const init = async () => {
		try {
			const { db, c } = await initDuckDB();
			dbRef.current = db;
			connectionRef.current = c;
			setLoading(false);
			setIsInitialized(true);
		} catch (e) {
			setError(e as Error);
		}
	};

	useEffect(() => {
		init();
		return () => {
			connectionRef?.current?.close();
		};
	}, []);

	return { connectionRef, dbRef, error, loading, isInitialized };
}
