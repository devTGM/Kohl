<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	const cards = [
		{
			icon: 'bottle',
			title: 'Glass Bottle',
			description: 'Rinse & Recycle made of fully  recyclable glass.'
		},
		{
			icon: 'dropper',
			title: 'Dropper',
			description: 'Separate the cap from the glass pipette, recycle the glass pipette.'
		},
		{
			icon: 'box',
			title: 'Box',
			description:
				'100% Recycled Paper, FSC Certified, and printed with natural, biodegradable inks.'
		}
	];

	// --- Carousel Logic ---
	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;
	let autoplayInterval: ReturnType<typeof setInterval>;
	const autoplayDelay = 3000; // Autoplay every 2 seconds

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

	let sectionEl: HTMLElement;

	onMount(() => {
		if (window.innerWidth < 768) {
			startAutoplay(); // Start autoplay only on mobile
		}
	});

	onDestroy(() => {
		stopAutoplay(); // Clean up the interval when the component is destroyed
	});
</script>

<section class="bg-brown-600 py-16 md:py-25">
	<div class="custom-container text-center text-white">
		<div class="flex flex-col items-center">
			<SvgIcon icon="recycle" className="h-8 w-8" />
			<p class="guide-p py-2 font-inter font-semibold tracking-[0.64px] uppercase">
				Disposable Guide
			</p>
			<h2 class="guide-title text-3xl leading-120 uppercase md:text-48">
				Let's not trash the planet <br class="hidden md:block" />
				While we glow up
			</h2>
		</div>

		<div
			class="relative mt-8 md:hidden"
			role="region"
			aria-roledescription="carousel"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
		>
			<div class="overflow-hidden">
				<div
					class="flex transition-transform duration-500 ease-in-out"
					style="transform: translateX(-{currentIndex * 100}%);"
				>
					{#each cards as card}
						<div class="w-full flex-shrink-0 px-1">
							<div
								class="flex h-full flex-col items-center rounded-8 bg-white px-8 py-10 text-center"
							>
								<SvgIcon icon={card.icon} className="h-14 w-14" />
								<h4 class="pt-5 pb-1 font-inter text-22 font-semibold text-black">
									{card.title}
								</h4>
								<p class="font-inter text-16 leading-130 font-medium text-black/70">
									{card.description}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="mt-6 flex justify-center gap-2">
				{#each cards as _, i}
					<button
						class="h-2 w-2 rounded-full transition-colors {i === currentIndex
							? 'bg-white'
							: 'bg-white/40'}"
						on:click={() => goToSlide(i)}
						aria-label="Go to slide {i + 1}"
					/>
				{/each}
			</div>
		</div>

		<div class=" mt-8 hidden grid-cols-1 gap-5 md:grid xl:grid-cols-3">
			{#each cards as card}
				<div
					class="guide-card flex flex-col items-center rounded-8 bg-white px-8 py-10 text-center"
				>
					<SvgIcon icon={card.icon} className="h-14 w-14" />
					<h4 class="pt-5 pb-1 font-inter text-22 font-semibold text-black">{card.title}</h4>
					<p class="font-inter text-16 leading-130 font-medium text-black/70">
						{card.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
