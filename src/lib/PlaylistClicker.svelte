<script>
	import {onDestroy} from 'svelte'
	import config from '../config.js'
	import {insertTextToChat, openAndFindReward, sendChatMessage} from '../twitch.js'
	import {log, parseURLs, saveSettings, sleep} from '../utils.js'

	let {openPopup, closePopup} = $props();

	let isEnabled = $state(false);
	let isRunning = $state(false);

	// there is format "text,text,text'
	let rewardSelectors = $state(config.settings?.rewards?.music.join(','));
	// there is format "[title="text"],[title="text"],[title="text"]'
	let readyRewardSelectors = $state(config.settings?.rewards?.music.map(
		/**
		 * @param reward {string}
		 */
		reward => config.reward.rewardBtns.s(reward)).join(','));
	/**
	 * @type {string}
	 */
	let prependText = $state(config.settings?.prependText?.music);

	let rawLinks = $state('');
	let parsedLinks = $state(config.settings?.lastMusic);

	$effect(() => {
		const rSelectors = rewardSelectors;
		const pText = prependText;

		if (config.settings) {
			config.settings.rewards.music = rSelectors.split(',').map(s => s.trim()).filter(Boolean);
			config.settings.prependText.music = pText;
			saveSettings(config.settings);
		}

		readyRewardSelectors = rSelectors.split(',').map(
			/**
			 * @param reward {string}
			 */
			reward => config.reward.rewardBtns.s(reward)).join(',');
	});

	let parseTimeout;
	$effect(() => {
		const text = rawLinks;

		if (parseTimeout) clearTimeout(parseTimeout);

		parseTimeout = setTimeout(() => {
			if (!text || !text.trim()) {
				parsedLinks = null;
			}

			const result = parseURLs(text)

			if (!result) {
				parsedLinks = null;
				return;
			}

			parsedLinks = result;
			config.settings.lastMusic = result
			saveSettings(config.settings);
		}, 500);

		return () => clearTimeout(parseTimeout);
	});

	async function redeemMusic(url) {
		// there is format "[title="text"],[title="text"],[title="text"]'
		await openAndFindReward(readyRewardSelectors);

		const finalUrl = prependText ? `${prependText.replace(/\r?\n|\r/, '')}${url}` : url;
		await insertTextToChat(finalUrl);
		await sleep(Math.floor(config.clicker.musicDelay / 2))
		await sendChatMessage();
	}

	async function action() {
		if (!isEnabled) {
			return;
		}

		await redeemMusic(parsedLinks.list[parsedLinks.ready]);

		parsedLinks.ready++;

		// Was last music, stop the loop
		if (parsedLinks.ready >= parsedLinks.total) {
			clear();
		}
	}

	async function runLoop() {
		if (isRunning) return;
		isRunning = true;

		while (isEnabled) {
			log('loop')
			await action();
			await new Promise(resolve => setTimeout(resolve, config.clicker.musicDelay));
		}
	}

	function toggle() {
		isEnabled = !isEnabled;
		if (isEnabled) {
			log('Music Enabled');
			closePopup();
			runLoop();
		} else {
			log('Music Disabled');
			isRunning = false;
		}
	}

	function clear() {
		isEnabled = false;
		isRunning = false;
		parsedLinks = null;
		rawLinks = '';
	}

	onDestroy(clear);
</script>

{#snippet playlistSettingsContent()}
	<div class="settings playlist-settings">
		<div class="setting-row">
			<label for="reward-selectors">
				Selectors for Rewards
				<i>Search reward by these words</i>
			</label>
			<input
				type="text"
				id="reward-selectors"
				bind:value={rewardSelectors}
				placeholder=". "
				disabled={isEnabled || isRunning}
			/>
		</div>
		<div class="setting-row">
			<label for="prepend-text">Symbol to prepend link
				<i>(for example silent messages)</i>
				<i>Leave empty for no prepend</i>
			</label>
			<input
				type="text"
				id="prepend-text"
				bind:value={prependText}
				placeholder=". "
				disabled={isEnabled || isRunning}
			/>
		</div>
		<div class="setting-row">
			<label for="message-text">List for Music rewards:</label>
			<span class="setting-row__description">
				Use next sites for lists from YT: <br/>
				<a href="https://www.playlistlengthcalc.com/youtube-playlist-link-extractor" target="_blank">playlistlengthcalc.com</a> - only txt (or copy all) <br/>
				<a href="https://scriptmind.co/youtube-playlist-exporter" target="_blank">scriptmind.co</a> - only json format <br/>
				Or paste URLs split by ","
			</span>
			<textarea
				id="message-text"
				bind:value={rawLinks}
				placeholder="https://www.youtube.com/watch?v=ZyXef3Nk3K4,https://www.youtube.com/watch?v=ZyXef3Nk3K4"
				rows="12"
				disabled={isEnabled || isRunning}
			>
			</textarea>
		</div>

		{#if parsedLinks !== null}
			<div class="setting-row">
				<p>Type: {parsedLinks.listType}</p>
			</div>
			<div class="setting-row">
				<p>Count: {parsedLinks.total}</p>
			</div>
		{/if}

		<div class="buttons-row">
			<button
				class="twitch-btn"
				onclick={toggle}
				disabled={(!parsedLinks || !parsedLinks.list || parsedLinks.list.length === 0) || (isEnabled || isRunning)}
			>
				Start
			</button>
		</div>
	</div>
{/snippet}

<div class="auto-playlist">
	<button
		class="twitch-btn {isEnabled ? 'enabled' : ''}"
		onclick={() => isEnabled ? toggle() : openPopup(playlistSettingsContent, 'Playlist Settings')}
		title="{isEnabled ? 'Disable Playlist' : 'Enable Playlist'}"
	>
		Playlist<span style="margin-left: 5px;">♫</span>
		{#if isEnabled && parsedLinks}
			<span style="margin-left: 5px; color: springgreen">{parsedLinks.ready}/{parsedLinks.total}</span>
		{/if}
	</button>
</div>

<style>
	.auto-playlist {
		margin: 0 5px;
	}

	.playlist-settings {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.setting-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.setting-row label {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
	}

	.setting-row label i {
		font-style: italic;
		font-weight: 400;
		color: var(--color-opac-w-7, rgba(255, 255, 255, 0.4));
		font-size: 0.85em;
		margin-left: 4px;
	}

	.setting-row__description {
		font-size: 12px;
		margin-top: -4px;
		margin-bottom: 2px;
	}

	.setting-row input, .setting-row textarea {
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #303032;
		background: #0e0e10;
		color: #fff;
		outline: none;
		max-width: 100%;
		font-family: inherit;
	}

	.setting-row textarea {
		min-width: 240px;
		resize: vertical;
	}

	.setting-row input:focus, .setting-row textarea:focus {
		border: 1px solid var(--color-background-button-primary-default, #9147ff);
	}

	.setting-row-checkbox {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.buttons-row {
		display: flex;
		gap: 10px;
		margin-top: 10px;
	}
</style>
