import type { User } from "~/types/user";

export const useUserStore = defineStore("user", () => {
	const user = ref<User | null>(null);
	const token = useCookie("token");

	const setUser = (newUser: User) => (user.value = newUser);
	const getUser = computed(() => user.value);

	const removeUser = () => {
		user.value = null;
		token.value = undefined;
	};

	return {
		setUser,
		getUser,
		removeUser,
	};
});
