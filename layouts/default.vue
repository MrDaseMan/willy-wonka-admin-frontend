<template>
	<el-container class="common-layout">
		<el-aside class="common-layout__navigation">
			<NuxtImg
				class="common-layout__logo"
				src="/logo.png"
				@click="
					navigateTo({
						path: NAVIGATION_ROUTES[0].path,
						query: NAVIGATION_ROUTES[0].query,
					})
				"
			/>
			<el-scrollbar>
				<nav class="common-layout__menu">
					<el-menu class="common-layout__menu__wrapper">
						<el-menu :default-active="getCurrentRoute?.id">
							<el-menu-item
								v-for="route in NAVIGATION_ROUTES"
								:key="route.id"
								:index="route.id"
								:disabled="route.isDisabled"
								@click="
									navigateTo({
										path: route.path,
										query: route.query,
									})
								"
							>
								<nuxt-icon
									class="margin-0"
									:name="route.icon"
									filled
								/>
								{{ route.name }}
							</el-menu-item>
						</el-menu>
					</el-menu>
				</nav>
			</el-scrollbar>
			<client-only>
				<div class="common-layout__profile">
					<div class="common-layout__profile__wrapper">
						<div class="common-layout__profile__info">
							<div class="common-layout__profile__name">
								{{ getUser?.username }}
							</div>
							<div class="common-layout__profile__position">
								{{ getUser?.roles.join(", ") }}
							</div>
						</div>
						<el-button
							class="common-layout__profile__exit"
							text
							@click="logout"
						>
							<nuxt-icon name="sign-out-bold" filled />
						</el-button>
					</div>
				</div>
			</client-only>
		</el-aside>
		<el-container>
			<el-header class="common-layout__header">
				<div class="common-layout__header__route">
					<nuxt-icon
						class="margin-0"
						:name="getCurrentRoute?.icon ?? ''"
						filled
					/>
					{{ getCurrentRoute?.name }}
				</div>
			</el-header>
			<el-main class="common-layout__content">
				<el-container class="common-layout__wrapper">
					<el-container class="common-layout__main block">
						<el-menu
							v-if="getCurrentRoute?.id === '1'"
							class="common-layout__main__header block__header"
							:default-active="getCurrentStatus"
						>
							<el-menu-item
								v-for="_task in getTaskStatuses"
								:key="_task.status"
								class="common-layout__header--row"
								:index="_task.status"
								@click="onStatusFilterChange(_task.status)"
							>
								{{ _task.name }}
							</el-menu-item>
						</el-menu>
						<slot />
					</el-container>
					<el-aside
						class="common-layout__additional block"
						v-if="getTask && getCurrentRoute?.id === '1'"
					>
						<el-container
							class="common-layout__additional__header block__header"
						>
							Информация о задаче
						</el-container>
						<div class="common-layout__additional__wrapper">
							<div class="common-layout__additional__block">
								<div class="common-layout__additional__title">
									Название
								</div>
								<el-input
									:model-value="task?.name"
									@update:model-value="
										(value) =>
											onCurrentTaskUpdated('name', value)
									"
									placeholder="Название задачи"
								/>
							</div>
							<div class="common-layout__additional__block">
								<div class="common-layout__additional__title">
									Описание задачи
								</div>
								<el-input
									:rows="3"
									type="textarea"
									:model-value="task?.description"
									@update:model-value="
										(value) =>
											onCurrentTaskUpdated(
												'description',
												value,
											)
									"
									placeholder="Описание задачи"
								/>
							</div>
							<div class="common-layout__additional__block">
								<div class="common-layout__additional__title">
									Статус
								</div>
								<el-select
									:model-value="task?.status"
									remote
									reserve-keyword
									placeholder="Выберите исполнителя"
									@update:model-value="
										(value) =>
											onCurrentTaskUpdated(
												'status',
												value,
											)
									"
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
								<div class="common-layout__additional__title">
									Исполнитель
								</div>
								<el-select
									:model-value="task?.user ?? undefined"
									value-key="username"
									remote
									reserve-keyword
									placeholder="Выберите исполнителя"
									@update:model-value="
										(value) =>
											onCurrentTaskUpdated('user', value)
									"
								>
									<el-option
										v-for="user in users"
										:key="user.id"
										:label="user.username"
										:value="user"
									/>
								</el-select>
								<el-checkbox v-model="hasForceChangeUser">
									Переназначить исполнителя принудительно
								</el-checkbox>
							</div>
						</div>
					</el-aside>
				</el-container>
			</el-main>
		</el-container>
	</el-container>
</template>

<script lang="ts" setup>
import type { Task } from "~/types/task";
import { TaskStatus } from "~/types/task/types";
import type { UserDB } from "~/types/user";
import { NAVIGATION_ROUTES } from "~/utils/const/routing";

const { $api } = useNuxtApp();

const { task, getTask } = storeToRefs(useTaskStore());

const hasForceChangeUser = ref(false);

const { value: onCurrentTaskUpdatedCallback } = useDebounce(
	async (prevTask: Task) => {
		try {
			await $api(`/tasks/${task?.value?.id}`, {
				method: "PUT",
				body: {
					name: task.value?.name,
					description: task.value?.description,
					status: task.value?.status,
					...(task.value?.user?.id
						? { userId: task.value?.user?.id }
						: {}),
					force: hasForceChangeUser.value,
				},
			});

			if (prevTask.status !== task.value?.status) {
				await navigateTo({
					query: {
						status: task.value?.status,
					},
				});
			}
		} catch (error: any) {
			if (task.value) {
				task.value.name = prevTask.name;
				task.value.description = prevTask.description;
				task.value.user = prevTask.user;
				task.value.status = prevTask.status;
			}

			ElNotification({
				title: `Ошибка [${error?.status}]`,
				message: error?.data?.message,
				type: "error",
				position: "bottom-right",
			});
		}
	},
	1000,
);

const onCurrentTaskUpdated = async <K extends keyof Task>(
	field: K,
	value: Task[K],
) => {
	if (!task.value) return;

	const prevTask = JSON.parse(JSON.stringify(task?.value));

	task.value[field] = value;

	onCurrentTaskUpdatedCallback(prevTask);
};

// TODO: replace with search
const { data: users } = await useLazyFetch<Array<UserDB>>("/users", {
	method: "GET",
	$fetch: $api,
});

const getCurrentRoute = computed(() =>
	NAVIGATION_ROUTES.toReversed().find((route) =>
		useRoute().path.startsWith(route.path),
	),
);

if (
	Object.keys(useRoute().query).length === 0 &&
	Object.keys(getCurrentRoute.value?.query ?? {}).length !== 0
) {
	await navigateTo({
		query: {
			...getCurrentRoute.value?.query,
		},
	});
}

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

const onStatusFilterChange = async (status: TaskStatus) => {
	await navigateTo({
		query: {
			status: status,
		},
	});
};

const getCurrentStatus = computed(
	() => useRoute().query.status?.toString() || undefined,
);

const { getUser } = storeToRefs(useUserStore());

const logout = async () => {
	useUserStore().removeUser();
	await navigateTo("/auth/login");
};
</script>

<style lang="scss">
.common-layout {
	width: 100dvw;
	height: 100dvh;
	background: var(--gray-light-theme-100);

	&__navigation {
		display: flex;
		flex-direction: column;

		width: 240px;
		height: 100dvh;
		max-height: 100dvh;
		overflow: hidden;

		.el-scrollbar {
			height: auto;
			flex: 1;
		}
	}

	&__header {
		display: flex;
		justify-content: space-between;

		height: 40px;

		padding: 8px 24px 8px 16px;

		&__route {
			display: flex;
			gap: 6px;
			align-items: center;

			font-weight: 500;
			font-size: 16px;
			line-height: 125%;
			text-align: center;
			color: var(--gray-light-theme-500);
		}
	}

	&__content {
		padding-top: 0;
		padding-left: 0;
		padding-right: 8px;
		padding-bottom: 8px;
	}

	&__additional {
		width: 365px;
		height: 100%;

		&__header {
			display: flex;
			align-items: center;
		}

		&__wrapper {
			display: flex;
			flex-direction: column;
			gap: 16px;

			height: 100%;
			padding: 12px 16px;
		}

		&__block {
			display: flex;
			flex-direction: column;
			gap: 8px;

			&--row {
				flex-direction: row;
				align-items: center;
			}
		}

		&__title {
			font-weight: 500;
			font-size: 14px;
			line-height: 114%;
			color: var(--gray-light-theme-700);
		}
	}

	&__wrapper {
		height: 100%;
		gap: 8px;
	}

	&__main {
		display: flex;
		flex-direction: column;

		width: 100%;
		height: 100%;

		&__header {
			display: flex;
			gap: 12px;

			// TODO: Зарефачить
			@include increase-specificity($depth: 5) {
				flex-direction: row;

				& .el-menu-item {
					padding: 4px;
					width: fit-content;
				}
			}
		}
	}

	&__main,
	&__additional {
		background: var(--white);
		border: 1px solid var(--gray-light-theme-200);
		border-radius: 12px;
	}

	&__logo {
		display: flex;
		height: 80px;
		width: 100%;
		object-fit: contain;
		padding: 8px 24px 8px 16px;
		cursor: pointer;
	}

	&__menu {
		display: flex;
		flex-direction: column;
		gap: 24px;

		height: 100%;
		padding-left: 8px;
		padding-right: 8px;
	}

	&__competitors {
		display: flex;
		flex-direction: column;

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			font-weight: 600;
			font-size: 14px;
			line-height: 143%;
			color: var(--gray-light-theme-500);

			padding-top: 4px;
			padding-left: 12px;
			padding-right: 12px;
			padding-bottom: 4px;
		}

		&__add {
			font-size: 20px;
		}
	}

	&__profile {
		padding-right: 8px;
		padding-left: 8px;
		padding-bottom: 8px;

		&__wrapper {
			width: 100%;

			display: inline-flex;
			justify-content: space-between;
			align-items: center;

			border-radius: 8px;
			padding: 12px;
			background: var(--gray-light-theme-200);
		}

		&__info {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		&__name {
			font-size: 14px;
			font-weight: 600;
			line-height: 114%;
			color: var(--gray-light-theme-900);

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			max-width: 176px;
		}

		&__position {
			font-size: 12px;
			font-weight: 500;
			line-height: 133%;
			color: var(--gray-light-theme-500);

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			max-width: 176px;
		}
	}
}

.block {
	display: flex;
	flex-direction: column;

	&__header {
		min-height: 56px;

		border-bottom: 1px solid var(--gray-light-theme-200);
		padding: 12px 16px;

		font-weight: 600;
		font-size: 16px;
		line-height: 125%;
		color: var(--gray-light-theme-700);
	}

	&__footer {
		min-height: 56px;

		border-top: 1px solid var(--gray-light-theme-200);
		padding: 12px 16px;

		font-weight: 600;
		font-size: 16px;
		line-height: 125%;
		color: var(--gray-light-theme-700);

		& > .el-button {
			width: 100%;
		}
	}
}

// TODO: Зарефачить
* {
	@include increase-specificity($depth: 4) {
		.el-menu {
			display: flex;
			flex-direction: column;

			background: transparent;

			border-right: 0;
		}

		.el-menu-item {
			display: flex;
			flex-direction: row;
			gap: 12px;

			border-radius: 6px;

			padding: 8px 8px 8px 12px;

			background: transparent;
			height: fit-content;

			font-weight: 600;
			font-size: 14px;
			line-height: 143%;
			color: var(--gray-light-theme-500);

			& > span {
				font-size: 20px;
			}

			&.is-active {
				background: var(--gray-light-theme-200);
				color: var(--gray-light-theme-700);
			}
		}
	}
}
</style>
