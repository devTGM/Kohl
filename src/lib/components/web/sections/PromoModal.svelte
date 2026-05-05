<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import { fade } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import { socialLinks } from '$lib/config/socials';
	export let open: boolean = false;

	let openTimeout: ReturnType<typeof setTimeout> | null = null;

	const modalSocials = socialLinks.filter((link) =>
		['instagram', 'facebook', 'twitter'].includes(link.icon ?? '')
	);

	onMount(() => {
		openTimeout = setTimeout(() => {
			open = true;
		}, 10_000);
	});

	onDestroy(() => {
		if (openTimeout) {
			clearTimeout(openTimeout);
		}
	});

	function close() {
		open = false;
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div transition:fade class="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
		<!-- Modal -->
		<div
			class="relative flex w-[92%] max-w-220 flex-col overflow-hidden rounded-2xl bg-white
			       shadow-2xl md:flex-row"
		>
			<!-- Close button -->
			<button
				type="button"
				on:click={close}
				class="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full
				       border border-black/10 text-black backdrop-blur-xl transition-all duration-500 hover:bg-black/5"
			>
				✕
			</button>

			<!-- Image (TOP on mobile, LEFT on desktop) -->
			<div class="h-48 w-full md:h-auto md:w-1/2">
				<img src="/images/promo.webp" alt="Promo" class="h-full w-full object-cover" />
			</div>

			<!-- Content (BOTTOM on mobile, RIGHT on desktop) -->
			<div
				class="flex w-full flex-col justify-center px-6 py-6 text-left
				       font-dm-sans text-black md:w-1/2
				       md:px-10 md:py-10"
			>
				<h2 class="text-28 leading-tight font-medium tracking-tight md:text-32">
					Join to get special offers, free giveaways, and once in a lifetime deals.

					<!-- Get 10% Off<br /> -->
					<!-- be in the know -->
				</h2>

				<p class=" text-12 font-normal lg:text-16">Sign me up</p>

				<!-- Phone input -->
				<input
					type="tel"
					placeholder="Enter your phone number"
					class="mt-6 w-full rounded-full border border-black/10
					       bg-neutral-100 px-5 py-3 text-sm outline-none
					       focus:border-black"
				/>

				<!-- CTA -->
				<Button size="sm" class="mt-4 w-full font-dm-sans capitalize!">Join Now</Button>

				<!-- Social icons -->
				{#if modalSocials.length}
					<div class="mt-6 flex items-center justify-center text-black/70">
						{#each modalSocials as social}
							<a
								href={social.href}
								target="_blank"
								rel="noreferrer noopener"
								aria-label={social.label}
								class="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-black/5"
							>
								<SvgIcon
									icon={social.icon ?? 'instagram'}
									className="w-4 h-4 text-black fill-black"
								/>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
