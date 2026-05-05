<script lang="ts">
	import BeforeAfterSlider from './web/BeforeAfterSlider.svelte';

	// No SvgIcon import needed
	const beforeImage = {
		src: '/images/slider/1-T0.webp',
		alt: 'Clinical trial participant 1 at day 0'
	};

	const afterImage = {
		src: '/images/slider/1-T+28.webp',
		alt: 'Clinical trial participant 1 after 28 days'
	};
</script>

<section class=" mx-auto flex justify-center py-14 md:py-25">
	<div class="custom-container grid grid-cols-1 gap-5 lg:grid-cols-3">
		<!-- Left Placeholder Box -->
		<div class="col-span-2 hidden h-128 overflow-hidden rounded-20 bg-primary-3/70 md:block">
			<BeforeAfterSlider
				before={beforeImage}
				after={afterImage}
				ariaLabel="Slide to compare clinical trial results from day 0 and day 28"
			/>
		</div>

		<!-- Spotify Card -->
		<div class="w-full max-w-sm overflow-hidden rounded-2xl bg-primary-3">
			<!-- Top Image / Logo -->
			<div class="bg-black">
				<img
					src="/images/spotify.svg"
					alt="Spotify Glow-Up Playlist"
					class="h-full w-full object-cover"
				/>
			</div>

			<!-- Text and Button -->
			<div class="flex flex-col gap-8 p-8">
				<div class="text-center">
					<h3 class="font-inter text-24 font-semibold text-neutral-800">Glow-Up Playlist</h3>
					<p class="mt-1 font-inter text-18 leading-130 text-neutral-600">
						A link to a spotify playlist maybe to make things more interactive
					</p>
				</div>
				<a
					href="https://open.spotify.com/playlist/21dLSrvAMLqWsOeQYED2Cj?si=3ERPpn_2RICljAf8sXkxoQ&pi=OpUdjLRqTQixe"
					target="_blank"
					rel="noopener noreferrer"
					class="w-full rounded-full bg-[#5D544D] px-6 py-5 text-center font-inter text-18 font-medium text-white transition-colors hover:bg-[#4A423C]"
				>
					Join on Spotify
				</a>
			</div>
		</div>
	</div>
</section>
