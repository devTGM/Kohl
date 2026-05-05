<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	let sectionEl: HTMLElement | null = null;

	onMount(() => {
		let ctx: gsap.Context | null = null;

		const init = async () => {
			if (!sectionEl) return;
			const targets = sectionEl.querySelectorAll<HTMLElement>('[data-htu-anim]');
			if (!targets?.length) return;

			const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				gsap.from(targets, {
					opacity: 0,
					y: 28,
					duration: 0.8,
					ease: 'power2.out',
					stagger: 0.08,
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 80%',
						once: true
					}
				});
			}, sectionEl);
		};

		init();

		return () => {
			ctx?.revert();
		};
	});
</script>

{#snippet whenToUseCard()}
	<div
		data-htu-anim
		class="flex h-full items-center gap-4 rounded-2xl bg-beige p-5 shadow-sm transition-transform hover:scale-[1.02]"
	>
		<div class="flex h-10 w-10 shrink-0 items-center justify-center text-gray-700">
			<SvgIcon icon="cycle" />
		</div>
		<div>
			<h3 class="font-inter text-18 leading-tight font-semibold text-black lg:text-20 xl:text-24">
				When to Use
			</h3>
			<p class="font-inter text-16 text-black/70 lg:text-16 xl:text-20">
				Day and Night for best results
			</p>
		</div>
	</div>
{/snippet}

{#snippet howMuchCard()}
	<div
		data-htu-anim
		class="flex h-full items-center gap-4 rounded-2xl bg-brown-550 p-5 shadow-xl transition-transform hover:scale-[1.02]"
	>
		<div class="flex h-10 w-10 shrink-0 items-center justify-center text-white">
			<SvgIcon icon="colorize" />
		</div>
		<div>
			<h3 class="font-inter text-18 leading-tight font-semibold text-white lg:text-20 xl:text-24">
				How Much
			</h3>
			<p class="font-inter text-16 text-white/80 lg:text-16 xl:text-20">2-3 drops</p>
		</div>
	</div>
{/snippet}

{#snippet layeringTipsCard()}
	<div
		data-htu-anim
		class="flex h-full items-center gap-4 rounded-2xl bg-green p-5 shadow-sm transition-transform hover:scale-[1.02]"
	>
		<div class="flex h-10 w-10 shrink-0 items-center justify-center">
			<SvgIcon icon="lyering" />
		</div>
		<div>
			<h3 class="font-inter text-18 leading-tight font-semibold text-black lg:text-20 xl:text-24">
				Layering Tips
			</h3>
			<p class="mt-1 font-inter text-16 leading-snug text-black/70 lg:text-16 xl:text-20">
				Use it before heavier creams & oils for max absorption
			</p>
		</div>
	</div>
{/snippet}

{#snippet checklistPanel()}
	<div
		data-htu-anim
		class="flex h-full flex-col justify-center rounded-2xl bg-checklist p-6 lg:p-6 xl:p-8"
	>
		<ul class="space-y-3 xl:space-y-4">
			{#each ['Be consistent and use it daily for your brightest, most even skin.', 'Follow with SPF after AM use', 'Overload your routine, HyperFade does it all without extra layering.'] as item}
				<li class="flex items-start gap-3">
					<div class="my-auto shrink-0 p-0.5">
						<SvgIcon icon="check" />
					</div>
					<span class="black font-dm-sans text-16 leading-snug lg:text-14 xl:text-18">{item}</span>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<section class="w-full overflow-hidden bg-white py-18 lg:py-24" bind:this={sectionEl}>
	<div class="xl:max-w-8xl mx-auto px-4 lg:px-8">
		<div
			class="hidden h-[650px] grid-cols-14 grid-rows-6 items-center gap-x-4 gap-y-4 lg:grid xl:h-[750px] xl:gap-x-6 xl:gap-y-6"
		>
			<div
				class="z-10 row-start-2 mb-4 self-end lg:col-span-5 lg:col-start-1 xl:col-span-4 xl:col-start-2"
			>
				{@render whenToUseCard()}
			</div>

			<div
				class="col-span-3 col-start-2 row-span-2 row-start-3 justify-self-center overflow-hidden rounded-[2rem] lg:h-48 lg:w-48 xl:h-64 xl:w-64"
				data-htu-anim
			>
				<img
					src="images/howtouse/1.webp"
					class="h-full w-full object-cover"
					alt="Applying"
					loading="lazy"
				/>
			</div>

			<div
				class="z-20 row-start-5 mt-10 lg:col-span-6 lg:col-start-2 xl:col-span-5 xl:col-start-3 xl:mt-20"
			>
				{@render layeringTipsCard()}
			</div>

			<div
				class="z-0 col-span-6 col-start-5 row-span-6 row-start-1 mx-2 h-full overflow-hidden rounded-[3rem] shadow-sm xl:mx-0"
				data-htu-anim
			>
				<img
					src="images/howtouse/2.webp"
					class="h-full w-full object-cover"
					alt="Model Face"
					loading="lazy"
				/>
			</div>

			<div
				class="col-span-5 col-start-11 row-span-2 row-start-1 mt-8 self-center justify-self-start overflow-hidden rounded-[2rem] shadow-sm lg:h-48 lg:w-48 xl:h-64 xl:w-64"
				data-htu-anim
			>
				<img
					src="images/howtouse/3.webp"
					class="h-full w-full object-cover"
					alt="Product"
					loading="lazy"
				/>
			</div>

			<div
				class="z-20 row-start-3 mt-16 -ml-0 self-center lg:col-span-4 lg:col-start-10 xl:col-span-3 xl:col-start-10 xl:ml-0"
			>
				{@render howMuchCard()}
			</div>

			<div
				class="z-10 col-span-4 col-start-11 row-span-2 row-start-5 -mt-6 self-start xl:col-start-11"
			>
				{@render checklistPanel()}
			</div>
		</div>

		<div class="flex flex-col gap-4 lg:hidden">
			<div class="aspect-[4/5] w-full overflow-hidden rounded-2xl">
				<img src="images/howtouse/2.webp" class="h-full w-full object-cover" alt="Model Face" />
			</div>

			{@render whenToUseCard()}

			{@render howMuchCard()}

			{@render layeringTipsCard()}

			{@render checklistPanel()}
		</div>
	</div>
</section>
