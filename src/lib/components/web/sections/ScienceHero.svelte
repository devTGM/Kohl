<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	// You can make these props if you want to reuse the banner with different text later
	let {
		title = 'Our Story',
		headline = "A Ritual You'll Love.",
		subheadline = 'Formulated for Indian Skintones',
		buttonText = 'GET HYPERFADE NOW'
	} = $props();
</script>

<section
	class="w-full bg-[url(/images/about-hero-bg.webp)] bg-cover bg-center px-6 py-20 font-dm-sans lg:py-32"
>
	<div
		class="mx-auto flex w-fit max-w-7xl flex-col items-center text-center lg:w-auto lg:items-start lg:text-left"
	>
		<h2 class="font-libre text-40 leading-tight tracking-tight text-white italic lg:text-72">
			{title}
		</h2>

		<h3 class="font-dm-sans text-40 leading-tight tracking-tight text-white lg:text-72">
			{headline}
		</h3>

		<p class="mb-4 font-dm-sans text-18 tracking-wide text-white lg:text-24">
			{subheadline}
		</p>

		<Button href="/shop">{buttonText}</Button>
	</div>
</section>
