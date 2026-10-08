<script>
	import {onDestroy} from 'svelte'
	import config from '../config.js'
	import {log, waitFor} from '../utils';

	let enabled = false;
	let intervalId = null;

	async function action() {
		const {reward} = config;
		const {rewardOpenBtn, rewardList, rewardBtns, redeemBtn} = reward;

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
		const rewardBtnEl = await waitFor(rewardBtns.s, config.clicker.loadDelay);

		if (!rewardBtnEl) {
			return;
		}

		/** @type {HTMLButtonElement | null} */
		const btn = rewardBtnEl.parentElement.parentElement.querySelector('button');
		btn.click();

		// Wait for loading the redeem button
		const redeemBtnTargetEl = await waitFor(redeemBtn.s, config.clicker.loadDelay);

		if (!redeemBtnTargetEl) {
			return;
		}

		/** @type {HTMLButtonElement | null} */
		const redeemBtnEl = redeemBtnTargetEl.parentElement.parentElement.parentElement.parentElement;

		if (redeemBtnEl.disabled) {
			const closeBtn = document
			.querySelector(reward.closeBtn.s)
			.nextElementSibling.nextElementSibling.querySelector('button');
			closeBtn.click();
			return false;
		} else {
			redeemBtnEl.click();
		}
	}

	function toggle() {
		enabled = !enabled;
		if (enabled) {
			log('enabled');
			intervalId = setInterval(action, config.clicker.repeatDelay);
		} else {
			log('disabled');
			if (intervalId) clearInterval(intervalId);
		}
	}

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<button
	class="twitch-btn {enabled ? 'enabled' : ''}"
	on:click={toggle}
	title="{enabled ? 'Disable Reward' : 'Enable Reward'}"
>
	Reward
	{#if enabled}
		<span style="margin-left: 5px; color: springgreen">☑</span>
	{/if}
</button>

<style>
</style>
