import {mount} from 'svelte';
import App from './App.svelte';
import config from './config.js'
import {log, waitFor} from './utils';

const HOST_ID = 'twitch-auto-reward-host';
const CONTAINER_SELECTOR = config.reward.btnContainer.s;

let currentApp = null;

function injectApp() {
	const btnContainer = document.querySelector(CONTAINER_SELECTOR);
	if (!btnContainer) return;

	if (btnContainer.querySelector(`#${HOST_ID}`)) return;

	if (currentApp) {
		try {
			unmount(currentApp);
		} catch (e) {
		}
		currentApp = null;
	}

	const host = document.createElement('div');
	host.id = HOST_ID;
	host.style.display = 'inline-flex';
	host.style.width = '100%';
	btnContainer.prepend(host);

	currentApp = mount(App, {
		target: host
	});
}


async function run() {
	const btnContainer = await waitFor(CONTAINER_SELECTOR, 60000);
	if (!btnContainer) {
		log('chat input buttons container not found, aborting');
		return;
	}

	// First mount
	injectApp();

	let debounceTimer = null;
	const observer = new MutationObserver(() => {
		if (debounceTimer) return;
		debounceTimer = setTimeout(() => {
			injectApp();
			debounceTimer = null;
		}, 200);
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}

// Проверка URL (не на главной странице)
if (location.pathname !== '/' && location.pathname !== '') {
	setTimeout(run, 5000);
}
