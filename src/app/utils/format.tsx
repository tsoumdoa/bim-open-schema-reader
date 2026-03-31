export const formatData = (data: unknown) => {
	if (data === null) {
		return <span className="text-neutral-500">null</span>;
	}

	if (data === undefined) {
		return <span className="text-neutral-500">n/a</span>;
	}

	if (typeof data === "bigint") {
		return data.toLocaleString();
	}

	if (typeof data === "boolean") {
		return data ? "true" : "false";
	}

	if (typeof data === "string") {
		return data;
	}

	if (typeof data === "number") {
		return data.toLocaleString();
	}

	if (ArrayBuffer.isView(data)) {
		return Array.from(data as unknown as ArrayLike<unknown>).join(", ");
	}

	if (typeof data === "object") {
		try {
			const stringified = JSON.stringify(data);
			const json = JSON.parse(stringified);

			if (Array.isArray(json)) {
				return (
					<ul>
						{json.map((item, i) => {
							return (
								<li key={i}>
									{item ? (
										formatData(item)
									) : (
										<span className="text-neutral-500">n/a</span>
									)}
								</li>
							);
						})}
					</ul>
				);
			}

			return JSON.stringify(data, null, 2);
		} catch {
			return String(data);
		}
	}

	return String(data);
};

export const formatToMs = (ms: number) => {
	return `${ms.toLocaleString(undefined, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})}ms`;
};

export const formatForFileDownload = (queryTitle: string) => {
	return queryTitle
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
};
