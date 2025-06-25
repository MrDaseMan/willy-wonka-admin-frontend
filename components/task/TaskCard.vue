<template>
	<div
		class="task-card"
		:class="{ 'task-card--selected': selected }"
		@click="selectTask"
	>
		<div class="task-card__title">
			{{ data.name }}
		</div>
		<div class="task-card__description">
			{{ data.description }}
		</div>
		<div class="task-card__footer">
			<span>
				Исполнитель: {{ data.user?.username ?? "Не назначен" }}
			</span>
			<span> Создана: {{ getCreatedAtFormated }} </span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { DateTime } from "luxon";
import type { Task } from "~/types/task";

const props = defineProps<{
	data: Task;
	selected: boolean;
}>();

let getRandomRGB =
	"#" +
	(((1 << 24) * useRandom().random(props.data.id)) | 0)
		.toString(16)
		.padStart(6, "0");

const selectTask = () => {
	useTaskStore().setTask(props.data);
};

const getCreatedAtFormated = computed(() => {
	const date: DateTime = DateTime.fromISO(props.data.createdAt);
	return date.toLocaleString();
});
</script>

<style lang="scss">
.task-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 12px;
	width: 350px;
	height: 200px;

	padding: 6px;

	border: 1px solid var(--gray-light-theme-200);
	border-left: 8px solid v-bind(getRandomRGB);
	border-radius: 8px;
	overflow: hidden;

	cursor: pointer;

	&__title {
		font-size: 18px;
		color: var(--gray-light-theme-700);

		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 100%;
	}

	&__description {
		flex: 1;
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 7;
		box-orient: vertical;
		-webkit-box-orient: vertical;

		font-size: 14px;
		color: var(--gray-light-theme-500);

		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 100%;
		max-height: 7em;
	}

	&__footer {
		display: flex;
		flex-direction: column;
		gap: 4px;

		& > span {
			font-size: 14px;
			color: var(--gray-light-theme-700);
		}
	}

	&:hover {
		background: var(--gray-light-theme-50);
	}

	&--selected {
		background: var(--gray-light-theme-100);
		border: 1px solid var(--gray-light-theme-400);
		border-left: 8px solid v-bind(getRandomRGB);
		filter: drop-shadow(0 0 0.2rem var(--gray-light-theme-300));
	}
}
</style>
