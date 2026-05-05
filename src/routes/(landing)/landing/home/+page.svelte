<script>
	import DisposableGuide from '$lib/components/DisposableGuide.svelte';
	import FormulationDossier from '$lib/components/FormulationDossier.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HowToUse from '$lib/components/HowToUse.svelte';
	import Solutions from '$lib/components/Solutions.svelte';
	import Spotify from '$lib/components/Spotify.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
</script>

<svelte:head>
	<title>Kohl & Spice | Full Experience</title>
	<meta
		name="description"
		content="Explore the full Kohl & Spice experience—clinical results, formulation dossier, how-to, and the Hyperfade ritual."
	/>
</svelte:head>

<TopBar />

<Hero />
<FormulationDossier />
<Solutions />
<HowToUse />
<DisposableGuide />
<Spotify />
