<template>
	<div class="main-page">
		<template v-if="status === 'success'">
			<TaskMaker />
			<TaskCard
				v-for="task in tasks"
				:key="task.id"
				:data="task"
				:selected="getTask?.id === task.id"
			/>
		</template>
		<div class="main-page__loader" v-else>
			<CircleLoader />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Task } from "~/types/task";

const { $api } = useNuxtApp();
const route = useRoute();

const { task, getTask } = storeToRefs(useTaskStore());

const {
	data: tasks,
	refresh,
	status,
} = await useAsyncData<Array<Task>>(
	() =>
		$api("/tasks/filter", {
			method: "POST",
			body: {
				...route.query,
				name: "",
			},
		}),
	{
		dedupe: "defer",
		deep: true,
		server: false,
	},
);

watch(
	() => ({ ...route.query }),
	() => {
		refresh();
	},
);

watch(
	task,
	(newTask) => {
		if (
			tasks.value?.find((e) => e.id === newTask?.id)?.status ===
			newTask?.status
		)
			return;

		refresh();
	},
	{
		deep: true,
	},
);
</script>

<style lang="scss">
.main-page {
	width: 100%;
	height: 100%;
	max-height: 100%;
	overflow-y: auto;

	display: flex;
	flex-wrap: wrap;
	gap: 16px 16px;
	justify-content: flex-start;
	align-content: flex-start;

	padding: 16px;

	&__loader {
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
