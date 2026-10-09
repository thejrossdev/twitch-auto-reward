// https://vite.dev/config/
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';
import {viteSingleFile} from 'vite-plugin-singlefile';

const buildParams = {
	cssMinify: true,
	minify: true,
	commonjsOptions: {
		transformMixedEsModules: true
	},
	terserOptions: {
		compress: true,
		mangle: true
	},
	outDir: '.',
	fileName: 'index.js'
};

export default defineConfig({
	plugins: [
		svelte(),
		monkey({
			entry: 'src/main.js',
			userscript: {
				name: 'TwitchAutoReward',
				version: '3.2',
				description: 'Automatic clicker to redeem the reward in twitch.tv.',
				author: 'https://github.com/jennifer-ross',
				match: ['https://twitch.tv/*', 'https://*.twitch.tv/*'],
				icon: 'https://www.google.com/s2/favicons?sz=64&domain=twitch.tv',
				updateURL:
					'https://raw.githubusercontent.com/thejrossdev/twitch-auto-reward/refs/heads/master/index.js',
				downloadURL:
					'https://raw.githubusercontent.com/thejrossdev/twitch-auto-reward/refs/heads/master/index.js',
				supportURL: 'https://github.com/thejrossdev/twitch-auto-reward/issues',
				'run-at': 'document-end',
				grant: [
					'GM_setValue',
					'GM_getValue',
					'GM.setValue',
					'GM.getValue',
					'GM_setClipboard',
					'unsafeWindow',
					'window.close',
					'window.focus',
					'window.onurlchange'
				],
				license: 'MIT'
			},
			build: buildParams
		}),
		viteSingleFile({
			removeViteModuleLoader: true
		})
	],
	rollupOptions: {
		output: {
			manualChunks: false,
			inlineDynamicImports: true,
			entryFileNames: '[name].js',
			assetFileNames: '[name].[ext]'
		}
	},
	build: buildParams
});
