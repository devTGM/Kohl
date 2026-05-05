<script>
	import SectionHeader from '../SectionHeader.svelte';
</script>

<section class="clinical-trials brand-story py-16 lg:py-20 xl:py-24" aria-labelledby="ct-heading">
	<div class="custom-container px-4 lg:px-8">
		<SectionHeader
			eyebrow="Clinical Trials"
			title="Real Skin, Real Results"
			class="mb-8 text-brown-300 lg:mb-10"
		/>

		<div
			class="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[1fr_1.1fr] xl:gap-12"
		>
			<div class="order-2 space-y-6 lg:order-1 lg:space-y-6 xl:space-y-8">
				<div class="space-y-4 font-dm-sans leading-relaxed">
					<p class="text-20 font-semibold text-brown-300 lg:text-20 xl:text-28">
						After 28 days, the complexion is more even toned, clear, and radiant.
					</p>

					<p class="text-18 text-black/80 lg:text-18 xl:text-24">
						Visible improvement in skin brightness through 28 days (based on significant L* increase
						at T+28)
					</p>
					<p class="text-18 text-black/80 lg:text-18 xl:text-24">
						Evaluations included chromametry, dermatological assessment, and self-assessment
						questionnaires.
					</p>
				</div>

				<div
					class="mt-6 rounded-12 border border-white/50 bg-white px-5 py-4 font-dm-sans text-14 leading-150 shadow-sm lg:mt-8 lg:text-16 xl:text-18"
				>
					Based on a 28-day clinical study conducted on 33 female participants aged 18–45 with
					wheatish to dark skin tones.
				</div>
			</div>

			<div class="order-1 flex w-full justify-center lg:order-2">
				<div class="flex w-full max-w-2xl overflow-hidden rounded-lg shadow-md">
					<div class="relative w-1/2">
						<img
							src="/images/T0.webp"
							alt="Before clinical trial"
							loading="lazy"
							class="h-full w-full object-cover"
						/>
					</div>

					<div class="relative w-1/2">
						<img
							src="/images/T+28.webp"
							alt="After 28 days clinical trial"
							loading="lazy"
							class="h-full w-full object-cover"
						/>
					</div>
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
</style>
