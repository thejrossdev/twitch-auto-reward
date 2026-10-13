import {loadSettings} from './utils.js';

const cfg = {
	clicker: {
		loadDelay: 1000,
		repeatDelay: 150
	},
	reward: {
		btnContainer: {
			s: '[data-test-selector="chat-input-buttons-container"]'
		},
		controls: {
			class: 'enable-auto-reward',
			s: '.enable-auto-reward'
		},
		rewardList: {
			s: '.rewards-list'
		},
		rewardOpenBtn: {
			s: '[data-test-selector="community-points-summary"] button'
		},
		redeemBtn: {
			s: '[data-test-selector="RewardText"],[data-test-selector="RequiredPoints"]'
		},
		closeBtn: {
			s: '#channel-points-reward-center-header'
		},
		rewardBtns: {
			s: (str) => `[title="${str}"]`
		},
		chatInput: {
			s: '[data-test-selector="chat-input"]'
		}
	},
	settings: loadSettings({
		rewards: {
			// 1 - Maliwan, 2 - miroichii
			lunite: ['Луна (Lunite Subscription) в Вуве', 'Луна (Lunite Subscription)'],
			music: ['музыка', 'Заказ музыки', 'Заказ трека', 'Заказать трек']
		}
	})
};

export default cfg;
