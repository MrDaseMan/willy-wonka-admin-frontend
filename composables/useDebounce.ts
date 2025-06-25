export function useDebounce<T>(
	callbackFn: (...args: any[]) => T,
	delay: number,
): Ref<(...args: any[]) => void> {
	const debouncedFunction = ref<(...args: any[]) => void>(() => {});

	let timeoutId: NodeJS.Timeout | null = null;

	debouncedFunction.value = (...args: any[]) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			callbackFn(...args);
		}, delay);
	};

	return debouncedFunction;
}
