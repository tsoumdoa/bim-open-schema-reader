import { useQuery } from "@tanstack/react-query";

export default function useSampleFile(
	setFiles: (files: File[] | undefined) => void
) {
	const url =
		"https://rschema-reader-demo.tzero.one/Snowdon%20Towers%20Sample%20Architectural.parquet.zip";

	const { data, error, isFetching, refetch } = useQuery({
		queryKey: ["data", url],
		queryFn: async () => {
			const res = await fetch(url);
			if (!res.ok) {
				return false;
				// throw new Error(`Request failed: ${res.status}`);
			}
			const blob = await res.blob();
			const file = new File(
				[blob],
				"Snowdon Towers Sample Architectural.parquet.zip"
			);
			setFiles([file]);
			return true;
		},
		enabled: false,
	});
	return {
		data,
		error,
		isFetching,
		refetch,
	};
}
