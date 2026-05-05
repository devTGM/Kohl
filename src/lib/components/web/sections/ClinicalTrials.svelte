<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import BeforeAfterSlider from '$lib/components/web/BeforeAfterSlider.svelte';
	import SectionHeader from '../SectionHeader.svelte';
	import clsx from 'clsx';
	export let variant: 'light' | 'dark' = 'light';

	const slides = [
		{
			before: {
				src: '/images/slider/1-T0.webp',
				alt: 'Clinical trial participant 1 at day 0'
			},
			after: {
				src: '/images/slider/1-T+28.webp',
				alt: 'Clinical trial participant 1 after 28 days'
			}
		},
		{
			before: {
				src: '/images/slider/2-T0.webp',
				alt: 'Clinical trial participant 2 at day 0'
			},
			after: {
				src: '/images/slider/2-T+28.webp',
				alt: 'Clinical trial participant 2 after 28 days'
			}
		},
		{
			before: {
				src: '/images/slider/3-T0.webp',
				alt: 'Clinical trial participant 3 at day 0'
			},
			after: {
				src: '/images/slider/3-T+28.webp',
				alt: 'Clinical trial participant 3 after 28 days'
			}
		},
		{
			before: {
				src: '/images/slider/4-T0.webp',
				alt: 'Clinical trial participant 4 at day 0'
			},
			after: {
				src: '/images/slider/4-T+28.webp',
				alt: 'Clinical trial participant 4 after 28 days'
			}
		}
	];

	let currentIndex = 0;
	function nextSlide() {
		currentIndex = (currentIndex + 1) % slides.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + slides.length) % slides.length;
	}
</script>

<section
	class={clsx('clinical-trials bg-white py-18 md:py-20 lg:py-24', {
		'clinical-trials-bg': variant === 'dark'
	})}
	aria-labelledby="ct-heading"
>
	<div class="custom-container px-4 lg:px-8">
		<SectionHeader
			eyebrow="Clinical Trials"
			title="Real Skin, Real Results"
			class="mb-8 text-brown-300 lg:mb-10"
		/>

		<div
			class="relative mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[1fr_1.1fr] xl:gap-12"
		>
		   
			<div class="order-2 space-y-6 text-center lg:order-1 lg:space-y-6 lg:text-left xl:space-y-8">
				<div
					class={clsx('flex items-center justify-center gap-4 lg:hidden', {
						hidden: variant === 'dark'
					})}
				>
					<button
						on:click={prevSlide}
						class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 bg-white transition-colors hover:bg-gray-50"
						aria-label="Previous"
					>
						<div class="rotate-180 transform">
							<SvgIcon icon="arrow-right" className="h-4 w-4 text-black" />
						</div>
					</button>
					<button
						on:click={nextSlide}
						class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 bg-white transition-colors hover:bg-gray-50"
						aria-label="Next"
					>
						<SvgIcon icon="arrow-right" className="h-4 w-4 text-black" />
					</button>
				</div>
				<div class="space-y-4 font-dm-sans leading-relaxed">
					<p class="text-20 font-semibold text-brown-300 lg:text-20 xl:text-28">
						After 28 days, the complexion is more even toned, clear, and radiant.
					</p>

					<p class="text-18 text-black/80 lg:text-18 xl:text-24">
						Visible improvement in skin brightness through 28 days (based on significant L* increase
						at T+28)
					</p>
					<p class="text-18 text-black/80 xl:text-24">
						Evaluations included chromametry, dermatological assessment, and self-assessment
						questionnaires.
					</p>
				</div>

				<div class={clsx('', { hidden: variant === 'dark' })}>
					<button
						on:click={prevSlide}
						class="hover:bg-brown-50 absolute top-1/2 left-2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white transition-colors hover:border-brown-300 lg:-left-14 lg:flex"
						aria-label="Previous slide"
					>
						<div class="rotate-180 transform">
							<SvgIcon icon="arrow-right" className="h-5 w-5 text-black" />
						</div>
					</button>

					<button
						on:click={nextSlide}
						class="hover:bg-brown-50 absolute top-1/2 right-2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white transition-colors hover:border-brown-300 lg:-right-14 lg:flex"
						aria-label="Next slide"
					>
						<SvgIcon icon="arrow-right" className="h-5 w-5 text-black" />
					</button>
				</div>

				<div
					class={clsx(
						'mt-6 rounded-12 border border-white/50 px-5 py-4 font-dm-sans text-14 leading-150 shadow-sm lg:mt-8 lg:text-16 xl:text-18',
						{
							'bg-primary-3': variant === 'light',
							'bg-white': variant === 'dark'
						}
					)}
				>
					Based on a 28-day clinical study conducted on 33 female participants aged 18–45 with
					wheatish to dark skin tones.
				</div>

				

				<div class="mt-8 lg:mt-0">
					<a
						href="/science"
						class="font-dm-sans text-18 font-semibold text-main-brown uppercase underline"
						>Visit Kohl & Spice LAB</a
					>
				</div>
			</div>

			<div class="order-1 flex h-full w-full justify-center lg:order-2">
				<div class="image-frame relative h-full w-full overflow-hidden rounded-12">
					<BeforeAfterSlider
						before={slides[currentIndex].before}
						after={slides[currentIndex].after}
						ariaLabel="Slide to compare clinical trial results from day 0 and day 28"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.clinical-trials-bg {
		background-color: #f0e5d8;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
	.clinical-trials {
		position: relative;
	}

	.clinical-trials::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('/images/texture.webp');
		background-size: cover;
		background-repeat: repeat;
		opacity: 0.22;
		pointer-events: none;
		mix-blend-mode: multiply;
	}

	.clinical-trials > .custom-container {
		position: relative;
		z-index: 1;
	}

	.image-frame {
		width: 100%;
		max-width: 620px;
		margin: 0 auto;
	}
</style>
