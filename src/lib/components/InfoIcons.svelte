<script lang="ts">
	import SvgIcon from './SvgIcon.svelte';

	export let icon: string;
	export let label: string;
</script>

<div class="flex flex-col items-center justify-between gap-y-2.5 text-center">
	<div class="rounded-full border border-white p-5 backdrop-blur-lg">
		<SvgIcon {icon} className="h-6 w-6" />
	</div>
	<span class=" font-inter text-14 font-medium md:text-18">{@html label}</span>
</div>
