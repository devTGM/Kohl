<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
</script>

<section class=" py-16 md:py-25">
	<div class="custom-container">
		<div class="text-center">
			<p
				class=" font-inter text-14 leading-150 font-semibold tracking-[0.64px] text-black/60 uppercase md:text-16"
			>
				No Stress, No Flare Ups
			</p>
			<h2 class="mt-2 font-serif text-36 uppercase md:text-48">How to Use</h2>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-5 font-inter lg:grid-cols-2">
			<div class="flex flex-col gap-5">
				<div
					class="flex h-full flex-col gap-4 rounded-10 bg-brown-400 p-8 md:flex-row md:items-center md:gap-6"
				>
					<SvgIcon icon="clock" className="h-10 w-10 flex-shrink-0 text-neutral-700" />
					<div>
						<h3 class="text-20 font-semibold md:text-24">When to Use</h3>
						<p class="text-16 md:text-18">Day and Night for best results</p>
					</div>
				</div>
				<div
					class="flex h-full flex-col gap-4 rounded-10 bg-brown-300 p-8 text-white md:flex-row md:items-center md:gap-6"
				>
					<SvgIcon icon="droplet" className="h-10 w-10 flex-shrink-0" />
					<div>
						<h3 class="text-20 font-semibold md:text-24">How Much</h3>
						<p class="text-16 md:text-18">2-3 drops</p>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-4 rounded-10 bg-[#F5F1EB] p-8">
				<div class="gap-2 md:flex-row md:items-center md:gap-4">
					<SvgIcon icon="layers" className="h-10 w-10 flex-shrink-0 text-neutral-700" />
				</div>
				<div>
					<h3 class="text-20 font-semibold text-black md:text-24">Layering Tips</h3>
					<ol class="list-inside list-decimal text-16 leading-160 md:text-18">
						<li>Gently cleanse before applying the serum.</li>
						<li>Use it before heavier creams and oils for maximum absorption.</li>
						<li>SPF is non-negotiable after AM use</li>
					</ol>
				</div>
			</div>
		</div>

		<div class="mt-5 rounded-10 bg-main-brown px-4 py-10 text-white md:px-8">
			<h3 class="font-inter text-20 font-semibold md:text-24">Quick Application Technique</h3>

			<div class="mt-6 grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_auto_1fr]">
				<div class="relative gap-2 rounded-8 bg-brown-500 p-6">
					<span
						class="absolute top-1/2 right-6 -translate-y-1/2 font-inter text-122 leading-130 font-bold text-white/20"
					>
						1
					</span>
					<SvgIcon icon="dispense" className="h-10 w-10 flex-shrink-0" />
					<div>
						<h4 class="pt-5 pb-1 font-inter text-24 font-semibold">Dispense</h4>
						<p class="font-inter text-18">2-3 drops</p>
					</div>
				</div>

				<div class="flex justify-center lg:hidden">
					<SvgIcon icon="down-arrow" className="h-8 w-8 text-neutral-400" />
				</div>
				<div class="hidden lg:block">
					<SvgIcon icon="arrow-right" className="h-8 w-8 text-neutral-400" />
				</div>

				<div class="relative gap-2 rounded-8 bg-brown-500 p-6">
					<span
						class="absolute top-1/2 right-6 -translate-y-1/2 font-inter text-122 leading-130 font-bold text-white/20"
					>
						2
					</span>
					<SvgIcon icon="press" className="h-10 w-10 flex-shrink-0" />
					<div>
						<h4 class="pt-5 pb-1 font-inter text-24 font-semibold">Press</h4>
						<p class="font-inter text-18">Gently into skin</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
