export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const waitFor = async (selector, timeout = 60000, interval = 500) => {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		const el = document.querySelector(selector);
		if (el) return el;
		await sleep(interval);
	}
	return null;
};

export const log = (str) => console.log(`[Reward]:`, str);
