import type { UserDB } from "~/types/user";
import type { TaskStatus } from "~/types/task/types";

type ISOString = string;

export interface Task {
	id: number;
	name: string;
	description: string;
	user: UserDB | null;
	status: TaskStatus;
	createdAt: ISOString;
	completedAt: ISOString;
}
