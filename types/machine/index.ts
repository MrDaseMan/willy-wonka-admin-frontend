import type { Workshop } from "~/types/workshop";

export type MachineStatus = "WORKING" | "UNDER_REPAIR" | "BROKEN";

export interface Machine {
	id: number;
	name: string;
	description: string;
	model: string;
	status: MachineStatus;
	health: number;
	temperature: number;
	lastServicedAt: string;
	workshop: Workshop;
}
