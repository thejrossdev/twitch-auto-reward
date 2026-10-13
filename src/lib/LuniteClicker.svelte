<script>
	import {onDestroy} from 'svelte'
	import config from '../config.js'
	import {openAndRedeemReward} from '../twitch'
	import {log} from '../utils';

	let isEnabled = $state(false);
	let isRunning = $state(false);
	let rewardSelector = config.settings?.rewards?.lunite.map(
		/**
		 * @param reward {string}
		 */
		reward => config.reward.rewardBtns.s(reward)).join(',');

	async function action() {
		await openAndRedeemReward(rewardSelector);
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
