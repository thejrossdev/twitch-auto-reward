import config from './config.js'
import {waitFor} from './utils.js'

const {reward} = config;
const {rewardOpenBtn, rewardList, redeemBtn} = reward;


// Find close button and close the popup reward. Can find only after render Reward list
export const closeReward = async () => {
	const closeBtn = document
	.querySelector(config.reward.closeBtn.s)
	.nextElementSibling.nextElementSibling.querySelector('button');
	closeBtn.click();
}

export const openReward = async () => {
	/** @type {HTMLButtonElement | null} */
	const rewardOpenBtnEl = document.querySelector(rewardOpenBtn.s);

	if (!rewardOpenBtnEl) {
		return false;
	}

	rewardOpenBtnEl.click();

	// Wait for loading list of available rewards
	const rewardListEl = await waitFor(rewardList.s, config.clicker.loadDelay);

	if (!rewardListEl) {
		return false;
	}

	return true;
}

export const redeemReward = async (selectors) => {
	// Wait for loading the reward for redeem
	const rewardBtnEl = await waitFor(selectors, config.clicker.loadDelay);

	if (!rewardBtnEl) {
		return false;
	}

	/** @type {HTMLButtonElement | null} */
	const btn = rewardBtnEl.parentElement.parentElement.querySelector('button');

	if (!btn) {
		await closeReward();
		return false;
	}

	rewardBtnEl.scrollIntoView({behavior: 'instant', block: 'end', inline: 'end'});
	btn.click();

	// Wait for loading the redeem button
	const redeemBtnTargetEl = await waitFor(redeemBtn.s, config.clicker.loadDelay);

	if (!redeemBtnTargetEl) {
		await closeReward();
		return false;
	}

	/** @type {HTMLButtonElement | null} */
	const redeemBtnEl = redeemBtnTargetEl.parentElement.parentElement.parentElement.parentElement;

	if (!redeemBtnEl) {
		await closeReward();
		return false;
	}

	if (redeemBtnEl.disabled) {
		await closeReward();
		return false;
	} else {
		redeemBtnEl.click();
		return true;
	}
}

export const openAndRedeemReward = async (selectors) => {
	const isOpen = await openReward();
	if (isOpen) {
		await redeemReward(selectors);
	}
}
