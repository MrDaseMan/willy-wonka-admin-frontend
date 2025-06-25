<template>
	<div class="machine-card">
		<el-tag :type="getStatusType">{{ getStatusName }}</el-tag>
		<div class="machine-card__title">
			{{ data.name }}
		</div>
		<div class="machine-card__description">
			<span> Описание: {{ data.description }} </span>
			<span> Состояние: {{ data.health }}%/100% </span>
			<span> Температура: {{ data.temperature }}℃ </span>
		</div>
		<div class="machine-card__footer">
			<span>
				Модель:
				{{ data.model }}
			</span>
			<span>
				Цех:
				{{ data.workshop.name }}
			</span>
			<span>
				Последний ремонт:
				{{ data.lastServicedAt.split("-").reverse().join(".") }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Machine } from "~/types/machine";

const props = defineProps<{
	data: Machine;
}>();

const getStatusType = computed(() => {
	switch (props.data.status) {
		case "BROKEN":
			return "danger";
		case "UNDER_REPAIR":
			return "warning";
		case "WORKING":
		default:
			return "success";
	}
});

const getStatusName = computed(() => {
	switch (props.data.status) {
		case "BROKEN":
			return "Сломано";
		case "UNDER_REPAIR":
			return "Ремонт";
		case "WORKING":
		default:
			return "Работает";
	}
});

const getColor = computed(() => {
	switch (props.data.status) {
		case "BROKEN":
			return "var(--el-color-danger)";
		case "UNDER_REPAIR":
			return "var(--el-color-warning)";
		case "WORKING":
		default:
			return "var(--el-color-success)";
	}
});
</script>

<style lang="scss">
.machine-card {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 49.25%;
	height: 250px;

	padding: 6px;

	border: 1px solid var(--gray-light-theme-200);
	border-left: 8px solid v-bind(getColor);
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
		display: flex;
		flex-direction: column;
		gap: 4px;

		& > span {
			display: -webkit-box;
			line-clamp: 3;
			-webkit-line-clamp: 3;
			box-orient: vertical;
			-webkit-box-orient: vertical;

			font-size: 14px;
			color: var(--gray-light-theme-500);

			text-overflow: ellipsis;
			overflow: hidden;
			max-width: 100%;
			max-height: 5em;
		}
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
}
</style>
