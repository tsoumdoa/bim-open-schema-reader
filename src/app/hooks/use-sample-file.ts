import { useQuery } from "@tanstack/react-query";

export default function useSampleFile(
	setFiles: (files: File[] | undefined) => void
) {
	const url = "https://rschema-reader-demo.tzero.one/sample.bos";

	const { data, error, isFetching, refetch } = useQuery({
		queryKey: ["data", url],
		queryFn: async () => {
			const res = await fetch(url);
			if (!res.ok) {
				return false;
				// throw new Error(`Request failed: ${res.status}`);
			}
			const blob = await res.blob();
			const file = new File([blob], "sample.bos");
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
