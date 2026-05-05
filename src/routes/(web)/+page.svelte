<script lang="ts">
	import BrandStory from '$lib/components/web/sections/BrandStory.svelte';
	import ClinicalTrials from '$lib/components/web/sections/ClinicalTrials.svelte';
	import FeaturedProduct from '$lib/components/web/sections/FeaturedProduct.svelte';
	import Hero from '$lib/components/web/sections/Hero.svelte';
	import InstagramCTA from '$lib/components/web/sections/InstagramCTA.svelte';
	import PromoModal from '$lib/components/web/sections/PromoModal.svelte';
	import RecentBlogs from '$lib/components/web/sections/RecentBlogs.svelte';
	import States from '$lib/components/web/sections/States.svelte';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import WhyChoose from '$lib/components/web/sections/WhyChoose.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { blogPosts, featuredProduct, instagramPosts } = data;
</script>

<svelte:head>
	<title>Kohl & Spice | Hyperfade Milky Brightening Serum</title>
	<meta
		name="description"
		content="Discover Kohl & Spice Hyperfade Milky Brightening Serum—clinically validated care crafted for melanin-rich, sensitive Indian skin with gentle, effective actives."
	/>
</svelte:head>

<PromoModal />
<Hero />
<div class="relative z-10 bg-white">
	<FeaturedProduct product={featuredProduct} />
		<States />
	<ClinicalTrials />
	<BrandStory />

	<WhyChoose />
	<InstagramCTA posts={instagramPosts} />
	<RecentBlogs posts={blogPosts} />
	<Subscribe />
</div>
