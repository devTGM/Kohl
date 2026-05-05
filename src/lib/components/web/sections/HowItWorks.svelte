<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import SectionHeader from '../SectionHeader.svelte';

	// Data for the cards to keep the template clean
	const features = [
		{
			title: 'Multi-Pathway Pigmentation Correction',
			description:
				'Five powerful yet gentle tyrosinase inhibitors (Alpha Arbutin, Tranexamic Acid, Niacinamide, Licorice Root, 4-Butylresorcinol) work synergistically to fade existing spots and prevent new ones.',
			icon: 'atom'
		},
		{
			title: 'Barrier-Strengthening Hydration',
			description:
				"Panthenol, Centella Asiatica, and Hyaluronic Acid soothe inflammation while deeply hydrating and restoring your skin's protective barrier—essential for maintaining balanced, healthy melanin-rich skin.",
			icon: 'bowl'
		},
		{
			title: 'Protective Antioxidant Shield',
			description:
				'Green Tea, Vitamin E, Colloidal Oatmeal, and botanical extracts neutralize free radicals that can trigger new pigmentation, while also protecting the skin’s barrier from environmental stressors, soothing irritation.',
			icon: 'leaf'
		}
	];
</script>

<section class="brand-story w-full bg-primary-3 px-6 py-16 font-sans lg:py-24">
	<div class="mx-auto max-w-7xl">
		<SectionHeader
			eyebrow="How it Works"
			title="Your Trust Our Guarantee"
			class="mb-10 text-brown-300"
		/>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
			{#each features as feature}
				<div
					class="flex h-full flex-col items-center rounded-2xl border border-white/60 bg-white px-3 py-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md lg:px-8 lg:py-10"
				>
					<div class=" mb-6 flex items-center justify-center text-black">
						<SvgIcon icon={feature.icon} className="w-28 h-28" />
					</div>

					<h3 class="mb-4 font-dm-sans text-20 font-medium lg:text-24">
						{feature.title}
					</h3>
					<p
						class="text-center font-inter text-16 leading-relaxed font-normal text-black/70 lg:text-18"
					>
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.brand-story {
		background-color: #efefe3;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
</style>
