import config from './config.js'
import {err, waitFor} from './utils.js'

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

export const findReward = async (selectors) => {
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

	return true;
}

export const redeemReward = async (selectors) => {
	const isFindReward = findReward(selectors);

	if (!isFindReward) {
		return false;
	}

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

export const openAndFindReward = async (selectors) => {
	const isOpen = await openReward();
	if (isOpen) {
		await findReward(selectors);
	}
}

export const insertTextToChat = async (messageText) => {
	/** @type {HTMLTextAreaElement | null} */
	const chatInput = document.querySelector(config.reward.chatInput.s);
	if (!chatInput) {
		err('cant find input field');
		await closeReward();
		return false;
	}

	//  Be sure to focus on the input field
	chatInput.focus();

	// Select all the current text using the standard Selection API
	const range = document.createRange();
	range.selectNodeContents(chatInput);
	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	// We simulate pressing the Backspace key to delete the selected text
	chatInput.dispatchEvent(new InputEvent('beforeinput', {
		bubbles: true,
		cancelable: true,
		inputType: 'deleteContentBackward'
	}));

	// We simulate text input (this is the event that Slate.js correctly captures)
	chatInput.dispatchEvent(new InputEvent('beforeinput', {
		bubbles: true,
		cancelable: true,
		inputType: 'insertText',
		data: messageText
	}));

	// Fallback input event for some editor versions
	chatInput.dispatchEvent(new InputEvent('input', {
		bubbles: true,
		cancelable: true,
		inputType: 'insertText',
		data: messageText
	}));
}

export const sendChatMessage = async () => {
	const chatInput = document.querySelector(config.reward.chatInput.s);
	if (!chatInput) return;

	chatInput.focus();

	// keyCode 13 is the Enter key. It's needed for legacy checks within React/Slate
	const enterEvent = new KeyboardEvent('keydown', {
		bubbles: true,
		cancelable: true,
		key: 'Enter',
		code: 'Enter',
		keyCode: 13,
		which: 13
	});

	chatInput.dispatchEvent(enterEvent);
}
