import { ParquetBlob } from "../utils/types";
import { validateEntries } from "../utils/validateFiles";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { useRef, useState } from "react";

export function useHandleProcess() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [files, setFiles] = useState<File[] | undefined>();
	const [dbReady, setDbReady] = useState(false);
	const [open, setOpen] = useState(false);
	const parquetData = useRef<ParquetBlob[]>([]);
	const handleProcess = async () => {
		setIsProcessing(true);
		if (!files || files.length === 0) return;
		const file = files[0];

		//validate bos file
		try {
			const reader = new ZipReader(new BlobReader(file));
			const entries = await reader.getEntries();
			const fileNames = entries.map((entry) => entry.filename);
			const isValid = validateEntries(fileNames);
			if (!isValid) setOpen(true);

			for (const entry of entries) {
				if (!entry.directory) {
					const blob = await entry.getData(new BlobWriter());
					const arrayBuffer = await blob.arrayBuffer();
					const uint8 = new Uint8Array(arrayBuffer);
					parquetData.current.push({
						filename: entry.filename,
						parquet: uint8,
					});
				}
			}
			await reader.close();
		} catch (err) {
			setOpen(true);
			setFiles(undefined);
			console.error(err);
		}

		setIsProcessing(false);
		setDbReady(true);
	};
	return {
		handleProcess,
		isProcessing,
		dbReady,
		open,
		setOpen,
		parquetData,
		files,
		setFiles,
	};
}
