<script>
	import CloseIcon from './lib/icons/CloseIcon.svelte'
	import LuniteClicker from './lib/LuniteClicker.svelte'
	import PlaylistClicker from './lib/PlaylistClicker.svelte'
	import Popup from './lib/Popup.svelte'

	let isPopupOpen = $state(false);
	let popupContent = $state(null);
	let popupTitle = $state('');
	let isHidden = $state(false);

	function hide() {
		isHidden = true;
	}

	function openPopup(contentSnippet, contentTitle = '') {
		popupContent = contentSnippet;
		popupTitle = contentTitle;
		isPopupOpen = true;
	}

	function closePopup() {
		isPopupOpen = false;
		popupContent = null;
	}
</script>

<div class="auto-reward-container {isHidden ? 'reward-hidden' : ''}">
	{#if !isHidden}
		<LuniteClicker/>
		<PlaylistClicker openPopup={openPopup}/>

		<div class="auto-reward-controls">
			<button class="twitch-btn" onclick={hide} title="Hide all">
				<CloseIcon/>
			</button>
		</div>

		<Popup isOpen={isPopupOpen} onClose={closePopup} title={popupTitle}>
			{@render popupContent?.()}
		</Popup>
	{/if}
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
