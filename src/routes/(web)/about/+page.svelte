<script>
	import BrandManifesto from '$lib/components/web/sections/BrandManifesto.svelte';
	import OurStory from '$lib/components/web/sections/OurStory.svelte';
	import ScienceHero from '$lib/components/web/sections/ScienceHero.svelte';
	import ScienceLab from '$lib/components/web/sections/ScienceLab.svelte';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
</script>

<svelte:head>
	<title>The Science | Kohl & Spice</title>
	<meta
		name="description"
		content="Explore the science behind Kohl & Spice Hyperfade—clinically validated actives, lab testing, and formulation built for melanin-rich Indian skin."
	/>
</svelte:head>
<ScienceHero />
<OurStory />
<BrandManifesto
	content={{
		tagline: 'Skincare that finally gets you',
		paragraph:
			"Your melanin isn't a flaw to fix, it's a feature to celebrate. Kohl & Spice exists so you can wake up feeling confident in your own skin. This is skincare that honors where you come from while helping you glow from within."
	}}
/>
<ScienceLab />
<Subscribe />
