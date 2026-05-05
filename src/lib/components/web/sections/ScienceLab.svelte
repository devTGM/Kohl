<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	// Content extracted from the design
	const content = {
		eyebrow: 'Science, Not Scare Tactics',
		headline: "We're on a mission to make skincare evidence-led, kind, and easy.",
		description1:
			'Our mission is to translate real science into clear routines without any fear or fluff so you never have to choose between what works and what feels safe.',
		description2:
			'We build responsibly: vegan and cruelty free formulas, pH balanced and clinically evaluated, with transparent INCI explanations and recyclable packaging. Fewer promises, better proof, calmer skin.',
		buttonText: 'KNOW MORE ABOUT SCIENCE LAB'
	};
</script>

<section class="w-full bg-white px-4 py-16 font-sans lg:py-30">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
			<div class="order-1 flex h-full w-full justify-center lg:order-2 lg:justify-end">
				<div
					class="aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-sm md:max-w-full lg:aspect-auto lg:h-full"
				>
					<img
						src="images/story.webp"
						alt="Scientist working in lab"
						class="h-full w-full transform object-cover transition-transform duration-700 hover:scale-105"
					/>
				</div>
			</div>

			<div
				class="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
			>
				<h2 class="font-libre text-32 leading-tight text-brown-300 italic lg:text-48">
					{content.eyebrow}
				</h2>

				<h3 class="mb-2 font-dm-sans text-32 leading-tight text-black lg:mb-4 lg:text-48 xl:pr-18">
					{content.headline}
				</h3>

				<div class="space-y-4 text-16 leading-relaxed text-light-gray-200 lg:text-18 xl:pr-16">
					<p>{content.description1}</p>
					<p>{content.description2}</p>
				</div>

				<Button class="mt-8" href="/science">{content.buttonText}</Button>
			</div>
		</div>
	</div>
</section>
