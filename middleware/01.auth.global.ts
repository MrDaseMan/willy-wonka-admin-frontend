export default defineNuxtRouteMiddleware((to, from) => {
	const token = useCookie("token").value;

	if (import.meta.client && token) {
		try {
			const jwtUser = JSON.parse(atob(token.split(".")[1]));
			useUserStore().setUser({
				username: jwtUser.sub,
				roles: jwtUser.roles,
			});
		} catch (e) {
			console.error("error while parsing jwt", token);
		}
	}

	if (!token && !to.path.startsWith("/auth")) {
		return navigateTo("/auth/login");
	}
});
