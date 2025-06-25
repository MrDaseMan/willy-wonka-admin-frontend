import type { Task } from "~/types/task";

export const useTaskStore = defineStore("task", () => {
	const task = ref<Task | null>(null);

	const setTask = (newTask: Task) => (task.value = newTask);
	const getTask = computed(() => task.value);

	const removeTask = () => {
		task.value = null;
	};

	return {
		task,
		setTask,
		getTask,
		removeTask,
	};
});
