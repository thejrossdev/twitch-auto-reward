<script>
	import Clicker from './lib/Clicker.svelte'

	let isHidden = false;

	function hide() {
		isHidden = true;
	}
</script>

<div class="auto-reward-container {isHidden ? 'reward-hidden' : ''}">
	<Clicker/>
	<div class="auto-reward-controls">
		<button class="twitch-btn" on:click={hide} title="Hide all">
			<svg aria-hidden="true" fill="#fff" focusable="false" height="18px" role="presentation" viewBox="0 0 24 24"
				 width="18px">
				<path
					d="M6.414 5 5 6.414l5.588 5.588L5 17.59l1.414 1.414 5.588-5.588 5.588 5.588 1.414-1.414-5.588-5.588 5.588-5.588L17.59 5l-5.588 5.588L6.414 5Z"></path>
			</svg>
		</button>
	</div>
</div>

<style>
	.auto-reward-container {
		display: inline-flex;
		justify-content: space-between;
		width: 100%;
		padding-top: 10px;
		margin-top: 10px;
		border-top: 1px solid rgba(255, 255, 255, 0.22);
	}

	.auto-reward-controls {
		margin-left: auto;
	}

	.reward-hidden {
		display: none;
		visibility: hidden;
		opacity: 0;
	}

	:global(.twitch-btn) {
		display: inline-flex;
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		user-select: none;
		transition: background-color 0.2s ease;
		cursor: pointer;
		border: none;
		border-radius: 16px;
		background-color: var(--color-background-button-secondary-default, rgba(83, 83, 95, 0.38));
		padding: 6px 12px;
		color: var(--color-text-button-primary, #fff);
		font-weight: 600;
	}

	:global(.twitch-btn:hover) {
		background-color: var(--color-background-button-secondary-hover, rgba(83, 83, 95, 0.38));
	}

	:global(.twitch-btn.accent) {
		background-color: var(--color-background-button-primary-default, #9147ff);
	}

	:global(.twitch-btn.accent:hover) {
		background-color: var(--color-background-button-primary-hover, #772ce8);
	}

	:global(.twitch-btn.enabled) {
		box-shadow: 0 0 5px rgba(145, 71, 255, 0.6);
		background-color: var(--color-background-button-primary-hover, #772ce8);
	}
</style>
