<template>
	<div class="main-page">
		<template v-if="status === 'success'">
			<MachineCard
				v-for="machine in machines"
				:key="machine.id"
				:data="machine"
			/>
		</template>
		<div class="main-page__loader" v-else>
			<CircleLoader />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Machine } from "~/types/machine";

const { $api } = useNuxtApp();

const { data: machines, status } = await useAsyncData<Array<Machine>>(
	() =>
		$api("/equipments", {
			method: "GET",
		}),
	{
		dedupe: "defer",
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
