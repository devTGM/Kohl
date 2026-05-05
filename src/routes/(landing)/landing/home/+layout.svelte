<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="">
	<main class="">
		{@render children()}
	</main>
</div>
<Footer />
