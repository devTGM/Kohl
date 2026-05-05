<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	const cards = [
		{
			icon: 'sun',
			title: 'UV Exposure',
			description: 'Triggers excess melanin production'
		},
		{
			icon: 'pollution',
			title: 'Pollution',
			description: 'Oxidative stress causes dullness'
		},
		{
			icon: 'Inflammation',
			title: 'Inflammation',
			description: 'Harsh actives can leave PIH on Indian skin'
		},
		{
			icon: 'trauma',
			title: 'Past Trauma',
			description: 'Breakouts or small cuts turn into lasting pigmentation'
		}
	];

	// --- Carousel Logic ---
	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;
	let autoplayInterval: ReturnType<typeof setInterval>;
	const autoplayDelay = 3000; // 2 seconds

	function startAutoplay() {
		autoplayInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % cards.length;
		}, autoplayDelay);
	}

	function stopAutoplay() {
		clearInterval(autoplayInterval);
	}

	function resetAutoplay() {
		stopAutoplay();
		startAutoplay();
	}

	function handleTouchStart(e: TouchEvent) {
		stopAutoplay();
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		touchEndX = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		if (touchStartX - touchEndX > 50) {
			// Swiped left
			currentIndex = (currentIndex + 1) % cards.length;
		}

		if (touchStartX - touchEndX < -50) {
			// Swiped right
			currentIndex = (currentIndex - 1 + cards.length) % cards.length;
		}

		touchStartX = 0;
		touchEndX = 0;
		resetAutoplay();
	}

	function goToSlide(index: number) {
		currentIndex = index;
		resetAutoplay();
	}
	// --- End Carousel Logic ---

	// --- GSAP Animation Logic ---
	let sectionEl: HTMLElement;
	onMount(() => {
		if (window.innerWidth < 768) {
			startAutoplay(); // Start autoplay only on mobile
		}

		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({});
	});

	onDestroy(() => {
		stopAutoplay(); // Clear the interval when the component is unmounted
	});
</script>

<div>
	<section bind:this={sectionEl} class="pt-10 pb-14 md:py-20">
		<div class="custom-container !px-0 text-center lg:!px-25">
			<h2 class=" px-5 text-32 leading-120 text-black uppercase md:text-48">
				Kohl & Spice <br />Formulation Dossier
			</h2>
			<p class=" mx-auto mt-2 max-w-5xl px-5 font-inter text-main-brown">
				Every day, your skin is exposed to harsh sunlight, pollution, and environmental stressors
				that trigger the enzyme Tyrosinase, leading to excess melanin production, dark spots, and
				uneven skin tone. Once activated, your skin follows multiple pathways to create
				pigmentation, making it harder to treat with single-ingredient solutions.
			</p>

			<div
				class="relative mt-8 bg-brown-400 py-5 md:hidden"
				role="region"
				aria-roledescription="carousel"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div class="overflow-hidden rounded-10">
					<div
						class="flex transition-transform duration-500 ease-in-out"
						style="transform: translateX(-{currentIndex * 100}%);"
					>
						{#each cards as card}
							<div class="w-full flex-shrink-0 px-5">
								<div
									class="flex h-full flex-col items-center rounded-8 bg-white px-6 py-5 text-center font-inter"
								>
									<div class="flex items-center justify-center p-4">
										<SvgIcon icon={card.icon} />
									</div>
									<h4 class="font-semibold text-black">{card.title}</h4>
									<p class="line-clamp-2 min-h-10 text-16 leading-130 text-black/70">
										{card.description}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="mt-4 flex justify-center gap-2 md:hidden">
					{#each cards as _, i}
						<button
							class="h-2.5 w-2.5 rounded-full transition-colors {i === currentIndex
								? 'bg-main-brown'
								: 'bg-brown-100'}"
							on:click={() => goToSlide(i)}
							aria-label="Go to slide {i + 1}"
						/>
					{/each}
				</div>
			</div>

			<div
				class="mt-8 hidden flex-wrap items-stretch justify-center gap-4 rounded-10 bg-brown-400 px-4 py-4 md:flex xl:flex-nowrap"
			>
				{#each cards as card, i}
					<div
						class="flex w-full flex-col items-center rounded-8 bg-white px-6 py-5 text-center font-inter"
					>
						<div class="flex items-center justify-center p-4">
							<SvgIcon icon={card.icon} />
						</div>
						<h4 class="text-20 font-semibold text-black">{card.title}</h4>
						<p class="line-clamp-2 text-16 leading-130 whitespace-normal text-black/70">
							{card.description}
						</p>
					</div>

					{#if i < cards.length - 1}
						<div class="hidden items-center text-2xl font-light xl:flex">+</div>
					{/if}
				{/each}
			</div>

			<div class="relative flex flex-col items-center">
				<div>
					<SvgIcon icon="swirl-arrow" className="" />
				</div>

				<div class=" relative -top-7">
					<img src="/images/formulation.svg" alt="Formulation breakdown chart" class="" />
				</div>
			</div>
		</div>
	</section>
</div>
