<script lang="ts">
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let message = $state<string>('Ready');

	type BuyDirectPayload = {
		type: 'cart' | 'product';
		products: Array<{ variantId: string; quantity: number }>;
	};

	const payload: BuyDirectPayload = {
		type: 'product',
		products: [{ variantId: '45545087631491', quantity: 1 }]
	};

	const startCustomCheckout = () => {
		status = 'loading';
		message = 'Calling custom checkout...';

		const sellerDomain = (
			document.getElementById('sellerDomain') as HTMLInputElement | null
		)?.value?.trim();
		const buyDirect = window.shiprocketCheckoutEvents?.buyDirect;

		if (!sellerDomain) {
			status = 'error';
			message = 'Missing #sellerDomain hidden input value.';
			console.error('[playground] sellerDomain missing');
			return;
		}

		if (!buyDirect) {
			status = 'error';
			message = 'shiprocketCheckoutEvents.buyDirect is not available.';
			console.error('[playground] buyDirect missing');
			return;
		}

		try {
			console.info('[playground] invoking buyDirect', { sellerDomain, payload });
			buyDirect(payload);
			status = 'success';
			message = 'buyDirect called. Check checkout popup/redirect behavior.';
		} catch (error) {
			status = 'error';
			message = error instanceof Error ? error.message : 'buyDirect threw an unknown error.';
			console.error('[playground] buyDirect failed', error);
		}
	};
</script>

<section class="mx-auto max-w-xl space-y-6 px-6 py-16 font-dm-sans">
	<h1 class="text-3xl font-semibold text-gray-900">Custom Checkout Playground</h1>
	<p class="text-sm text-gray-600">
		This page calls <code>shiprocketCheckoutEvents.buyDirect</code> with a hardcoded payload only.
	</p>

	<div class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
		<pre>{JSON.stringify(payload, null, 2)}</pre>
	</div>

	<button
		class="rounded-full bg-zinc-800 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
		onclick={startCustomCheckout}
	>
		Buy (Hardcoded)
	</button>

	<p class="text-sm">
		<span class="font-semibold">Status:</span>
		{status}
	</p>
	<p class={`text-sm ${status === 'error' ? 'text-red-700' : 'text-gray-700'}`}>{message}</p>
</section>
