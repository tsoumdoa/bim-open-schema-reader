export const formatData = (data: string | number) => {
	if (typeof data === "string") {
		return data;
	}
	if (typeof data === "number") {
		return data.toLocaleString();
	} else {
		return data;
	}
};

export const formatToMs = (ms: number) => {
	return `${ms.toLocaleString(undefined, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})}ms`;
};
