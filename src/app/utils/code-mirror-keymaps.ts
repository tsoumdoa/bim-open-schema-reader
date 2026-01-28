import { keymap } from "@codemirror/view";

export function makeKeymap({
	onRun,
	onFormat,
}: {
	onRun: () => void;
	onFormat: () => void;
}) {
	return keymap.of([
		{
			key: "Mod-Shift-Enter",
			preventDefault: true,
			run: () => {
				onRun();
				return true;
			},
		},
		{
			key: "Mod-Shift-f",
			preventDefault: true,
			run: () => {
				onFormat();
				return true;
			},
		},
	]);
}
