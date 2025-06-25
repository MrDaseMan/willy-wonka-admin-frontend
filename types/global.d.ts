export {};

declare global {
	type Timeout = ReturnType<typeof setTimeout>;
	type TimeoutOrNull = Timeout | null;

	type Theme = {
		name: string;
		value: string;
		icon: string;
	};
}
