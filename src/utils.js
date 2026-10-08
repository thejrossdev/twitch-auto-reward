export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const log = (str) => console.log(`[Reward]:`, str);

export const err = (str) => console.error(`[Reward]:`, str);

export const waitFor = async (selector, timeout = 60000, interval = 500) => {
	const start = Date.now();
	log(`wait for: ${selector}`);
	while (Date.now() - start < timeout) {
		const el = document.querySelector(selector);
		if (el) return el;
		await sleep(interval);
	}
	return null;
};

const SETTINGS_KEY = 'twitchAutoRewardSettings';

export const saveSettings = (value) => {
	try {
		const serialized = JSON.stringify(value);
		localStorage.setItem(SETTINGS_KEY, serialized);
	} catch (e) {
		err('Fail to save settings:', e);
	}
};

export const loadSettings = (defaultValue = {}) => {
	try {
		const serialized = localStorage.getItem(SETTINGS_KEY);
		if (serialized === null) {
			return defaultValue;
		}
		return JSON.parse(serialized);
	} catch (e) {
		err('Fail to load settings:', e);
		return defaultValue;
	}
};

export const saveSettingsGM = (value) => {
	GM_setValue(SETTINGS_KEY, JSON.stringify(value));
};

export const loadSettingsGM = (defaultValue = {}) => {
	const data = GM_getValue(SETTINGS_KEY);
	return data ? JSON.parse(data) : defaultValue;
};
