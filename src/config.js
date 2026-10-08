const cfg = {
	clicker: {
		loadDelay: 200,
		repeatDelay: 350
	},
	reward: {
		btnContainer: {
			s: '[data-test-selector="chat-input-buttons-container"]',
		},
		controls: {
			class: 'enable-auto-reward',
			s: '.enable-auto-reward',
		},
		rewardList: {
			s: '.rewards-list',
		},
		rewardOpenBtn: {
			s: '[data-test-selector="community-points-summary"] button',
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
	}
}

export default cfg
