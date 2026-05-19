<script lang="ts">
	import HowItWorks from '$lib/components/web/sections/HowItWorks.svelte';
	import HowToUseProduct from '$lib/components/web/sections/HowToUseProduct.svelte';
	import ProductDetails from '$lib/components/web/sections/ProductDetails.svelte';
	import GlowChallenge from '$lib/components/web/sections/GlowChallenge.svelte';
	import WhyKohlSpice from '$lib/components/web/sections/WhyKohlSpice.svelte';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import Testimonial from '$lib/components/web/sections/Testimonial.svelte';
	import type { PageData } from './$types';
	import type { ShopifyPrice, ShopifyProduct } from '$lib/types/shopify';

	let { data } = $props<{ data: PageData }>();

	const formatPrice = (price?: ShopifyPrice | null) => {
		if (!price) return '';
		const amount = Number.parseFloat(price.amount);
		if (Number.isNaN(amount)) return `${price.currencyCode ?? ''} ${price.amount}`.trim();
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: price.currencyCode ?? 'INR',
			minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
			maximumFractionDigits: 2
		}).format(amount);
	};

	const isGiftingProduct = (product: ShopifyProduct) => {
		const searchableText = `${product.handle} ${product.title}`.toLowerCase();
		return searchableText.includes('gift') || searchableText.includes('gifting');
	};

	const otherProducts: ShopifyProduct[] = (data.products ?? []).filter(
		(product: ShopifyProduct) => product.handle !== data.product?.handle && !isGiftingProduct(product)
	);
</script>

<svelte:head>
	<title>Shop Hyperfade Serum | Kohl & Spice</title>
	<meta
		name="description"
		content="Buy Hyperfade Milky Brightening Serum by Kohl & Spice. View product details, choose variants, and checkout securely with Shopify."
	/>
</svelte:head>

<ProductDetails
	product={data.product}
	shopifyReady={data.shopifyReady}
	error={data.error}
	reviewSummary={data.reviewSummary}
	reviewCount={data.reviewCount}
/>

<GlowChallenge />

{#if otherProducts.length}
	<section class="bg-[#f0f8ff] py-16">
		<div class="custom-container space-y-8">
			<div class="mx-auto max-w-3xl space-y-3 text-center">
				<p class="font-dm-sans text-sm font-semibold uppercase tracking-[0.4em] text-brown-300">
					Kohl & Spice Shop
				</p>
				<h2 class="text-32 font-semibold leading-tight text-gray-900 lg:text-40">
					Discover curated sets, limited drops, and gifting essentials
				</h2>
				<p class="text-16 text-gray-600">
					Find every special launch - Valentine gift sets, new limited-edition rituals, and day-to-day
					favorites - then on each detail page.
				</p>
			</div>

			
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each otherProducts as catalogProduct (catalogProduct.handle)}
					<a
						href={`/shop/${catalogProduct.handle}`}
						class="group flex flex-col overflow-hidden rounded-20 border border-[#d7e9f4] bg-white transition hover:-translate-y-1 hover:shadow-lg"
					>
						<div class="h-56 w-full overflow-hidden rounded-t-[26px] bg-gray-100">
							{#if catalogProduct.images?.length}
								<img
									src={catalogProduct.images[0].url}
									alt={catalogProduct.images[0].altText ?? catalogProduct.title}
									class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							{:else}
								<div class="flex h-full items-center justify-center text-gray-400">
									Image coming soon
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col gap-3 px-6 py-5">
							<p class="text-18 font-semibold text-gray-900">{catalogProduct.title}</p>
							<p
								class="text-14 leading-relaxed text-gray-500"
								style="-webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; display: -webkit-box;"
							>
								{catalogProduct.description}
							</p>
							<div class="mt-auto flex items-center justify-between text-sm text-gray-700">
								<span class="text-16 font-semibold">{formatPrice(catalogProduct.minPrice)}</span>
								<span class="font-semibold text-brown-300">View details →</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
<HowToUseProduct />
<HowItWorks />
<WhyKohlSpice />
<Testimonial product={data.product} reviews={data.reviews} reviewSummary={data.reviewSummary} />
<Subscribe />
