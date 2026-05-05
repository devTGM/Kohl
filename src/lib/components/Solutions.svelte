<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import { slide } from 'svelte/transition';

	const cards = [
		{
			icon: 'brighteners',
			title: '5+ Brighteners',
			description: 'In synergy, in low dose = safe + powerful'
		},
		{
			icon: 'barrier-repair',
			title: 'Barrier Repair',
			description: 'Fight oxidative stress & pollution damage'
		},
		{
			icon: 'antioxidants',
			title: '6+ Antioxidants',
			description: 'Cica, Panthenol, Colloidal Oatmeal'
		}
	];
	const ingredients = [
		{ name: 'Aqua (Water)', does: 'solvent' },
		{ name: 'Glycerin', does: 'moisturizer/humectant' },
		{ name: 'Niacinamide', does: 'skin brightening, anti-acne, moisturizer/humectant' },
		{ name: 'Propylene Glycol', does: 'moisturizer/humectant, solvent' },
		{ name: 'Sodium Hyaluronate', does: 'moisturizer/humectant' },
		{ name: 'Centella Asiatica Extract', does: 'soothing, antioxidant, moisturizer/humectant' },
		{ name: 'Alpha-Arbutin', does: 'antioxidant, skin brightening' },
		{ name: 'Tranexamic Acid', does: 'skin brightening, soothing' },
		{ name: 'Panthenol', does: 'soothing, moisturizer/humectant' },
		{ name: 'Glycyrrhiza Glabra (Licorice) Root Extract', does: 'soothing, skin brightening' },
		{ name: 'Salix Alba (Willow) Bark Extract', does: 'soothing' },
		{ name: 'Cucumis Sativus (Cucumber) Fruit Extract', does: 'soothing, emollient' },
		{ name: 'Phenoxyethanol', does: 'preservative' },
		{ name: 'Xanthan Gum', does: 'viscosity controlling' },
		{ name: 'Sodium Polyacryloyldimethyl Taurate', does: 'viscosity controlling' },
		{ name: 'Cetearyl Alcohol', does: 'emollient, viscosity controlling' },
		{ name: 'Hydrogenated Polydecene', does: 'emollient, solvent' },
		{ name: 'Tocopherol', does: 'antioxidant' },
		{ name: 'Sodium Benzoate', does: 'preservative' },
		{ name: 'Salvia Officinalis (Sage) Leaf Extract', does: 'soothing, antioxidant' },
		{ name: 'Disodium EDTA', does: 'chelating' },
		{ name: 'Polysorbate 80', does: 'emulsifying' },
		{ name: '4-Butylresorcinol', does: 'antioxidant, skin brightening' },
		{ name: 'Camellia Sinensis Leaf Extract', does: 'antioxidant, soothing' },
		{ name: 'Avena Sativa Kernel Extract', does: 'antioxidant, soothing, emollient' },
		{ name: 'Saccharide Isomerate', does: 'moisturizer/humectant' }
	];

	let showInciList = $state(false);

	function toggleInciList() {
		showInciList = !showInciList;
	}

	let sectionEl: HTMLElement;
</script>

<section bind:this={sectionEl} class="bg-main-brown py-14 text-white md:py-25">
	<div class="custom-container text-center">
		<h2 class=" font-serif text-36 leading-120 uppercase md:text-48">
			Our <br class="block md:hidden" /> Solutions
		</h2>
		<p class=" mx-auto mt-3 max-w-3xl font-inter text-14 text-white/70 md:text-16">
			Our milky brightening serum is a revolutionary 3-in-1 solution that uses multi-pathway
			pigmentation correction to reveal brighter, more even-toned skin. Specifically formulated for
			Indian skin, every ingredient is research-backed and precisely dosed for maximum efficacy,
			boosted with soothing and barrier-repair actives to prevent PIH and photosensitivity.
		</p>

		<div class="mt-8 grid grid-cols-1 gap-5 font-inter xl:grid-cols-3">
			{#each cards as card}
				<div
					class="solution-card flex flex-col items-center rounded-8 bg-white px-6 py-5 text-center text-black"
				>
					<div class="flex h-20 w-20 items-center justify-center rounded-full pb-4">
						<SvgIcon icon={card.icon} className="h-10 w-10 " />
					</div>
					<h3 class="text-20 font-semibold md:text-22">{card.title}</h3>
					<p class="line-clamp-2 text-16 text-black/70">
						{card.description}
					</p>
				</div>
			{/each}
		</div>

		<div class="mt-4">
			<div class="rounded-8 bg-white/20">
				<button
					class="flex w-full cursor-pointer items-center justify-between px-8 py-5 text-left font-inter text-18 font-semibold text-white"
					onclick={toggleInciList}
					aria-expanded={showInciList}
					aria-controls="inci-list-content"
				>
					<span>
						{#if showInciList}
							View Less INCI List
						{:else}
							Decode Full INCI List
						{/if}
					</span>
					<SvgIcon
						icon="chevron-down"
						className=" text-white transition-transform duration-500 {showInciList
							? 'rotate-180'
							: ''}"
					/>
				</button>

				{#if showInciList}
					<div
						transition:slide={{ duration: 500 }}
						id="inci-list-content"
						class="px-2 pb-5 text-left text-16 text-white lg:px-8"
					>
						<div
							class="flex gap-2.5 border-white/20 pb-2 font-inter text-16 font-medium text-white uppercase md:text-18"
						>
							<span class="w-full rounded-8 bg-brown-200 px-5 py-2.5 text-left"
								>Ingredient Name</span
							>
							<span class="flex w-full items-center rounded-8 bg-brown-200 px-5 py-2.5 text-left"
								>What-it-does</span
							>
						</div>
						<div class="mt-2 flex flex-col font-inter">
							{#each ingredients as ingredient, i}
								{@const isMultiLine = ingredient.does.includes('/')}
								<div class="flex items-center text-16 capitalize">
									<span class="w-1/2 px-2 lg:px-5 {isMultiLine ? 'py-1' : 'py-1'} md:py-1"
										>{ingredient.name}</span
									>
									<span
										class="w-1/2 px-2 lg:px-5 {isMultiLine ? 'py-1' : 'py-1'} text-white md:py-1"
									>
										<span class="md:hidden">{@html ingredient.does.replace('/', '<br/>')}</span>
										<span class="hidden md:inline">{ingredient.does}</span>
									</span>
								</div>
								{#if i < ingredients.length - 1}
									<hr class="my-2 border-white/10" />
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
