<script>
	import Logo from '$lib/components/Logo.svelte';
</script>

<section
	class="brand-story relative overflow-hidden py-18 md:py-24 lg:py-28"
	aria-labelledby="brand-story-heading"
>
	<div class="custom-container">
		<div class="flex flex-col items-center text-center">
			<!-- <p class="font-libre text-32 text-brown-300 italic md:text-34 lg:text-48">
				Because when your skin is understood,
			</p> -->
			<h2 id="brand-story-heading" class="font-dm-sans text-40 leading-120 lg:text-56">
				Smarter Skincare for Indian Skin
			</h2>

			<p class="mt-8 max-w-5xl font-dm-sans text-18 leading-160 md:text-20 lg:text-24">
				We’re rethinking skincare for melanin-rich, Indian skin with formulas made for as well as
				tested on it. We believe you shouldn’t have to choose between results and safety, between
				effective and kind. We believe in data over hype, in testing on the skin that’s been
				ignored, and in building skincare that finally understands you.
			</p>

			<div class="mt-14 flex flex-col items-center gap-4 md:mt-16">
				<Logo className="" />
				<div class="px-10">
					<p class="font-dm-sans text-20 leading-tight md:text-22 lg:text-32">
						Skincare that finally gets you
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.brand-story {
		background-color: #f0e5d8;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
</style>
