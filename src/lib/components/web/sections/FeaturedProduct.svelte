<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { ShopifyPrice, ShopifyProduct } from '$lib/types/shopify';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { onDestroy, onMount } from 'svelte';

	export let product: ShopifyProduct | null = null;

	let sectionEl: HTMLElement;
	let ctaEl: HTMLElement | null = null;
	let animation: gsap.core.Timeline | null = null;

	const headingLineOne = ['Hyperfade'];
	const headingLineTwo = ['Our', 'Breakthrough', 'Brightening', 'Serum'];
	const ctaWords = ['SHOP', 'THE', 'LAUNCH'];

	const benefits = [
		{
			title: 'FADES STUBBORN PIGMENTATION',
			description: 'Powered by five clinically studied brightening actives for visible results.'
		},
		{
			title: 'SOFT, MILKY, SENSITIVITY-SAFE',
			description: 'No irritation, no stinging, designed for sensitive, melanin-rich skin.'
		},
		{
			title: 'DESIGNED FOR INDIAN SKIN',
			description: 'Proven effective on real Indian skin tones (Fitzpatrick IV–VI).'
		}
	];

	const claims = ['Fragrance Free', 'Dermatologist Tested', 'Clinically Validated'];

	const highlights = [
		{ image: '/images/highlight/1.webp', label: 'Perfected, Never Rushed' },
		{ image: '/images/highlight/2.webp', label: 'In Vivo Verified' },
		{ image: '/images/highlight/3.webp', label: 'Clinically Precise Care' },
		{ image: '/images/highlight/4.webp', label: 'Precision Actives' }
	];

	const formatPrice = (price?: ShopifyPrice | null) => {
		if (!price) return null;

		const amount = Number(price.amount);
		if (!Number.isFinite(amount)) return `${price.currencyCode ?? ''} ${price.amount}`.trim();

		try {
			return new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: price.currencyCode || 'INR',
				minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
				maximumFractionDigits: 2
			}).format(amount);
		} catch (error) {
			console.error('Price format error', error);
			return `${price.currencyCode ?? ''} ${price.amount}`.trim();
		}
	};

	const fallbackTitle = 'Milky Brightening Serum';
	const fallbackPrice = '₹1600';
	$: displayTitle = product?.title || fallbackTitle;
	$: displayPrice = formatPrice(product?.minPrice) || fallbackPrice;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const words = sectionEl?.querySelectorAll('.fp-word') ?? [];
		const benefitItems = sectionEl?.querySelectorAll('.fp-benefit') ?? [];
		const productMedia = sectionEl?.querySelector('.fp-image');
		const detailsPanel = sectionEl?.querySelector('.fp-details');

		animation = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top 90%',
				once: true
			}
		});

		animation.from(words, {
			y: 30,
			opacity: 0,
			duration: 0.6,
			ease: 'power3.out',
			stagger: 0.07
		});

		if (ctaEl) {
			animation.from(
				ctaEl,
				{
					y: 24,
					opacity: 0,
					duration: 0.5,
					ease: 'power3.out'
				},
				'-=0.3'
			);
		}

		animation.from(
			benefitItems,
			{
				y: 20,
				opacity: 0,
				duration: 0.45,
				ease: 'power2.out',
				stagger: 0.05
			},
			'-=0.2'
		);

		if (productMedia) {
			animation.from(
				productMedia,
				{
					y: 24,
					opacity: 0,
					duration: 0.5,
					ease: 'power2.out'
				},
				'-=0.3'
			);
		}

		if (detailsPanel) {
			animation.from(
				detailsPanel,
				{
					y: 24,
					opacity: 0,
					duration: 0.5,
					ease: 'power2.out'
				},
				'-=0.4'
			);
		}
	});

	onDestroy(() => {
		animation?.kill();
	});
</script>

<section bind:this={sectionEl} class=" bg-white py-18 pt-2 md:py-16 lg:py-20">
	<div class="custom-container">
		<div class="">
			<div class="text-center">
				<p
					class="flex flex-wrap justify-center gap-x-2 font-libre text-32 leading-130 text-brown-300 italic md:text-48"
				>
					{#each headingLineOne as word}
						<span class="fp-word inline-block">{word}</span>
					{/each}
				</p>
				<h2
					class="mt-2 flex flex-wrap justify-center gap-x-2 font-dm-sans text-32 leading-120 lg:text-48"
				>
					{#each headingLineTwo as word}
						<span class="fp-word inline-block">{word}</span>
					{/each}
				</h2>
			</div>

			<div class="mt-10 grid gap-7 lg:mt-12 lg:grid-cols-3 lg:items-center lg:gap-0">
				<div
					class="order-3 flex h-full w-full flex-col items-start justify-center space-y-8 md:pr-8 lg:order-0 lg:space-y-10"
				>
					{#each benefits as benefit}
						<div class="fp-benefit">
							<p
								class=" font-dm-sans text-18 font-bold tracking-tight text-brown-300 uppercase md:text-18"
							>
								{benefit.title}
							</p>
							<p class="font-dm-sans text-16 leading-150 text-brown-200 md:text-18">
								{benefit.description}
							</p>
						</div>
					{/each}
				</div>
				<div class="fp-image bg-brown-400] h-full w-full overflow-hidden rounded-20">
					<img
						src="/images/product-image.webp"
						alt="Bottle of milky brightening serum on a stone"
						class="h-full w-full rounded-18 object-cover"
						loading="lazy"
					/>
				</div>
				<div class="fp-details flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10 lg:pl-8">
					<div class="space-y-4">
						<div>
							<h3 class="font-dm-sans text-28 leading-130 md:text-30 lg:text-32">
								{displayTitle}
							</h3>
							<p class="font-inter text-24 font-bold text-brown-300 md:text-24">
								{displayPrice}
							</p>
						</div>

						<div class="space-y-3 rounded-16 bg-brown-450 px-4 py-2.5">
							{#each claims as claim}
								<div class="flex items-center gap-2 font-inter text-18">
									<SvgIcon icon="main-tick" />
									{claim}
								</div>
							{/each}
						</div>

						<div bind:this={ctaEl}>
							<Button href="/shop" size="sm" class="w-full gap-1! font-dm-sans lg:w-fit">
								Shop Now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
<div
	class="marquee relative overflow-hidden border-t border-black/10 bg-white px-5 md:px-6"
	aria-label="Product highlights"
>
	<div class="marquee__track flex items-center gap-8 md:gap-10">
		{#each [...highlights, ...highlights] as item}
			<div class="flex shrink-0 items-center gap-6 py-6">
				<div class="h-8 w-8 overflow-hidden rounded-full lg:h-20 lg:w-20">
					<img
						src={item.image}
						alt={item.label}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover"
					/>
				</div>
				<p class="font-dm-sans whitespace-nowrap lg:text-28">{item.label}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.marquee__track {
		width: max-content;
		animation: marquee 50s linear infinite;
	}

	.marquee:hover .marquee__track,
	.marquee:focus-within .marquee__track {
		animation-play-state: paused;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__track {
			animation: none;
		}
	}
</style>
