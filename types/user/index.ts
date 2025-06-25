import type { UserRole } from "~/types/user/roles";

export interface User {
	username: string;
	roles: Array<UserRole>;
}

export interface UserDB {
	id: number;
	username: string;
	role: UserRole;
	isBanned: boolean;
}
