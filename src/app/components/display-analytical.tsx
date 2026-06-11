import { useDuckDB } from "../hooks/use-duckdb";
import { useImportParquet } from "../hooks/use-import-parquet";
import { BosFileType, ParquetBlob } from "../utils/types";
import DashboardContainer from "./dashboard-container";
import { GeometryProviderFromParquet } from "./geometry-from-parquet-context";
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
		return (
			<GeometryProviderFromParquet
				parquetFileEntries={props.parquetFileEntries}
				db={db}
				conn={conn}
			>
				{props.children}
			</GeometryProviderFromParquet>
		);
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
	bosFileType: BosFileType;
	onUnloadModel: () => void;
}) {
	const { dbRef, connectionRef, error, loading } = useDuckDB();

	if (!error && loading) {
		return <div>Initializing...</div>;
	}

	if (dbRef.current && connectionRef.current) {
		return (
			<DuckDbProvider
				db={dbRef.current}
				c={connectionRef.current}
				bosFileType={props.bosFileType}
			>
				<QueryObjProvider bosFileType={props.bosFileType}>
					<DbProvider parquetFileEntries={props.parquetFileEntries}>
						<DashboardContainer
							fileName={props.fileName}
							bosFileType={props.bosFileType}
							onUnloadModel={props.onUnloadModel}
						/>
					</DbProvider>
				</QueryObjProvider>
			</DuckDbProvider>
		);
	}

	return <SimpleErrMessage error={error!} />;
}
