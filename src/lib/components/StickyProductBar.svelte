<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from './ui/Button.svelte';

	let {
		title = 'Product',
		price = '',
		compareAtPrice = null,
		image = 'https://placehold.co/100x100/e5e5e5/5c4b45?text=Product',
		isVisible = false,
		onAdd = () => {},
		disabled = false
	} = $props<{
		title?: string;
		price?: string;
		compareAtPrice?: string | null;
		image?: string;
		isVisible?: boolean;
		onAdd?: () => void;
		disabled?: boolean;
	}>();
</script>

{#if isVisible}
	<div
		transition:fly={{ y: 100, duration: 400 }}
		class="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white/95 px-4 py-3 font-dm-sans shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md md:px-8 md:py-4"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
			<div class="hidden items-center gap-3 overflow-hidden md:gap-4 lg:flex">
				<div
					class="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 md:h-12 md:w-12"
				>
					<img src={image} alt={title} class="h-full w-full object-cover" />
				</div>

				<div class="flex flex-col">
					<h3
						class="max-w-[150px] truncate text-20 leading-tight font-medium text-black md:max-w-xs"
					>
						{title}
					</h3>
					<div class="flex items-center gap-2">
						<span class="text-18 font-semibold text-black/90">
							{price}
						</span>
						{#if compareAtPrice}
							<span class="text-14 font-semibold text-gray-400 line-through">
								{compareAtPrice}
							</span>
						{/if}
					</div>
				</div>
			</div>
			<Button size="sm" {disabled} onclick={onAdd}>Add to Cart</Button>
		</div>
	</div>
{/if}
