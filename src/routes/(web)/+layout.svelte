<script lang="ts">
	import Lenis from 'lenis';
	import gsap from 'gsap';
	import TopBar from '$lib/components/TopBar.svelte';
	import Footer from '$lib/components/web/Footer.svelte';
	import Navbar from '$lib/components/web/Navbar.svelte';
	// import StoreWarmupIframe from '$lib/components/web/StoreWarmupIframe.svelte';
	// import MonorailAnalytics from '$lib/components/web/MonorailAnalytics.svelte';
	import CartDrawer from '$lib/components/web/CartDrawer.svelte';
	import 'lenis/dist/lenis.css';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import { contact } from '$lib/config/socials';
	import { env } from '$env/dynamic/public';

	let { children } = $props();

	let pageLoaded = $state(false);
	let showWhatsApp = $state(false);
	const sellerDomain = env.PUBLIC_CUSTOM_CHECKOUT_SELLER_DOMAIN ?? '';

	onMount(() => {
		pageLoaded = true;
		let lenis: Lenis | null = null;
		let ticker: ((time: number) => void) | null = null;

		const onScroll = () => {
			showWhatsApp = window.scrollY > 240;
		};

		const setup = async () => {
			const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
			gsap.registerPlugin(ScrollTrigger);
			lenis = new Lenis();
			lenis.on('scroll', ScrollTrigger.update);
			ticker = (time: number) => lenis?.raf(time * 1000);
			gsap.ticker.add(ticker);
			gsap.ticker.lagSmoothing(0);
			onScroll();
		};

		setup();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			if (ticker) gsap.ticker.remove(ticker);
			lenis?.destroy();
		};
	});
</script>

<svelte:head>
	<script src="https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js" defer></script>
	<link rel="stylesheet" href="https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css" />
</svelte:head>

<div class="relative z-10 lg:block">
	<TopBar message="Free Shipping | 20% off on Hyperfade" />
</div>

<Navbar />
<!-- <StoreWarmupIframe /> -->
<!-- <MonorailAnalytics shopId={shopId} storefrontId={storefrontId} /> -->

<main class="">
	{@render children()}
</main>

<CartDrawer />
<input type="hidden" value={sellerDomain} id="sellerDomain" />

<Footer />

{#if showWhatsApp}
	<a
		href={contact.whatsapp}
		target="_blank"
		rel="noreferrer noopener"
		aria-label="Chat on WhatsApp"
		class="fixed right-3 bottom-3 z-100 flex items-center gap-3 rounded-full transition-all duration-500 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:right-6 lg:bottom-4"
		transition:fade={{ duration: 200 }}
	>
		<span class="grid">
			<SvgIcon icon="whatsapp" className="h-12 w-12" />
		</span>
	</a>
{/if}
