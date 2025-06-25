<template>
	<NuxtLayout>
		<NuxtLoadingIndicator />
		<NuxtPage />
	</NuxtLayout>
</template>

<style lang="scss">
*:not(:is(font)) {
	box-sizing: border-box;
	// color: var(--clr-glyph-body);
	font-family: "Inter", sans-serif;
	font-size: var(--font-size-medium);
	font-style: normal;
	font-weight: 500;
	line-height: 100%; /* 20px */
	letter-spacing: -0.006em;
	color: var(--clr-glyph-title);

	text-wrap: wrap;

	// overflow-wrap: anywhere;
}
</style>
