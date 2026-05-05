<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let sectionEl: HTMLElement;
	let textImageEl: HTMLElement;

	let animation: gsap.core.Tween | null = null;
	let mediaMatch: gsap.MatchMedia | null = null;

	onMount(() => {
		if (typeof window === 'undefined') {
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		mediaMatch = gsap.matchMedia();
		mediaMatch.add('(min-width: 1024px)', () => {
			if (!sectionEl || !textImageEl) {
				return;
			}

			animation = gsap.to(textImageEl, {
				yPercent: -70,
				scale: 0.6,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl,
					start: 'center bottom',
					end: 'bottom top',
					scrub: true
				}
			});

			return () => {
				animation?.kill();
				animation = null;
			};
		});
	});

	onDestroy(() => {
		animation?.kill();
		animation = null;
		mediaMatch?.revert();
		mediaMatch = null;
	});
</script>

<section class="p-5 lg:p-10">
	<section class="relative h-[calc(100vh-120px)] overflow-hidden rounded-20" bind:this={sectionEl}>
		<div class="px-10 pb-5 lg:hidden">
			<img src="/images/text.webp" alt="Text Layer" class="object-contain px-4 md:px-0" />
		</div>

		<div class=" relative h-10/12 overflow-hidden rounded-20 bg-[#BFB6B1] md:h-full">
			<img
				src="/images/hero.webp"
				alt="Background Hero"
				class="relative -bottom-20 z-30 h-full w-full object-cover"
				aria-hidden="true"
			/>
			<div class="absolute top-40 right-0 left-0 z-20 hidden items-center justify-center lg:flex">
				<img
					src="/images/text.webp"
					alt="Text Layer"
					class="  object-contain px-4 md:px-0"
					bind:this={textImageEl}
				/>
			</div>

			<div
				class="absolute top-10 z-10 mx-4 rounded-10 bg-white px-4 py-2 text-center font-inter text-16 font-semibold text-black uppercase md:top-10 md:left-1/2 md:-translate-x-1/2 md:text-20"
			>
				FORMULA 001: HYPERFADE MILKY BRIGHTENING SERUM
			</div>
		</div>
	</section>
</section>
