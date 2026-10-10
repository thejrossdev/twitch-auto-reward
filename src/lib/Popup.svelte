<script>
	let {
		isOpen = false, title = '', onClose = () => {
		}, children
	} = $props();

	/** @param {KeyboardEvent} event */
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown}/>

{#if isOpen}
	<div
		class="tm-overlay"
		onclick={() => onClose()}
		role="presentation"
	></div>

	<div class="tm-popup" role="dialog" aria-modal="true">
		<div class="tm-popup-header">
			<h3>{title}</h3>
			<button class="tm-close-btn" onclick={() => onClose()}>
				✕
			</button>
		</div>
		<div class="tm-popup-body">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.tm-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		z-index: 999998;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(2px);
	}

	.tm-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #18181b;
		color: #efeff1;
		border: 1px solid #303032;
		border-radius: 8px;
		width: 325px;
		max-width: 90vw;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		z-index: 999999;
		font-family: 'Inter', 'Roobert', sans-serif;
	}

	.tm-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		border-bottom: 1px solid #303032;
	}

	.tm-popup-header h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 700;
	}

	.tm-close-btn {
		background: transparent;
		border: none;
		color: #adadb8;
		font-size: 18px;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}

	.tm-close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.tm-popup-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
</style>
