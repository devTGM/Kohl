<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	const features = [
		{
			icon: 'atom',
			title: 'Scientifically Proven Formula'
		},
		{
			icon: 'bowl',
			title: 'Melanin Loving Ingredients'
		},
		{
			icon: 'leaf',
			title: '100% Vegan Formula'
		},
		{
			icon: 'derm',
			title: 'Dermatologist Approved'
		}
	];

	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;

	const goToSlide = (index: number) => {
		currentIndex = Math.max(0, Math.min(features.length - 1, index));
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent) => {
		touchEndX = event.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		const delta = touchStartX - touchEndX;

		if (delta > 40) {
			goToSlide(currentIndex + 1);
		} else if (delta < -40) {
			goToSlide(currentIndex - 1);
		}

		touchStartX = 0;
		touchEndX = 0;
	};
</script>

<section class="why-choose bg-white py-18 lg:py-25" aria-labelledby="why-choose-heading">
	<div class="custom-container">
		<div class="text-center">
			<p class="font-libre text-32 leading-130 text-brown-300 italic lg:text-48">Why Choose</p>
			<h2 class="mt-2 font-dm-sans text-32 leading-120 md:text-44 lg:text-48">
				Our Milky Brightening Serum
			</h2>
		</div>

		<!-- Desktop grid -->
		<div class="mt-10 hidden grid-cols-1 gap-5 sm:grid-cols-2 md:grid lg:grid-cols-4">
			{#each features as feature}
				<div
					class="flex flex-col items-center justify-center space-y-6 rounded-20 bg-brown-450 px-3 py-8"
				>
					<div class="flex h-24 items-center justify-center overflow-hidden">
						<SvgIcon icon={feature.icon} className="w-24 h-24" />
					</div>
					<p class="text-center font-dm-sans text-20 leading-150">{feature.title}</p>
				</div>
			{/each}
		</div>

		<!-- Mobile carousel -->
		<div class="mt-10 md:hidden">
			<div
				class="overflow-hidden"
				role="region"
				aria-label="Why choose carousel"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div
					class="flex transition-transform duration-300 ease-out"
					style={`transform: translateX(-${currentIndex * 100}%);`}
				>
					{#each features as feature}
						<div class="w-full flex-shrink-0 px-2">
							<div
								class="flex flex-col items-center justify-center space-y-6 rounded-20 bg-brown-450 px-5 py-8"
							>
								<div class="flex h-24 items-center justify-center overflow-hidden">
									<SvgIcon icon={feature.icon} className="w-24 h-24" />
								</div>
								<p class="text-center font-dm-sans text-20 leading-150">{feature.title}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-5 flex items-center justify-center gap-2">
				{#each features as _, index}
					<button
						type="button"
						class={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex ? 'bg-main-brown' : 'bg-[#f4eee6]'}`}
						aria-label={`Go to feature ${index + 1}`}
						aria-current={index === currentIndex}
						on:click={() => goToSlide(index)}
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>
