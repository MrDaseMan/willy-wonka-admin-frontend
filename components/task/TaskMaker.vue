<template>
	<button class="task-maker" plain @click="dialogVisible = true">
		<nuxt-icon name="plus-bold" filled />
		Создать новую задачу
	</button>

	<el-dialog
		v-model="dialogVisible"
		title="Новая задача"
		width="500"
		:before-close="handleClose"
		draggable
	>
		<div class="common-layout__additional__wrapper">
			<div class="common-layout__additional__block">
				<div class="common-layout__additional__title">Название</div>
				<el-input v-model="task.name" placeholder="Название задачи" />
			</div>
			<div class="common-layout__additional__block">
				<div class="common-layout__additional__title">
					Описание задачи
				</div>
				<el-input
					:rows="3"
					type="textarea"
					v-model="task.description"
					placeholder="Описание задачи"
				/>
			</div>
			<div class="common-layout__additional__block">
				<div class="common-layout__additional__title">Статус</div>
				<el-select
					v-model="task.status"
					remote
					reserve-keyword
					default-first-option
					placeholder="Выберите стартовый статус задачи"
				>
					<el-option
						v-for="status in getTaskStatuses"
						:key="status.status"
						:label="status.name"
						:value="status.status"
					/>
				</el-select>
			</div>
			<div class="common-layout__additional__block">
				<div class="common-layout__additional__title">Исполнитель</div>
				<el-select
					v-model="task.userId"
					placeholder="Выберите исполнителя"
				>
					<el-option
						v-for="user in users ?? []"
						:key="user.id"
						:label="user.username"
						:value="user.id"
					/>
				</el-select>
				<el-checkbox v-model="hasForceChangeUser">
					Переназначить исполнителя принудительно
				</el-checkbox>
			</div>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose(() => (dialogVisible = false))"
					>Отменить</el-button
				>
				<el-button type="primary" @click="onTaskCreate">
					Создать
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import type { Task } from "~/types/task";
import { TaskStatus } from "~/types/task/types";
import type { UserDB } from "~/types/user";

const { $api } = useNuxtApp();

const dialogVisible = ref(false);
const task = ref<Partial<Omit<Task, "user">> & { userId: number | undefined }>({
	name: undefined,
	description: undefined,
	userId: undefined,
	status: TaskStatus.NOT_ASSIGNED,
});

const hasForceChangeUser = ref(false);

// TODO: replace with search
const { data: users } = await useLazyFetch<Array<UserDB>>("/users", {
	method: "GET",
	$fetch: $api,
});

const handleClose = (done: () => void) => {
	ElMessageBox.confirm(
		"Вы уверены, что хотите отменить создание задачи? Несохранённые изменения удалятся!",
		{
			cancelButtonText: "Вернуться",
			confirmButtonText: "Да, отменить!",
			draggable: true,
		},
	)
		.then(() => {
			done();
		})
		.catch(() => {
			// catch error
		});
};

const getTaskStatuses = computed(() => [
	{
		name: "Не назначенные",
		status: TaskStatus.NOT_ASSIGNED,
	},
	{
		name: "В процессе",
		status: TaskStatus.IN_PROGRESS,
	},
	{
		name: "Завершённые",
		status: TaskStatus.COMPLETED,
	},
]);

const onTaskCreate = async () => {
	try {
		const response = await $api<Task>(`/tasks`, {
			method: "POST",
			body: {
				...task.value,
				force: hasForceChangeUser.value,
			},
		});

		dialogVisible.value = false;

		await navigateTo({
			query: {
				status: task.value?.status,
			},
		});

		useTaskStore().setTask(response);

		ElNotification({
			title: `Задача успешно создана!`,
			type: "success",
			position: "bottom-right",
		});
	} catch (error: any) {
		ElNotification({
			title: `Ошибка [${error?.status}]`,
			message: error?.data?.message,
			type: "error",
			position: "bottom-right",
		});
	}
};
</script>

<style lang="scss">
.task-maker {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
	width: 350px;
	height: 200px;

	padding: 6px;

	background: white;

	border: 1px dashed var(--gray-light-theme-500);
	color: var(--gray-light-theme-500);
	border-radius: 8px;
	overflow: hidden;

	cursor: pointer;
}
</style>
