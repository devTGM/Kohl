<script lang="ts">
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import { contact } from '$lib/config/socials';

	const lastUpdated = '23rd October, 2025';
</script>

<svelte:head>
	<title>Privacy Policy | Kohl & Spice</title>
	<meta
		name="description"
		content={`Read how Kohl & Spice collects, uses, and protects your personal information. Updated ${lastUpdated}.`}
	/>
</svelte:head>

<section
	class="brand-story relative overflow-hidden py-18 lg:py-28"
	aria-labelledby="brand-story-heading"
>
	<div class="custom-container text-center font-libre text-40 text-brown-300 italic lg:text-72">
		<h1>Privacy Policy</h1>
	</div>
</section>

<section class="w-full bg-white px-4 py-12 font-sans md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl font-dm-sans text-black lg:px-8">
		<p class="mb-8 text-20 font-normal md:mb-10">
			Last Updated: {lastUpdated}
		</p>

		<div class="text-18 leading-relaxed">
			<p>
				At Kohl & Spice (www.kohlspice.in), we value your trust and respect your right to privacy.
				This Privacy Policy explains how we collect, use, share, and protect your personal
				information when you visit or make a purchase from our website.<br /> By accessing or using our
				website, you agree to the terms of this Privacy Policy and consent to the processing of your information
				as described below. This policy should be read together with our Terms & Conditions.
			</p>
		</div>

		<div class="mt-8 md:mt-10">
			<h2 class="mb-2 text-32 font-semibold md:mb-4">1. Information We Collect</h2>

			<p class="mb-2 text-18 font-medium">
				You may browse our website without sharing any personal details. However, we may collect
				personal information when you:
			</p>

			<ul class="mb-6 list-disc space-y-1 pl-8 text-18 md:mb-8">
				<li>Register or create an account on our website</li>
				<li>Place an order or subscribe to our services</li>
				<li>Participate in surveys, contests, or promotions</li>
				<li>Contact us by email, phone, or through customer support</li>
				<li>Interact with us on social media</li>
			</ul>

			<p class="mb-2 text-18 font-medium">
				The types of personal information we may collect include:
			</p>

			<ul class="list-disc space-y-1 pl-8 text-18">
				<li>Name, email address, phone number, and billing/shipping address</li>
				<li>Transaction details (excluding credit/debit card or banking information)</li>
				<li>Records of communications and service interactions</li>
				<li>Technical information such as IP address, browser type, and location data</li>
				<li>
					Note: We do not collect or store your credit/debit card details. Payments are securely
					processed through third-party payment gateways.
				</li>
			</ul>
		</div>

		<div class="mt-8 md:mt-10">
			<h2 class="mb-2 text-32 font-semibold md:mb-4">10. Contact Us</h2>
			<p class="mb-2 text-18 leading-relaxed">
				If you have any questions, concerns, or complaints about this Privacy Policy or how your
				data is handled, please contact us at:
			</p>
			<a
				href={`mailto:${contact.email}`}
				class="text-18 font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
			>
				{contact.email}
			</a>
		</div>
	</div>
</section>

<!-- Subscribe Section -->
<Subscribe />

<style>
	.brand-story {
		background-color: #f0e5d8;
		background-image: url('/images/texture.webp');
		background-repeat: no-repeat, repeat;
		background-size:
			cover,
			480px 480px;
	}
</style>
