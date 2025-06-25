export const useRandom = (_seed?: number) => {
	let seed = ref(Math.random());

	function random(_seed_?: number) {
		var x = Math.sin(_seed_ ?? seed.value++) * 10000;
		return x - Math.floor(x);
	}

	return {
		seed,
		random,
	};
};
