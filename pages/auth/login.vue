<template>
	<div class="login">
		<div class="login__header">
			<div class="login__title">
				<h1>Вход</h1>
				<h2>Добро пожаловать!</h2>
			</div>
		</div>

		<el-form
			ref="loginFormRef"
			class="login__form"
			:model="loginForm"
			:rules="rules"
		>
			<el-form-item label="Email" prop="username">
				<el-input v-model="loginForm.username" type="username" />
			</el-form-item>

			<el-form-item label="Пароль" prop="password">
				<el-input
					v-model="loginForm.password"
					type="password"
					show-password
				/>
			</el-form-item>

			<el-form-item>
				<el-button
					class="login__button"
					type="primary"
					size="large"
					@click="login(loginFormRef)"
				>
					Войти
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import type { UserRole } from "~/types/user/roles";

const tokenCookie = useCookie("token");

definePageMeta({
	layout: "auth",
});

interface LoginReqestReturnType {
	role: UserRole;
	token: string;
	username: string;
}

interface LoginForm {
	username: string;
	password: string;
}

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<LoginForm>({
	username: "",
	password: "",
});

/*
Критерии для username:
Длина: >5 и <35 символов
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateEmail = (rule: any, value: any, callback: any) => {
	if (value === "") {
		callback(new Error("Пожалуйста, введите имя пользователя"));
	}

	if (value.length > 35) {
		callback(
			new Error("Длина имя пользователя не должна превышать 35 символов"),
		);
	}

	if (value.length < 5) {
		callback(
			new Error("Длина имя пользователя не должна быть менее 5 символов"),
		);
	}

	callback();
};

/*
Критерии для password:
Длина: >5 и <32
Разрешены латинские буквы, цифры и знаки
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePassword = (rule: any, value: any, callback: any) => {
	if (value === "") {
		callback(new Error("Пожалуйста, введите пароль"));
	}

	if (value.length > 32) {
		callback(new Error("Длина пароля не должна превышать 32 символов"));
	}

	if (value.length < 5) {
		callback(new Error("Длина пароля не должна быть менее 5 символов"));
	}

	callback();
};

const rules = reactive<FormRules<typeof loginForm>>({
	username: [{ validator: validateEmail, trigger: "blur" }],
	password: [{ validator: validatePassword, trigger: "blur" }],
});

const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;

	formEl.validate(async (valid) => {
		if (!valid) {
			return;
		}

		try {
			const response = await $fetch<LoginReqestReturnType>(
				useRuntimeConfig().public.apiUrl + "/auth/signin",
				{
					method: "post",
					body: {
						username: loginForm.username,
						password: loginForm.password,
					},
				},
			);

			if (!response.token) {
				return;
			}

			tokenCookie.value = response.token;

			useUserStore().setUser({
				username: response.username,
				roles: [response.role], // TODO: Костыль из-за бэка
			});

			ElNotification({
				title: `Авторизация успешна!`,
				type: "success",
				position: "bottom-right",
			});

			await navigateTo("/");
		} catch (error: any) {
			ElNotification({
				title: `Ошибка [${error?.status}]`,
				message: error?.data?.localizedMessage,
				type: "error",
				position: "bottom-right",
			});
		}
	});
};
</script>

<style lang="scss">
.login {
	display: flex;
	flex-direction: column;
	gap: 24px;

	max-height: 90%;

	width: 440px;

	padding: 32px;

	border-radius: 12px;

	background: var(--white);

	&__header {
		display: flex;
		flex-direction: column;

		align-items: center;

		gap: 24px;
	}

	&__title {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 12px;

		& > h1 {
			color: var(--gray-light-theme-900);
			font-size: 32px;
			font-weight: 600;
			line-height: 125%;
			text-align: center;
		}

		& > h2 {
			font-weight: 400;
			font-size: 14px;
			line-height: 143%;
			text-align: center;
			color: var(--gray-light-theme-500);
		}
	}

	&__form {
		& > :last-child {
			margin-top: 78px;
		}
	}

	&__button {
		width: 100%;
	}
}
</style>
