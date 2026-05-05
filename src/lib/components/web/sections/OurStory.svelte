<script lang="ts">
	// Text content extracted from your images
	const content = {
		eyebrow: 'Our Story',
		title: 'No Stress, No Flare Ups',
		paragraphs: [
			'We grew up with misunderstood skin. Like many Indian women, the founder followed advice shaped by the belief that her skin color needed fixing. She resorted to home remedies and harsh solutions, which weakened her skin barrier, making it sensitive and prone to pigmentation.',
			"It took years to unlearn that narrative. She realized she didn't need correction, but an understanding of what truly works for melanated skin. Learning about Indian skin biology shifted everything. This journey not only changed her skin but revealed a larger gap in skincare.Most skincare in India exists at extremes. Global and Korean brands, tested primarily on white skin, overlook our different skin biology. Meanwhile, many local solutions prioritize speed over safety, promising quick results at the expense of long-term skin health.",
			,
			"What's missing is intention. Kohl & Spice was created to fill that gap. It’s not about transformation but understanding. Confident skin isn't created through aggression; it's built through care, consistency, and credibility."
		]
	};
</script>

<section class="w-full bg-white px-4 py-16 font-sans lg:py-30">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-16">
			<div class="flex h-full w-full items-center justify-center">
				<div
					class="aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-sm md:max-w-full lg:aspect-auto lg:h-full"
				>
					<img
						src="images/story.webp"
						alt="Our Story Founder"
						class="h-full w-full transform object-cover transition-transform duration-700 hover:scale-105"
					/>
				</div>
			</div>

			<div class="flex flex-col text-center lg:text-left">
				<h2 class="font-libre text-32 leading-tight text-brown-300 italic lg:text-48">
					{content.eyebrow}
				</h2>
				<h3 class="mb-2 font-dm-sans text-32 leading-tight text-black lg:text-48">
					{content.title}
				</h3>

				<div class="space-y-4 font-dm-sans text-18 leading-relaxed text-light-gray-200 lg:text-18">
					{#each content.paragraphs as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
