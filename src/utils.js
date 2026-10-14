export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const log = (str) => console.log(`[Reward]:`, str);

export const err = (str) => console.error(`[Reward]:`, str);

export const waitFor = async (selector, timeout = 60000, interval = 500) => {
	const start = Date.now();
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

/**
 * Parse YT urls from string
 * @param strURLs {string}
 * @returns {$ObjMap | boolean}
 */
export const parseURLs = (strURLs) => {
	if (!strURLs || typeof strURLs !== 'string' || !strURLs.trim()) {
		return false;
	}

	const ytRegex = /https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/gi;

	// scriptmind.co (JSON format)
	try {
		const jsonURLs = JSON.parse(strURLs);
		if (jsonURLs && jsonURLs.hasOwnProperty('tool') && jsonURLs.tool !== 'playlist-exporter') {
			return false;
		}

		if (jsonURLs && jsonURLs.tool === 'playlist-exporter') {
			const urls = (jsonURLs.playlists || []).map(music => music.url).filter(Boolean);
			return {
				ready: 0,
				total: urls.length,
				listType: 'scriptmind.co',
				list: urls
			};
		}
	} catch (e) {
	}


	// playlistlengthcalc.com
	try {
		if (strURLs.includes('\n')) {
			const urls = strURLs.match(ytRegex);

			if (urls && urls.length > 0) {
				return {
					ready: 0,
					total: urls.length,
					listType: 'playlistlengthcalc.com',
					list: urls
				};
			}
		}
	} catch (e) {
	}

	// default split by ","
	try {
		const urls = strURLs.match(ytRegex);
		if (urls && urls.length > 0) {
			return {
				ready: 0,
				total: urls.length,
				listType: 'default',
				list: urls
			};
		}
	} catch (e) {
	}

	return false;
}
