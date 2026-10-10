<script>
	import {onDestroy} from 'svelte'
	import config from '../config.js'
	import {log, waitFor} from '../utils';

	let isEnabled = $state(false);
	let isRunning = $state(false);
	let rewardSelector = config.settings?.rewards.map(
		/**
		 * @param reward {string}
		 */
		reward => config.reward.rewardBtns.s(reward)).join(',');

	// Find close button and close the popup reward. Can find only after render Reward list
	async function closeReward() {
		const closeBtn = document
		.querySelector(config.reward.closeBtn.s)
		.nextElementSibling.nextElementSibling.querySelector('button');
		closeBtn.click();
	}

	async function action() {
		const {reward} = config;
		const {rewardOpenBtn, rewardList, redeemBtn} = reward;

		/** @type {HTMLButtonElement | null} */
		const rewardOpenBtnEl = document.querySelector(rewardOpenBtn.s);

		if (!rewardOpenBtnEl) {
			return;
		}

		rewardOpenBtnEl.click();

		// Wait for loading list of available rewards
		const rewardListEl = await waitFor(rewardList.s, config.clicker.loadDelay);

		if (!rewardListEl) {
			return;
		}

		// Wait for loading the reward for redeem
		const rewardBtnEl = await waitFor(rewardSelector, config.clicker.loadDelay);

		if (!rewardBtnEl) {
			return false;
		}

		/** @type {HTMLButtonElement | null} */
		const btn = rewardBtnEl.parentElement.parentElement.querySelector('button');

		if (!btn) {
			await closeReward();
			return;
		}

		rewardBtnEl.scrollIntoView({behavior: 'instant', block: 'end', inline: 'end'});
		btn.click();

		// Wait for loading the redeem button
		const redeemBtnTargetEl = await waitFor(redeemBtn.s, config.clicker.loadDelay);

		if (!redeemBtnTargetEl) {
			await closeReward();
			return;
		}

		/** @type {HTMLButtonElement | null} */
		const redeemBtnEl = redeemBtnTargetEl.parentElement.parentElement.parentElement.parentElement;

		if (!redeemBtnEl) {
			await closeReward();
			return;
		}

		if (redeemBtnEl.disabled) {
			await closeReward();
		} else {
			redeemBtnEl.click();
		}
	}

	async function runLoop() {
		if (isRunning) return;
		isRunning = true;

		while (isEnabled) {
			await action();
			await new Promise(resolve => setTimeout(resolve, config.clicker.repeatDelay));
		}
	}

	function toggle() {
		isEnabled = !isEnabled;
		if (isEnabled) {
			log('Enabled');
			runLoop();
		} else {
			log('Disabled');
			isRunning = false;
		}
	}

	onDestroy(() => {
		isEnabled = false;
		isRunning = false;
	});
</script>

<button
	class="twitch-btn {isEnabled ? 'enabled' : ''}"
	onclick={toggle}
	title="{isEnabled ? 'Disable Reward' : 'Enable Reward'}"
>
	Reward
	{#if isEnabled}
		<span style="margin-left: 5px; color: springgreen">☑</span>
	{/if}
</button>

<style>
</style>
