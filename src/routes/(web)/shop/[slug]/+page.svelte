<script lang="ts">
	import ProductDetails from '$lib/components/web/sections/ProductDetails.svelte';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const heroTitle = data.product ? `${data.product.title} | Kohl & Spice` : 'Product | Kohl & Spice';
	const heroDescription =
		data.product?.description?.trim() ??
			'Explore Kohl & Spice skincare designed to brighten, balance, and protect.';
</script>

<svelte:head>
	<title>{heroTitle}</title>
	<meta name="description" content={heroDescription} />
</svelte:head>

<ProductDetails
	product={data.product}
	shopifyReady={data.shopifyReady}
	error={data.error}
	reviewSummary={data.reviewSummary}
	reviewCount={data.reviewCount}
/>

<Subscribe />