import { mount } from 'svelte';
import App from './App.svelte';
import { log, waitFor } from './utils';

async function run() {
	const btnContainer = await waitFor('[data-test-selector="chat-input-buttons-container"]', 60000);
	if (!btnContainer) {
		log('chat input buttons container not found, aborting');
		return;
	}

	const host = document.createElement('div');
	host.style.display = 'inline-flex';
	host.style.width = '100%';
	btnContainer.prepend(host);

	const app = mount(App, {
		target: host,
	});
}

// Проверка URL (не на главной странице)
if (location.pathname !== '/' && location.pathname !== '') {
	setTimeout(run, 5000);
}
