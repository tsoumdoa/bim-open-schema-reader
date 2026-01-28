export function SimpleErrMessage(props: {
	error: Error;
	customMessage?: string;
}) {
	if (props.customMessage) {
		return (
			<div>
				{props.customMessage}: {props.error.message}
			</div>
		);
	}
	return <div> Something went wrong: {props.error.message}</div>;
}
