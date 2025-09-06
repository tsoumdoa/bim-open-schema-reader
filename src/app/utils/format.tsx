export const formatData = (data: string | number) => {
	if (typeof data === "string") {
		return data;
	}
	if (typeof data === "number") {
		return data.toLocaleString();
	}

	if (ArrayBuffer.isView(data)) {
		return Array.from(data).join(", ");
	}

	if (typeof data === "object" && data !== null) {
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

		return JSON.stringify(data, null, 2); // pretty-print
	}

	return data;
};

export const formatToMs = (ms: number) => {
	return `${ms.toLocaleString(undefined, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})}ms`;
};
