<script lang="ts">
	import SvgIcon from '../SvgIcon.svelte';
	import { cartState, openCartDrawer } from '$lib/stores/cart';

	let mobileOpen = false;
	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Shop', href: '/shop' },

		{ label: 'About Us', href: '/about' },
		{ label: 'Science', href: '/science' },
		{ label: 'Blogs', href: '/blog' },
		{ label: 'Contact', href: '/contact' }
	];
	function toggleMenu() {
		mobileOpen = !mobileOpen;
	}
	function closeMenu() {
		mobileOpen = false;
	}

	$: cartItemCount =
		$cartState.cart?.lines.reduce((total, line) => total + Math.max(0, line.quantity || 0), 0) ?? 0;
</script>

<!-- NAVBAR -->
<header class="sticky top-0 z-40 w-full border-b border-black/10 bg-white py-2 lg:py-4">
	<div class=" custom-container">
		<div class="flex items-center justify-between">
			<!-- LEFT: Logo -->
			<a href="/" class="flex items-center gap-2">
				<SvgIcon icon="logo" className="w-40 text-stone-750" />
			</a>

			<!-- CENTER: Desktop Nav -->
			<div class="hidden items-center gap-6 md:flex">
				<nav class="hidden items-center gap-4 md:flex lg:gap-8">
					{#each navLinks as link}
						<a
							href={link.href}
							class="rounded font-dm-sans text-16 font-medium text-black hover:text-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
						>
							{link.label}
						</a>
					{/each}
				</nav>
				<div class="hidden items-center gap-3 md:flex lg:gap-5">
					<a
						href="/account/login"
						aria-label="Account"
						class="rounded ring-black focus-visible:ring-2"
					>
						<SvgIcon icon="profile" />
					</a>
					<button
						aria-label={`Cart (${cartItemCount} items)`}
						class="relative rounded ring-black focus-visible:ring-2"
						onclick={openCartDrawer}
					>
						<SvgIcon icon="cart" />
						{#if cartItemCount > 0}
							<span
								class="absolute -top-2 -right-2 min-w-[1.1rem] rounded-full bg-main-brown font-dm-sans px-1.5 text-center text-[10px] leading-[1.1rem] font-semibold text-white"
							>
								{cartItemCount}
							</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- MOBILE: Hamburger -->
			<button
				class="rounded ring-black focus-visible:ring-2 md:hidden"
				aria-label="Open menu"
				onclick={toggleMenu}
			>
				<SvgIcon icon="hamburgur" />
			</button>
		</div>
	</div>
</header>

<!-- MOBILE DRAWER -->
<div
	class={`fixed inset-0 z-50 transition ${
		mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
	}`}
>
	<!-- Backdrop -->
	<div
		class={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
			mobileOpen ? 'opacity-100' : 'opacity-0'
		}`}
		role="button"
		tabindex="0"
		aria-label="Close menu"
		onclick={closeMenu}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && closeMenu()}
	></div>

	<!-- Drawer -->
	<aside
		class={`absolute top-0 left-0 h-full w-72 bg-white font-dm-sans shadow-xl
		       transition-transform duration-300 ease-out
		       ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
	>
		<div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
			<span class="text-lg font-semibold">Menu</span>
			<button onclick={closeMenu} aria-label="Close menu">✕</button>
		</div>

		<nav class="flex flex-col gap-4 px-5 py-6">
			<div class="flex flex-col gap-4 border-b border-black/10 pb-6">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMenu}
						class="font-dm rounded text-14 font-medium text-black ring-black hover:underline focus-visible:ring-2"
					>
						{link.label}
					</a>
				{/each}
			</div>

			<div class="flex gap-4">
				<a
					href="/account/login"
					aria-label="Account"
					class="rounded ring-black focus-visible:ring-2"
				>
					<SvgIcon icon="profile" />
				</a>
				<button
					aria-label={`Cart (${cartItemCount} items)`}
					class="relative rounded ring-black focus-visible:ring-2"
					onclick={() => {
						openCartDrawer();
						closeMenu();
					}}
				>
					<SvgIcon icon="cart" />
					{#if cartItemCount > 0}
						<span
							class="absolute -top-2 -right-2 min-w-[1.1rem] rounded-full bg-black px-1.5 text-center text-[10px] leading-[1.1rem] font-semibold text-white"
						>
							{cartItemCount}
						</span>
					{/if}
				</button>
			</div>
		</nav>
	</aside>
</div>
