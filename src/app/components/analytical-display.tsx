import { BlobWriter } from "@zip.js/zip.js";
import { ParquetBlob } from "../utils/types";

export default function AnalyticalDisplay(props: {
  parquetFileEntries: ParquetBlob[];
}) {
  console.log(props.parquetFileEntries);

  return <div>Analytical Display</div>;
}
