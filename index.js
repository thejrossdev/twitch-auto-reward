// ==UserScript==
// @name         TwitchAutoReward
// @version      1.1
// @description  Automatic click to reward
// @author       https://github.com/jennifer-ross
// @match        https://twitch.tv/*
// @match        https://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @updateURL    https://raw.githubusercontent.com/thejrossdev/twitch-auto-reward/refs/heads/master/index.js
// @downloadURL  https://raw.githubusercontent.com/thejrossdev/twitch-auto-reward/refs/heads/master/index.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @license      MIT
// ==/UserScript==

'use strict';

function GM_addStyle(css) {
	const style = document.getElementById('GM_addStyleBy8626') || (function () {
		const style = document.createElement('style');
		style.type = 'text/css';
		style.id = 'GM_addStyleBy8626';
		document.head.appendChild(style);
		return style;
	})();
	const sheet = style.sheet;
	sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

const run = async () => {
	const log = (str) => console.log(`[Reward]:`, str);
	const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	
	const reward = {
		btnContainer: {
			s: '[data-test-selector="chat-input-buttons-container"]',
			el: null
		},
		controls: {
			class: 'enable-auto-reward',
			s: '.enable-auto-reward',
			el: null,
			state: {
				enabled: false
			}
		},
		rewardList: {
			s: '.rewards-list',
			el: null
		},
		rewardOpenBtn: {
			s: '[data-test-selector="community-points-summary"] button',
			el: null
		},
		redeemBtn: {
			s: '[data-test-selector="RewardText"],[data-test-selector="RequiredPoints"]'
		},
		closeBtn: {
			s: '#channel-points-reward-center-header'
		},
		rewardBtns: {
			s: '[title="Луна (Lunite Subscription)"]',
			els: []
		},
		clicker: {
			id: null
		}
	};
	window.reward = reward;
	
	const onClickControls = (e) => {
		const enabledClass = 'auto-reward-enabled';
		const {target} = e;
		
		if (!target.classList.contains(reward.controls.class)) {
			return;
		}
		
		if (target.classList.contains(enabledClass)) {
			target.classList.remove(enabledClass);
			reward.controls.state.enabled = false;
			log('disabled');
			clicker(true);
		} else {
			log('enabled');
			target.classList.add(enabledClass);
			reward.controls.state.enabled = true;
			clicker(false);
		}
	}
	const clicker = (stop) => {
		if (reward.clicker.id) {
			clearInterval(reward.clicker.id);
		}
		
		if (stop) return false;
		
		reward.clicker.id = setInterval(async () => {
			if (!reward.rewardOpenBtn.el) {
				reward.rewardOpenBtn.el = document.querySelector(reward.rewardOpenBtn.s);
			}
			reward.rewardOpenBtn.el.click();
			await sleep(50);
			reward.rewardList.el = document.querySelector(reward.rewardList.s);
			if (!reward.rewardList.el) return false;
			reward.rewardBtns.els = document.querySelectorAll(reward.rewardBtns.s);
			if (reward.rewardBtns.els.length <= 0) return false;
			
			for (const p of reward.rewardBtns.els) {
				const btn = p.parentElement.parentElement.querySelector('button')
				btn.click();
				await sleep(50);
				const redeemBtnEl = document.querySelector(reward.redeemBtn.s).parentElement.parentElement.parentElement.parentElement;
				
				if (redeemBtnEl.disabled) {
					const closeBtn = document.querySelector(reward.closeBtn.s).nextElementSibling.nextElementSibling.querySelector('button');
					closeBtn.click();
					return false;
				} else {
					redeemBtnEl.click();
				}
			}
		}, 350)
	}
	const createControls = () => {
		let div = document.createElement('div');
		div.style.margin = '15px 15px';
		div.style.display = 'inline-flex';
		div.style.width = '100%';
		
		div.innerHTML = `<button class="ScCoreButton-sc-ocjdkq-0 jRpFkX InjectLayout-sc-1i43xsx-0 ${reward.controls.class}" style="padding: 0 15px;">Reward</button>`;
		reward.btnContainer.el.prepend(div);
		
		reward.controls.el = document.querySelector(reward.controls.s);
		reward.controls.el.addEventListener('click', onClickControls);
		
		GM_addStyle('.auto-reward-enabled { background-color: var(--color-background-button-primary-hover); }');
	}
	
	await sleep(3000);
	
	for (; ;) {
		if (!reward.btnContainer.el) {
			reward.btnContainer.el = document.querySelector(reward.btnContainer.s);
			continue;
		} else {
			createControls();
			await sleep(1000);
			break;
		}
		
		await sleep(2000);
	}
	
	log(reward);
}

setInterval(() => {
	run();
}, 5000)
