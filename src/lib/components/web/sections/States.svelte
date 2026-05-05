<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { onDestroy, onMount } from 'svelte';

	const stats = [
		{
			value: 100,
			suffix: '%',
			description: 'Reported improved skin brightness'
		},
		{
			value: 98,
			suffix: '%',
			description: 'Saw visibly more even skin tone'
		},
		{
			value: 100,
			suffix: '%',
			description: 'Found Zero irritation, redness or itching'
		}
	];

	let counts = stats.map(() => 0);
	let sectionEl: HTMLElement;
	let observer: IntersectionObserver | null = null;
	let hasAnimated = false;

	const animateCounts = () => {
		if (hasAnimated) return;
		hasAnimated = true;

		const duration = 1200;
		const start = performance.now();

		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = cubicOut(progress);

			counts = stats.map((stat) => Math.round(stat.value * eased));

			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		};

		requestAnimationFrame(tick);
	};

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateCounts();
					}
				});
			},
			{
				threshold: 0.3
			}
		);

		if (sectionEl) {
			observer.observe(sectionEl);
		}
	});

	onDestroy(() => {
		if (observer && sectionEl) {
			observer.unobserve(sectionEl);
		}
		observer?.disconnect();
	});
</script>

<section
	bind:this={sectionEl}
	class="states-section py-18 md:py-16"
	aria-labelledby="states-heading"
>
	<div class="custom-container space-y-8 lg:space-y-4">
		<h2
			id="states-heading"
			class=" text-center font-dm-sans text-32 leading-tight capitalize lg:text-40 lg:font-medium"
		>
			Clinical study <br class="sm:hidden" /> outcomes
		</h2>
		<div class="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-6 lg:gap-12">
			{#each stats as stat, index}
				<div class=" text-center">
					<p class="font-libre text-48 font-bold text-brown-300 md:text-60 lg:text-48">
						{counts[index]}{stat.suffix}
					</p>
					<p class="font-dm-sans text-20 leading-150 md:text-20">
						{stat.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.states-section {
		background-color: #f0e5d8;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
</style>
