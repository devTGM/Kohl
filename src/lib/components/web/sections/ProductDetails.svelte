<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import type { ShopifyPrice, ShopifyProduct, ShopifyVariant } from '$lib/types/shopify';
	import { slide } from 'svelte/transition';
	import { addLineToCart, getCheckoutUrl, openCartDrawer, toNumericVariantId } from '$lib/stores/cart';
	import gsap from 'gsap';
	import StickyProductBar from '$lib/components/StickyProductBar.svelte';
	import { onMount } from 'svelte';
	import States from '$lib/components/web/sections/States.svelte';

	let {
		product = null,
		shopifyReady = true,
		error = null,
		reviewSummary = null,
		reviewCount = 0
	} = $props<{
		product: ShopifyProduct | null;
		shopifyReady: boolean;
		error: string | null;
		reviewSummary?: { average: number; total: number } | null;
		reviewCount?: number;
	}>();

	const benefits = [
		{ label: 'Brightens', icon: 'brightness' },
		{ label: 'Evens Tone', icon: 'tone' },
		{ label: 'Repair', icon: 'repair' },
		{ label: 'Shields', icon: 'shield' }
	];

	let selectedImageIndex = $state(0);
	let imageWrapper = $state<HTMLDivElement | null>(null);
	let stickySentinel: HTMLDivElement | null = null;
	let showStickyBar = $state(false);
	let activeTab = $state<string>('description');
	let selectedVariantId = $state<string | null>(null);
	let addStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let addMessage = $state<string | null>(null);
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

	const handleFallback = (fallbackReason: string, error?: unknown, details?: Record<string, unknown>) => {
		console.error('[custom-checkout][product] failed', {
			fallbackReason,
			error,
			...details
		});
		addStatus = 'error';
		addMessage = error instanceof Error ? `${fallbackReason}: ${error.message}` : fallbackReason;
	};

	const formatPrice = (price?: ShopifyPrice | null) => {
		if (!price) return '—';
		const amount = Number.parseFloat(price.amount);
		if (Number.isNaN(amount)) return `${price.currencyCode} ${price.amount}`;

		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: price.currencyCode
		}).format(amount);
	};

	const hasValidCompareAtPrice = (
		price?: ShopifyPrice | null,
		compareAtPrice?: ShopifyPrice | null
	) => {
		if (!price || !compareAtPrice) return false;
		const priceAmount = Number.parseFloat(price.amount);
		const compareAmount = Number.parseFloat(compareAtPrice.amount);
		if (Number.isNaN(priceAmount) || Number.isNaN(compareAmount)) return false;
		return compareAmount > priceAmount;
	};

	const productImages = $derived(product?.images ?? []);
	const selectedVariant = $derived(
		product?.variants?.find((variant: ShopifyVariant) => variant.id === selectedVariantId) ??
			product?.variants?.[0] ??
			null
	);
	const variantSelectId = $derived(
		product ? `variant-${product.id.replace(/[^a-zA-Z0-9_-]/g, '')}` : 'variant-select'
	);
	const displayPrice = $derived(formatPrice(selectedVariant?.price ?? product?.minPrice));
	const displayCompareAtPrice = $derived(
		hasValidCompareAtPrice(selectedVariant?.price, selectedVariant?.compareAtPrice)
			? formatPrice(selectedVariant?.compareAtPrice)
			: null
	);
	const isAddDisabled = $derived(!product || !selectedVariant || addStatus === 'loading');
	const stickyImage = $derived(productImages[0]?.url ?? '');

	$effect(() => {
		selectedImageIndex = 0;
		selectedVariantId = product?.variants?.[0]?.id ?? null;
		addStatus = 'idle';
		addMessage = null;
	});

	onMount(() => {
		if (!stickySentinel || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				showStickyBar = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);

		observer.observe(stickySentinel);

		return () => observer.disconnect();
	});

	function selectImage(index: number) {
		if (!productImages.length) return;
		if (index >= productImages.length) index = 0;
		if (index < 0) index = productImages.length - 1;
		selectedImageIndex = index;

		// animate the main image on change for a smooth feel
		const img = imageWrapper?.querySelector<HTMLImageElement>('[data-main-image]');
		if (img) {
			gsap.fromTo(
				img,
				{ opacity: 0, y: 12 },
				{ opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
			);
		}
	}

	async function handleAddToCart() {
		if (!product || !selectedVariant) return;

		addStatus = 'loading';
		addMessage = null;

		try {
			const result = await addLineToCart(selectedVariant.id, 1);
			if (!result.ok) {
				throw new Error(result.message ?? 'Unable to add to cart.');
			}

			addStatus = 'success';
			addMessage = 'Added to cart. You can continue to checkout.';
			openCartDrawer();
		} catch (err) {
			addStatus = 'error';
			addMessage = err instanceof Error ? err.message : 'Unable to add to cart.';
		}
	}

	async function handleBuyNow() {
		if (!product || !selectedVariant) return;

		addStatus = 'loading';
		addMessage = null;

		try {
			const result = await addLineToCart(selectedVariant.id, 1, { openDrawer: false });
			if (!result.ok) {
				throw new Error(result.message ?? 'Unable to add to cart.');
			}

			const checkoutUrl = getCheckoutUrl();
			if (checkoutUrl) {
				const sellerDomain = (
					document.getElementById('sellerDomain') as HTMLInputElement | null
				)?.value?.trim();
				if (!sellerDomain) {
					handleFallback('Missing sellerDomain value for custom checkout.');
					return;
				}

				const variantId = toNumericVariantId(selectedVariant.id);
				if (!variantId) {
					handleFallback('Invalid variant id for custom checkout.', undefined, {
						selectedVariantId: selectedVariant.id
					});
					return;
				}

				try {
					const buyDirect = await waitForCustomCheckout(2000);
					if (!buyDirect) {
						handleFallback('Custom checkout API not loaded within 2000ms.', undefined, {
							payload: {
								type: 'product',
								products: [{ variantId, quantity: 1 }]
							}
						});
						return;
					}

					const payload: Parameters<BuyDirectHandler>[0] = {
						type: 'product',
						products: [{ variantId, quantity: 1 }]
					};
						console.info('[custom-checkout][product] invoking buyDirect', {
							sellerDomain,
							payload
						});
						buyDirect(payload);
						addStatus = 'idle';
						addMessage = null;
					} catch (error) {
						handleFallback('Custom checkout threw an error during buyDirect.', error, {
							payload: {
							type: 'product',
							products: [{ variantId, quantity: 1 }]
						}
					});
				}
				return;
			}

			addStatus = 'error';
			addMessage = 'Checkout not available right now.';
		} catch (err) {
			addStatus = 'error';
			addMessage = err instanceof Error ? err.message : 'Unable to start checkout.';
		}
	}
</script>

{#if !shopifyReady}
	<section class="flex min-h-[60vh] items-center justify-center bg-white p-6 lg:p-16">
		<div class="max-w-3xl space-y-4 text-center font-dm-sans">
			<h2 class="text-28 font-semibold text-gray-900 lg:text-32">Connect Shopify</h2>
			<p class="text-16 text-gray-700">
				Add `SHOPIFY_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`, and an optional
				`SHOPIFY_DEFAULT_PRODUCT_HANDLE` to your `.env`, then restart the dev server to pull live
				product data.
			</p>
		</div>
	</section>
{:else if !product}
	<section class="flex min-h-[60vh] items-center justify-center bg-white p-6 lg:p-16">
		<div class="max-w-3xl space-y-4 text-center font-dm-sans">
			<h2 class="text-28 font-semibold text-gray-900 lg:text-32">No product found</h2>
			<p class="text-16 text-gray-700">
				{error ??
					'We could not load a product from Shopify. Create a product in your store and set SHOPIFY_DEFAULT_PRODUCT_HANDLE to its handle.'}
			</p>
		</div>
	</section>
{:else}
	<div
		class="flex min-h-screen justify-center bg-[#edf5fa] p-4 font-sans text-gray-800 lg:p-12 lg:p-20"
	>
		<div class="h-4" bind:this={stickySentinel}></div>
		<div class="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
			<!-- LEFT SIDE: Images -->
			<div class="flex flex-col gap-4 w-full">
				<!-- Main Image -->
				<div
					class="group relative w-full aspect-square overflow-hidden rounded-20 bg-white shadow-sm"
					bind:this={imageWrapper}
				>
					{#if productImages.length}
						<img
							src={productImages[selectedImageIndex]?.url}
							alt={productImages[selectedImageIndex]?.altText ?? product.title}
							class="h-full w-full object-contain transition-opacity duration-300"
							data-main-image
						/>
					{:else}
						<div class="flex h-full items-center justify-center text-gray-500">
							Product images coming soon
						</div>
					{/if}
				</div>

				<!-- Thumbnails -->
				{#if productImages.length > 1}
					<div class="no-scrollbar flex w-full gap-3 overflow-x-auto py-1">
						{#each productImages as img, i}
							<button
								onclick={() => selectImage(i)}
								class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 {selectedImageIndex === i ? 'border-[#7BA6C0] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}"
								aria-label={`Select image ${i + 1}`}
							>
								<img
									src={img.url}
									alt={img.altText ?? `Product image ${i + 1}`}
									class="h-full w-full object-cover"
								/>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- RIGHT SIDE: Details -->
			<div class="flex flex-col gap-6">
				<!-- Top Badges -->
				<div class="flex flex-wrap gap-2">
					<span class="rounded-full border border-[#7BA6C0] bg-white px-3 py-1 text-12 font-medium text-[#7BA6C0]">Lightweight</span>
					<span class="rounded-full border border-[#7BA6C0] bg-white px-3 py-1 text-12 font-medium text-[#7BA6C0]">Fuss-free</span>
					<span class="rounded-full border border-[#7BA6C0] bg-white px-3 py-1 text-12 font-medium text-[#7BA6C0]">Non-greasy</span>
				</div>

				<div class="font-dm-sans">
					<h1 class="text-32 leading-tight font-bold text-[#7BA6C0] lg:text-40">
						{product.title}
					</h1>
					
					<div class="mt-2 flex items-center gap-2 text-16 font-medium text-gray-600">
						<div class="flex text-yellow-400">
							{#each Array(5) as _}
								<SvgIcon icon="star" />
							{/each}
						</div>
						{#if reviewSummary}
							<span>{reviewSummary.total ?? reviewCount ?? 0} verified ratings</span>
						{:else}
							<span>No reviews yet</span>
						{/if}
					</div>

					<div class="mt-4 flex flex-wrap items-baseline gap-3">
						<p class="text-24 font-bold text-[#2d2d2d] lg:text-32">{displayPrice}</p>
						{#if displayCompareAtPrice}
							<p class="text-16 font-semibold text-gray-400 line-through lg:text-18">
								{displayCompareAtPrice}
							</p>
							<span class="inline-flex items-center rounded-sm bg-rose-100 px-2 py-1 text-12 font-bold uppercase text-rose-700">
								On Sale
							</span>
						{/if}
					</div>
					<div class="mt-5 inline-flex w-full items-center justify-center lg:justify-start gap-3 rounded-full bg-[#7BA6C0] px-3 py-2 shadow-sm lg:w-fit lg:pr-6">
						<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
							<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div class="flex items-baseline gap-1.5 text-white">
							<span class="text-20 font-extrabold tracking-tight">96.8%</span>
							<span class="text-14 font-semibold tracking-wide">saw reduction in dark spots</span>
						</div>
					</div>
				</div>

				<!-- Benefits -->
				<div class="grid grid-cols-4 gap-2 lg:gap-4">
					{#each benefits as benefit}
						<div class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-white p-3 text-center transition-transform hover:-translate-y-1 shadow-sm">
							<div class="text-[#7BA6C0]">
								<SvgIcon icon={benefit.icon} className="w-6 h-6 lg:w-8 lg:h-8" />
							</div>
							<span class="text-12 font-medium text-[#2d2d2d] lg:text-14">
								{benefit.label}
							</span>
						</div>
					{/each}
				</div>

				<!-- Variants -->
				{#if product.variants?.length > 1}
					<div class="space-y-2 mt-2">
						<label class="text-14 font-semibold text-[#2d2d2d]" for={variantSelectId}>
							Select Size/Option
						</label>
						<select
							id={variantSelectId}
							bind:value={selectedVariantId}
							class="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-16 shadow-sm focus:ring-2 focus:ring-[#7BA6C0] focus:outline-none"
						>
							{#each product.variants as variant}
								<option value={variant.id}>
									{variant.title} — {formatPrice(variant.price)}
								</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex flex-col gap-3 mt-2 lg:flex-row">
					<button
						class="w-full rounded-full bg-[#7BA6C0] py-4 text-16 font-bold tracking-wide text-white uppercase shadow-md transition-colors hover:bg-[#7BA6C0]/90 disabled:cursor-not-allowed disabled:opacity-50"
						onclick={handleAddToCart}
						disabled={isAddDisabled || !selectedVariant?.availableForSale}
					>
						{#if addStatus === 'loading'}
							Adding...
						{:else if selectedVariant?.availableForSale}
							Add to Cart
						{:else}
							Out of Stock
						{/if}
					</button>
					<button
						class="flex w-full items-center justify-center gap-2 rounded-full bg-[#2d2d2d] py-4 text-16 font-bold tracking-wide text-white uppercase shadow-md transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
						onclick={handleBuyNow}
						disabled={isAddDisabled || !selectedVariant?.availableForSale}
					>
						{#if addStatus === 'loading'}
							Processing...
						{:else if selectedVariant?.availableForSale}
							Buy Now
						{:else}
							Out of Stock
						{/if}
					</button>
				</div>
				
				<div class="flex items-center gap-2 text-14 font-medium text-gray-500 justify-center lg:justify-start">
					Free shipping on all orders • Free dermat tip sheet on prepaid
				</div>

				{#if addMessage}
					<p class="text-14 {addStatus === 'error' ? 'text-red-500' : 'text-[#7BA6C0] font-medium'}">
						{addMessage}
					</p>
				{/if}

				<!-- Tabs Content -->
				<div class="mt-6 border-t border-gray-200 pt-6">
					<div class="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar">
						<button 
							class="text-16 font-semibold transition-colors whitespace-nowrap {activeTab === 'description' ? 'text-[#7BA6C0] border-b-2 border-[#7BA6C0] pb-2' : 'text-gray-500 hover:text-[#2d2d2d]'}" 
							onclick={() => activeTab = 'description'}
						>
							Description
						</button>
						<button 
							class="text-16 font-semibold transition-colors whitespace-nowrap {activeTab === 'ingredients' ? 'text-[#7BA6C0] border-b-2 border-[#7BA6C0] pb-2' : 'text-gray-500 hover:text-[#2d2d2d]'}" 
							onclick={() => activeTab = 'ingredients'}
						>
							Ingredients
						</button>
						<button 
							class="text-16 font-semibold transition-colors whitespace-nowrap {activeTab === 'how-to' ? 'text-[#7BA6C0] border-b-2 border-[#7BA6C0] pb-2' : 'text-gray-500 hover:text-[#2d2d2d]'}" 
							onclick={() => activeTab = 'how-to'}
						>
							How to Apply
						</button>
					</div>
					
					<div class="mt-4 text-15 leading-relaxed text-gray-600">
						{#if activeTab === 'description'}
							{#if product.descriptionHtml}
								<div class="prose prose-sm max-w-none text-gray-600">{@html product.descriptionHtml}</div>
							{:else}
								<p class="whitespace-pre-line">{product.description}</p>
							{/if}
						{:else if activeTab === 'ingredients'}
							<p>Aqua (Water), Glycerin, Niacinamide, Propylene Glycol, Sodium Hyaluronate, Centella
								Asiatica Extract, Alpha-Arbutin, Tranexamic Acid, Panthenol, Glycyrrhiza Glabra
								(Licorice) Root Extract, Salix Alba (Willow) Bark Extract, Cucumis Sativus
								(Cucumber) Fruit Extract, Phenoxyethanol, Xanthan Gum, Sodium Polyacryloyldimethyl
								Taurate, Cetearyl Alcohol, Hydrogenated Polydecene, Tocopherol, Sodium Benzoate,
								Salvia Officinalis (Sage) Leaf Extract, Disodium EDTA, Polysorbate 80,
								4-Butylresorcinol, Camellia Sinensis Leaf Extract, Avena Sativa Kernel Extract,
								Saccharide Isomerate</p>
						{:else if activeTab === 'how-to'}
							<ol class="list-decimal pl-4 space-y-2">
								<li>Cleanse your face thoroughly.</li>
								<li>Apply 2-3 drops of the serum to your face and neck.</li>
								<li>Gently massage in circular motions until completely absorbed.</li>
								<li>Follow up with a moisturizer and sunscreen in the AM.</li>
							</ol>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<StickyProductBar
	isVisible={showStickyBar && !!product}
	title={product?.title ?? ''}
	price={displayPrice}
	compareAtPrice={displayCompareAtPrice}
	image={stickyImage}
	onAdd={handleAddToCart}
	disabled={isAddDisabled || !selectedVariant?.availableForSale}
/>
