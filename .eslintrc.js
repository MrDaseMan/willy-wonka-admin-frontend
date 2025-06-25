module.exports = {
	root: true, // Корневой файл конфигурации

	// Определяем окружение: код работает и в браузере, и в Node.js (Nuxt SSR)
	env: {
		browser: true,
		node: true
	},

	// Определяем парсер (поддержка Vue + TypeScript)
	parser: 'vue-eslint-parser',

	parserOptions: {
		parser: '@typescript-eslint/parser', // Используем парсер TypeScript
		sourceType: 'module' // Поддержка ES-модулей (import/export)
	},

	// Подключаем рекомендуемые конфигурации (всё повышено до рекомендуемых)
	extends: [
		'eslint:recommended',
		'plugin:nuxt/recommended',
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'@nuxtjs/eslint-config-typescript',
		'plugin:prettier/recommended'
	],

	plugins: ['vue', '@typescript-eslint', 'prettier'],

	// Игнорируем файлы
	ignorePatterns: ['*.test.js', 'node_modules', 'dist', '_old/**'],

	rules: {
		// Форматирование
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto'
			}
		],

		// Общие правила
		'no-console': ['warn', { allow: ['warn', 'error'] }], // Разрешаем console.warn и console.error, но запрещаем console.log
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // Запрещает `debugger` в продакшене
		'no-irregular-whitespace': 'off', // TODO: Возможно, стоит отказаться от разрешения неразрывных пробелов

		// Поддержка <script setup>
		'vue/script-setup-uses-vars': 'error',

		// Vue-специфичные правила
		'vue/no-parsing-error': 'error', // Проверяет синтаксис
		'vue/attribute-hyphenation': ['error', 'always'], // Всегда kebab-case в атрибутах
		'vue/no-side-effects-in-computed-properties': 'error', // Предотвращает изменение состояния в computed свойствах

		// Компоненты в <template> должны быть PascalCase
		'vue/component-name-in-template-casing': [
			'error',
			'PascalCase',
			{ registeredComponentsOnly: true, ignores: ['/^el-/'] }
		],

		'vue/html-indent': ['error', 'tab'], // Отступы табами во vue файлах
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'always',
					normal: 'always',
					component: 'always'
				}
			}
		],

		// Оптимизируем порядок атрибутов в Vue
		'vue/attributes-order': [
			'warn',
			{
				order: [
					'CONDITIONALS', // `v-if`, `v-else-if`, `v-else`, `v-show`, `v-cloak`
					'TWO_WAY_BINDING', // `v-model`
					'CONTENT', // `v-html`, `v-text`
					'RENDER_MODIFIERS', // `v-pre`, `v-once`
					'OTHER_DIRECTIVES', // `v-custom-directive`
					'LIST_RENDERING', // `v-for`
					'DEFINITION', // `is`, `data`
					['UNIQUE', 'SLOT'], // `ref`, `slot`, `name`, `key`
					'GLOBAL', // `id`
					'ATTR_DYNAMIC', // 'v-bind:prop="foo"', ':prop="foo"'
					'ATTR_STATIC', // 'prop="foo"', 'custom-prop="foo"'
					'ATTR_SHORTHAND_BOOL', // 'boolean-prop'
					'EVENTS' // `@click`, `@input`
				],
				alphabetical: false
			}
		],

		//  Ошибка на неиспользуемые переменные, кроме тех, что начинаются с `_`
		'no-unused-vars': [
			'warn',
			{
				vars: 'all', // Проверять все переменные (глобальные, локальные, импортированные)
				args: 'all', // Проверять аргументы функций
				argsIgnorePattern: '^_', // Игнорировать аргументы, начинающиеся с `_`
				varsIgnorePattern: '^_', // Игнорировать переменные, начинающиеся с `_`
				caughtErrors: 'all', // Проверять переменные в `catch(error)`
				caughtErrorsIgnorePattern: '^_' // Игнорировать `catch(error)`, если `error` начинается с `_`
			}
		],

		'no-unused-expressions': 'error', // Ошибка, если функция объявлена, но не используется
		'@typescript-eslint/no-unused-vars': [
			// Ошибка, если есть неиспользуемые приватные поля в классах
			'warn',
			{
				vars: 'all',
				args: 'all',
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_'
			}
		],

		// Импорты
		'import/order': [
			'error',
			{
				groups: [
					['builtin', 'external'], // Сначала пакеты (Node.js + npm-пакеты)
					['object'], // Затем импорты объектов (e.g., import * as XYZ from 'module')
					['internal', 'parent', 'sibling', 'index'], // Затем локальные файлы
					['type'] // Затем импорты типов (import type ...)
				],
				'newlines-between': 'always'
			}
		],

		// Форматирование
		semi: ['error', 'never'], // Запрещаем ;

		// TODO: Разобраться с тернарками
		indent: [
			'warn',
			'tab',
			{
				SwitchCase: 1,
				offsetTernaryExpressions: false,
				flatTernaryExpressions: true,
				ignoredNodes: ['ConditionalExpression', 'LogicalExpression'],
				ignoreComments: true
			}
		], // Отступы табами, case с доп. отступом
		'arrow-parens': ['error', 'always'], // Всегда () => {} (даже если один аргумент)
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always', // Увы, prettier настаивает, что так лучше
				named: 'never',
				asyncArrow: 'always'
			}
		],

		//  Улучшенные правила Nuxt/Vue 3
		'vue/multi-word-component-names': 0,
		'vue/no-reserved-component-names': 0
	}
}
