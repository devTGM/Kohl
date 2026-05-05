<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	// Text content from the Desktop image
	export let content = {
		paragraph:
			'We’re rethinking skincare for melanin-rich, Indian skin with formulas made for as well as tested on it. We believe you shouldn’t have to choose between results and safety, between effective and kind. We believe in data over hype, in testing on the skin that’s been ignored, and in building skincare that finally understands you.',
		tagline: 'Skincare that finally gets you'
	};
</script>

<section class="brand-story w-full px-6 py-24 font-sans">
	<div class="mx-auto flex max-w-5xl flex-col items-center text-center">
		<p class="mb-4 font-dm-sans text-18 leading-tight text-black lg:mb-8 lg:text-24">
			{content.paragraph}
		</p>

		<div class="flex flex-col items-center gap-2">
			<SvgIcon icon="logo" className="w-80 lg:w-120 h-fit text-brown-300" />

			<p class="font-dm-sans text-24 text-black lg:text-32">
				{content.tagline}
			</p>
		</div>
	</div>
</section>

<style>
	.brand-story {
		background-color: #f2e8dc;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
</style>
