<script lang="ts">
	import RazorpayLogo from '$lib/assets/RazorpayLogo.svelte';
	import SvgIcon from '../SvgIcon.svelte';

	type Link = {
		label: string;
		href: string;
	};

	type Column = {
		title: string;
		links: Link[];
	};

	const currentYear = new Date().getFullYear();

	const columns: Column[] = [
		{
			title: 'Quick Links',
			links: [
				{ label: 'About Us', href: '/about' },
				{ label: 'Shop', href: '/shop' },
				{ label: 'Science', href: '/science' },
				{ label: 'Contact us', href: '/contact' }
			]
		},
		{
			title: 'Customer care',
			links: [
				{ label: 'Privacy Policy', href: '/privacy' },
				{ label: 'Terms of Service', href: '/terms' },
				{ label: 'Shipping Policy', href: '/shipping' },
				{ label: 'Refund Policy', href: '/refund' }
			]
		}
	];
</script>

<div class="relative z-50 bg-main-brown">
	<footer class="relative z-50 rounded-t-32 bg-zinc-60 px-6 py-10 md:px-10 lg:px-16">
		<!-- TOP -->
		<div
			class="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-6 text-black md:grid-cols-6 md:gap-6 lg:py-10"
		>
			<!-- LOGO -->
			<div class="relative top-0 md:col-span-2">
				<SvgIcon icon="logo-2" className="w-42 md:w-32 lg:w-42 xl:w-52 h-32" />
			</div>

			<!-- NAV COLUMNS -->
			{#each columns as col}
				<div>
					<h3
						class="mb-2 font-dm-sans text-18 font-semibold md:text-13 lg:mb-4 lg:text-16 xl:text-18"
					>
						{col.title}
					</h3>

					<ul class="space-y-3 md:space-y-1 lg:space-y-3">
						{#each col.links as link}
							<li>
								<a
									href={link.href}
									class="rounded font-dm-sans text-16 font-normal hover:text-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:text-10 lg:text-14 xl:text-16"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}

			<!-- ABOUT -->
			<div class="md:col-span-2 md:justify-self-center">
				<h3
					class="mb-2 font-dm-sans text-18 font-semibold md:text-13 lg:mb-4 lg:text-16 xl:text-18"
				>
					About
				</h3>

				<p
					class="mb-2 font-dm-sans text-16 leading-relaxed font-normal md:text-10 lg:mb-3 lg:text-14 xl:text-16"
				>
					<!-- We only carry designs we believe in<br /> ethically and aesthetically – original,<br /> authentic
					pieces that are made to last. -->
					Science-backed skincare made<br/> for sensitive Indian skin. Kohl & Spice focuses<br/> on gentle, effective formulas that actually work.

				</p>

				<a
					href="/about"
					class="font-dm-sans text-16 font-medium hover:opacity-80 md:text-12 lg:text-14 xl:text-16"
				>
					Learn More
				</a>
			</div>
		</div>

		<!-- DIVIDER -->
		<div class="my-4 h-px bg-zinc-80/20 lg:my-8"></div>

		<!-- BOTTOM -->
		<div
			class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between"
		>
			<!-- COPYRIGHT -->
			<p
				class="hidden font-dm-sans text-16 font-normal text-black/80 md:block md:text-10 lg:text-14 xl:text-16"
			>
				© {currentYear} Kohl & Spice
			</p>

			<!-- LEGAL + PAYMENTS -->
			<div class="flex flex-col gap-4 md:flex-row md:items-center">
				<div class="flex gap-4 font-dm-sans text-16 font-normal md:text-10 lg:text-14 xl:text-16">
					<a href="/privacy" class="hover:text-black/80">Privacy Policy</a>
					<a href="/terms" class="hover:text-black/80">Terms of Service</a>
				</div>

				<!-- PAYMENT ICONS -->
				<div class="flex gap-2">
					<RazorpayLogo />
					<!-- {#each ['visa', 'master-card', 'express', 'paypal', 'ad', 'discover'] as icon}
						<SvgIcon {icon} className="w-10 h-10 md:w-5 md:h-5 lg:w-8 lg:h-8" />
					{/each} -->
				</div>
			</div>

			<!-- COPYRIGHT -->
			<p class="font-dm-sans text-16 font-normal text-black/80 md:hidden md:text-10 lg:text-16">
				© {currentYear} Kohl & Spice
			</p>
		</div>
	</footer>
</div>
