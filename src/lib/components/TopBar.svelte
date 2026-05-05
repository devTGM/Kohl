<script lang="ts">
	import SvgIcon from './SvgIcon.svelte';
	import { socialLinks } from '$lib/config/socials';

	export let message: string = 'Formulated and Clinically Tested on Indian Skin';

	const instagram = socialLinks.find((link) => link.id === 'instagram');
</script>

<div
	class="top-0 z-100 flex overflow-hidden w-full items-center justify-between bg-main-brown px-5 py-2 font-inter text-sm text-gray-200 md:px-10"
	role="region"
	aria-label="Announcement"
>
	<div class="flex items-center gap-1.5 p-1 w-[80%]">
		<!-- Dot animation -->
		<span class="relative flex size-3 items-center justify-center">
			<span
				class="absolute inline-flex h-full w-full animate-[ping_3.5s_ease-in-out_infinite] rounded-full bg-secondary-brown/30 opacity-100"
			></span>
			<span class="relative inline-flex size-2 rounded-full bg-secondary-brown"></span>
		</span>

		<!-- Desktop text -->
		<span class="hidden font-medium text-primary-3 sm:inline">
			{message}
		</span>

		<!-- ✅ Mobile marquee (fixed width so it won’t push the icon) -->
		<div class="block max-w-full overflow-hidden sm:hidden">
			<span class="mobile-marquee font-inter text-white">
				{message}
			</span>
		</div>
	</div>

	{#if instagram}
		<div class="flex items-center gap-5 ">
			<a
				href={instagram.href}
				target="_blank"
				rel="noreferrer noopener"
				aria-label={instagram.label}
			>
				<SvgIcon icon="instagram" className="h-6 w-6 fill-light-gray" />
			</a>
		</div>
	{/if}
</div>

<style>
	@keyframes marquee {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.mobile-marquee {
		display: inline-block;
		white-space: nowrap;
		animation: marquee 10s linear infinite;
	}
</style>
