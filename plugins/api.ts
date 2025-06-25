export default defineNuxtPlugin((nuxtApp) => {
	const token = useCookie("token");

	const api = $fetch.create({
		baseURL: useRuntimeConfig().public.apiUrl,
		onRequest({ request, options, error }) {
			if (token.value) {
				options.headers.set("Authorization", `Bearer ${token.value}`);
			}
		},
		async onResponseError({ response }) {
			if (response.status === 401 || response.status === 403) {
				await nuxtApp.runWithContext(() => navigateTo("/auth/login"));
			}
		},
	});

	return {
		provide: {
			api,
		},
	};
});
