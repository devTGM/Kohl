<script lang="ts">
	type InstagramPost = {
		id?: string;
		src: string;
		alt: string;
		permalink?: string;
	};

	const fallbackPosts: InstagramPost[] = [
		{ src: '/images/insta/1.webp', alt: 'Kohl & Spice embossed on cream' },
		{ src: '/images/insta/2.webp', alt: 'Milky swirl texture' },
		{ src: '/images/insta/3.webp', alt: 'Kohl & Spice shopping bag on chair' },
		{ src: '/images/insta/4.webp', alt: 'Instagram grid of product and lifestyle shots' }
	];

	export let posts: InstagramPost[] = [];

	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;
	let displayPosts: InstagramPost[] = fallbackPosts;

	import { socialLinks } from '$lib/config/socials';
	const instagram = socialLinks.find((link) => link.id === 'instagram');

	const goToSlide = (index: number) => {
		currentIndex = Math.max(0, Math.min(displayPosts.length - 1, index));
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

	$: displayPosts = posts.length ? posts.slice(0, 4) : fallbackPosts;
	$: if (currentIndex > displayPosts.length - 1) {
		currentIndex = 0;
	}
</script>

<section
	class="bg-[#d8b8ac] py-12 md:py-14 lg:bg-white lg:py-16"
	aria-labelledby="instagram-heading"
>
	<div class="px-0 lg:mx-auto lg:max-w-360 lg:px-14 xl:px-25">
		<div
			class="bg-[#d8b8ac] pt-8 pb-10 md:px-9 md:pt-10 md:pb-12 lg:rounded-20 lg:px-10 lg:pt-12 lg:pb-14"
		>
			<!-- Mobile carousel -->
			<div
				class="block md:hidden"
				role="region"
				aria-label="Instagram gallery carousel"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div class="overflow-hidden rounded-20">
					<div
						class="flex transition-transform duration-300 ease-out"
						style={`transform: translateX(-${currentIndex * 100}%);`}
					>
						{#each displayPosts as post}
							<div class="w-full shrink-0 px-4 pt-4 pb-6">
								<div class="overflow-hidden rounded-18">
									<img
										src={post.src}
										alt={post.alt}
										class="aspect-4/5 w-full object-cover"
										loading="lazy"
										decoding="async"
									/>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class=" flex items-center justify-center gap-1.25">
					{#each displayPosts as _, index}
						<button
							type="button"
							class={`h-2.5 w-2.5 rounded-full transition ${
								index === currentIndex ? 'bg-main-brown' : 'bg-[#f4eee6]'
							}`}
							on:click={() => goToSlide(index)}
							aria-label={`Go to slide ${index + 1}`}
							aria-current={index === currentIndex}
						/>
					{/each}
				</div>
			</div>

			<!-- Desktop grid -->
			<div class="hidden grid-cols-2 gap-4 md:grid md:grid-cols-4 md:gap-6">
				{#each displayPosts as post}
					<div
						class="min-h-45 aspect-4/5 overflow-hidden rounded-[14px] bg-[#f3f1ed] md:min-h-[240px] lg:min-h-[260px]"
					>
						<img
							src={post.src}
							alt={post.alt}
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover"
						/>
					</div>
				{/each}
			</div>

			<div class="mt-6 space-y-3 text-center">
				<h2 id="instagram-heading" class="font-dm-sans text-26 text-[#1f1a17] md:text-30">
					Join Us on Instgram
				</h2>
				{#if instagram}
					<a
						href={instagram.href}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center justify-center rounded-full bg-[#6b4b3f] px-7 py-3 font-dm-sans text-15 font-semibold tracking-wide text-white uppercase shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition hover:opacity-90"
					>
						Follow us now
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>
