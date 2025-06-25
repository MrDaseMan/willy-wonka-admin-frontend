import { TaskStatus } from "~/types/task/types";

export const NAVIGATION_ROUTES = [
	{
		id: "1",
		path: "/",
		name: "Задачи",
		icon: "house-line-bold",
		query: {
			status: TaskStatus.NOT_ASSIGNED,
		},
		isDisabled: false,
	},
	{
		id: "2",
		path: "/report",
		name: "Отчеты",
		icon: "file-text-bold",
		query: {},
		isDisabled: true,
	},
	{
		id: "3",
		path: "/machine",
		name: "Оборудование",
		icon: "washing-machine-bold",
		query: {},
		isDisabled: false,
	},
	{
		id: "4",
		path: "/users",
		name: "Пользователи",
		icon: "users-bold",
		query: {},
		isDisabled: true,
	},
];
