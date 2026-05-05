<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import {
		buildCartCheckoutProducts,
		cartOpen,
		cartState,
		closeCartDrawer,
		getCheckoutUrl,
		loadCart,
		removeLine,
		updateLineQuantity
	} from '$lib/stores/cart';
	import { onMount } from 'svelte';
	import RazorpayLogo from '$lib/assets/RazorpayLogo.svelte';

	onMount(() => {
		loadCart();
	});

	const formatMoney = (amount?: { amount: string; currencyCode: string }) => {
		if (!amount) return '';
		const parsed = Number.parseFloat(amount.amount);
		if (Number.isNaN(parsed)) return `${amount.currencyCode} ${amount.amount}`;

		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: amount.currencyCode
		}).format(parsed);
	};

	let checkoutMessage = $state<string | null>(null);
	let isCheckoutLoading = $state(false);
	type BuyDirectHandler = NonNullable<NonNullable<Window['shiprocketCheckoutEvents']>['buyDirect']>;

	const waitForCustomCheckout = async (timeoutMs = 2000) => {
		const existing: BuyDirectHandler | undefined = window.shiprocketCheckoutEvents?.buyDirect;
		if (existing) return existing;

		return await new Promise<BuyDirectHandler | null>((resolve) => {
			const interval = window.setInterval(() => {
				const handler: BuyDirectHandler | undefined = window.shiprocketCheckoutEvents?.buyDirect;
				if (handler) {
					window.clearInterval(interval);
					window.clearTimeout(timeout);
					resolve(handler);
				}
			}, 100);

			const timeout = window.setTimeout(() => {
				window.clearInterval(interval);
				resolve(null);
			}, timeoutMs);
		});
	};

	const toErrorMessage = (error: unknown, fallbackReason: string) =>
		error instanceof Error ? `${fallbackReason}: ${error.message}` : fallbackReason;

	const handleFallback = (fallbackReason: string, error?: unknown, details?: Record<string, unknown>) => {
		const checkoutUrl = getCheckoutUrl();
		console.error('[custom-checkout][cart] failed', {
			fallbackReason,
			error,
			checkoutUrlAvailable: Boolean(checkoutUrl),
			...details
		});
		checkoutMessage = toErrorMessage(error, fallbackReason);
	};

	const handleCheckout = async () => {
		checkoutMessage = null;
		const checkoutUrl = getCheckoutUrl();
		if (!checkoutUrl) {
			checkoutMessage = 'Checkout not available right now.';
			return;
		}

		const sellerDomain = (
			document.getElementById('sellerDomain') as HTMLInputElement | null
		)?.value?.trim();
		if (!sellerDomain) {
			handleFallback('Missing sellerDomain value for custom checkout.');
			return;
		}

		const products = buildCartCheckoutProducts($cartState.cart);
		if (!products.length) {
			handleFallback('No valid cart products found for custom checkout.', undefined, {
				cartLineCount: $cartState.cart?.lines?.length ?? 0
			});
			return;
		}

		isCheckoutLoading = true;
		try {
			const buyDirect = await waitForCustomCheckout(2000);
			if (!buyDirect) {
				handleFallback('Custom checkout API not loaded within 2000ms.', undefined, {
					payload: { type: 'cart', products }
				});
				return;
			}

			const payload: Parameters<BuyDirectHandler>[0] = {
				type: 'cart',
				products
			};

			console.info('[custom-checkout][cart] invoking buyDirect', {
				sellerDomain,
				payload
			});
			buyDirect(payload);
		} catch (error) {
			handleFallback('Custom checkout threw an error during buyDirect.', error, {
				payload: { type: 'cart', products }
			});
		} finally {
			isCheckoutLoading = false;
		}
	};
</script>

<div
	class={`fixed inset-0 z-100 font-dm-sans transition ${$cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
>
	<div
		class={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${$cartOpen ? 'opacity-100' : 'opacity-0'}`}
		role="button"
		tabindex="0"
		onclick={closeCartDrawer}
		onkeydown={(event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') closeCartDrawer();
		}}
	></div>

	<aside
		class={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-out ${$cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
		aria-label="Shopping cart"
	>
		<div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
			<div>
				<p class="text-lg font-semibold text-gray-900">Your Cart</p>
				{#if $cartState.status === 'loading'}
					<p class="text-12 text-gray-500">Updating...</p>
				{/if}
			</div>
			<button aria-label="Close cart" class="rounded p-2" onclick={closeCartDrawer}>✕</button>
		</div>

		{#if $cartState.cart && $cartState.cart.lines.length}
			<div class="flex h-[calc(100%-160px)] flex-col overflow-hidden">
				<div class="flex-1 space-y-4 overflow-y-auto px-5 py-4">
					{#each $cartState.cart.lines as line}
						<div class="flex gap-3 rounded-12 border border-gray-100 p-3">
							<div class="h-20 w-20 overflow-hidden rounded-10 bg-gray-100">
								{#if line.merchandise.image}
									<img
										src={line.merchandise.image.url}
										alt={line.merchandise.image.altText ?? line.merchandise.title}
										class="h-full w-full object-cover"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center text-12 text-gray-500">
										No image
									</div>
								{/if}
							</div>
							<div class="flex-1 space-y-1">
								<p class="text-15 font-semibold text-gray-900">{line.merchandise.productTitle}</p>
								<!-- <p class="text-14 text-gray-600">{line.merchandise.title}</p> -->
								<p class="text-14 font-medium text-gray-900">
									{formatMoney(line.merchandise.price)}
								</p>
								<div class="flex items-center gap-3">
									<div
										class="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1"
									>
										<button
											class="text-lg leading-none"
											aria-label="Decrease quantity"
											disabled={$cartState.status === 'loading'}
											onclick={() => updateLineQuantity(line.id, line.quantity - 1)}
										>
											-
										</button>
										<span class="text-14">{line.quantity}</span>
										<button
											class="text-lg leading-none"
											aria-label="Increase quantity"
											disabled={$cartState.status === 'loading'}
											onclick={() => updateLineQuantity(line.id, line.quantity + 1)}
										>
											+
										</button>
									</div>
									<button
										class="text-13 text-gray-500 underline"
										aria-label="Remove item"
										disabled={$cartState.status === 'loading'}
										onclick={() => removeLine(line.id)}
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="space-y-3 border-t border-gray-100 p-5">
					<div class="flex items-center justify-between text-16 font-semibold">
						<span>Subtotal</span>
						<span>{formatMoney($cartState.cart.cost.subtotal)}</span>
					</div>
					<button
						class="w-full rounded-full bg-zinc-80 px-4 py-3 text-16 font-semibold text-white shadow-sm hover:bg-zinc-80/90 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={$cartState.status === 'loading' || isCheckoutLoading || !$cartState.cart.checkoutUrl}
						onclick={handleCheckout}
					>
						{isCheckoutLoading ? 'Opening Checkout...' : 'Proceed to Checkout'}
					</button>
					<div class="flex gap-1 flex-wrap items-center">
						<p class="text-12 text-gray-500 ">Checkout is securely hosted by</p>
						<RazorpayLogo />
					</div>
				</div>
			</div>
		{:else}
			<div
				class="flex h-[calc(100%-64px)] flex-col items-center justify-center gap-4 px-5 text-center"
			>
				<SvgIcon icon="cart" className="h-10 w-10 text-gray-400" />
				<p class="text-16 font-semibold text-gray-800">Your cart is empty</p>
				<p class="text-14 text-gray-500">Add products to see them here.</p>
				<button
					class="rounded-full bg-zinc-80 px-5 py-2 text-14 font-semibold text-white shadow-sm hover:bg-zinc-80/90"
					onclick={closeCartDrawer}
				>
					Continue Shopping
				</button>
			</div>
		{/if}

		{#if $cartState.message || checkoutMessage}
			<div
				class="absolute right-4 bottom-3 left-4 rounded-10 bg-red-50 px-4 py-3 text-13 text-red-700"
			>
				<div>{$cartState.message ?? checkoutMessage}</div>
			</div>
		{/if}
	</aside>
</div>
