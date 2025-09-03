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
