<template>
	<div class="auth">
		<NuxtImg class="logo" src="/logo.png" />

		<slot />
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.auth {
	display: flex;
	justify-content: center;
	align-items: center;

	background: var(--gray-light-theme-100);

	width: 100dvw;
	height: 100dvh;
}

.logo {
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translate3d(-50%, 0, 0);

	color: var(--accent-700);
	width: 200px;
}
</style>
