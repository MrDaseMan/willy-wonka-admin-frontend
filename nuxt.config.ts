import 'dotenv/config'

export default defineNuxtConfig({
	$development: {
		devtools: {
			enabled: true,

			timeline: {
				enabled: true
			}
		}
	},

	app: {
		rootId: 'willy-wonka'
	},

	typescript: {
		typeCheck: true
	},

	css: [
		'~/assets/scss/_global.scss',
		'~/assets/scss/_root.scss',
		'~/assets/scss/_transitions.scss'
	],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/assets/scss/_index.scss" as *;`
				}
			}
		}
	},

	// serverMiddleware: [logger({ format: '%date %status %method %url (%time)' })],

	imports: {
		dirs: ['store/**/*.{ts,js,mjs,mts}', 'composables/**/use*.{ts,js,mjs,mts}']
	},

	runtimeConfig: {
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL ?? 'unknown'
		}
	},

	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],

	image: {
		provider: 'ipx',
		dir: 'public'
	},

	modules: [
		'@nuxt/test-utils/module',
		[
			'@pinia/nuxt',
			{
				autoImports: ['defineStore', 'acceptHMRUpdate']
			}
		],
		'@nuxtjs/device',
		'@element-plus/nuxt',
		'nuxt-icons',
		'@nuxt/image'
	],
	elementPlus: {
		defaultLocale: 'ru', // TODO: не работает, как минимум, для дейтпикера
		importStyle: 'scss',
		icon: 'ElIcon'
	},

	compatibilityDate: '2025-04-07'
})
