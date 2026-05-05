<script lang="ts">
	import InfoIcons from '$lib/components/InfoIcons.svelte';
	import TopBar from '$lib/components/TopBar.svelte';

	let features = [
		{ icon: 'clinically-proven', title: 'Clinically <br /> Proven' },
		{ icon: 'dermatologist-approved', title: 'Dermatologist <br /> Approved' },
		{ icon: 'sustainability-first', title: 'Sustainability <br /> First' }
	];
</script>

<svelte:head>
	<title>Kohl & Spice Lab Tour</title>
	<meta
		name="description"
		content="Take a quick tour of the Kohl & Spice lab experience and see how we craft science-backed skincare for Indian skin."
	/>
</svelte:head>

<section class="flex h-screen flex-col">
	<header>
		<TopBar />
	</header>
	<section class="h-full md:p-10">
		<div
			class="bg-start relative h-full bg-[#d3d3d3] bg-[linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)),url('/images/home.webp')] bg-cover bg-[position:top_center] bg-no-repeat p-8 md:rounded-20 md:p-20"
		>
			<div class="flex h-full flex-col gap-20 md:justify-between">
				<div class="space-y-2 text-center">
					<h1 class="text-36 leading-[150%] text-white md:text-76 md:leading-[120%]">
						Welcome to the
						<p
							class=" block font-inter text-60 font-semibold text-white uppercase [text-shadow:0_0_17px_rgba(255,255,255,1)] md:text-88"
						>
							Kohl & Spice Lab
						</p>
					</h1>
					<p
						class="font-inter text-18 text-white [text-shadow:0_4px_14px_rgba(0,0,0,0.25)] md:text-24"
					>
						Our formulas are science-backed & optimised for Indian Skin
					</p>
				</div>

				<div class="flex flex-col items-center text-white">
					<div class="grid grid-cols-3 gap-6">
						{#each features as feature}
							<InfoIcons icon={feature.icon} label={feature.title} />
						{/each}
					</div>

					<a
						href="/landing/home"
						class="tour-button mt-8 rounded-full bg-main-brown px-6 py-3 font-inter text-18 md:text-20"
					>
						Take the Tour
					</a>
				</div>
			</div>
		</div>
	</section>
</section>

<style>
	.tour-button {
		position: relative;
		overflow: hidden;
		transition: box-shadow 0.35s ease;
	}

	.tour-button::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.4) 40%,
			rgba(255, 255, 255, 0) 100%
		);
		opacity: 0;
		transform: translateY(-100%);
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.tour-button::after,
	.tour-button:focus-visible::after {
		opacity: 0.15;
		animation: tour-rain 1s linear infinite;
	}

	.tour-button,
	.tour-button:focus-visible {
		box-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
	}

	@keyframes tour-rain {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(100%);
		}
	}

	@keyframes marquee {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.mobile-marquee {
		animation: marquee 10s linear infinite;
		padding-left: 100%;
		white-space: nowrap;
		display: inline-block;
	}
</style>
