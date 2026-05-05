<script lang="ts">
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import { contact } from '$lib/config/socials';

	const lastUpdated = '23rd October, 2025';
</script>

<svelte:head>
	<title>Shipping & Delivery | Kohl & Spice</title>
	<meta
		name="description"
		content={`Learn about Kohl & Spice shipping timelines, processing, and delivery policies. Updated ${lastUpdated}.`}
	/>
</svelte:head>

<section
	class="brand-story relative overflow-hidden py-18 lg:py-28"
	aria-labelledby="shipping-heading"
>
	<div class="custom-container text-center font-libre text-40 text-brown-300 italic lg:text-72">
		<h1 id="shipping-heading">Shipping & Delivery</h1>
	</div>
</section>

<section class="w-full bg-white px-4 py-12 font-sans md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl space-y-8 font-dm-sans text-black md:space-y-10 lg:px-8">
		<p class="text-20 font-normal">Last Updated: {lastUpdated}</p>

		<div class="space-y-6 text-18 leading-relaxed">
			<p>
				We aim to get your Kohl & Spice products to you quickly and safely. Below are our shipping
				and delivery practices. For any questions, reach us at
				<a
					href={`mailto:${contact.email}`}
					class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
				>
					{contact.email}
				</a>.
			</p>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">1. Processing Times</h2>
				<p>
					Orders are typically processed within 1–2 business days (excluding weekends and holidays).
				</p>
				<p>
					During launches or peak periods, processing may take slightly longer. You’ll receive an
					email with tracking details once your order ships.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">2. Shipping Methods & Timelines</h2>
				<p>Standard delivery within India typically takes 3–7 business days after dispatch.</p>
				<p>
					Remote locations may take longer. We partner with trusted carriers; delays due to weather,
					operational issues, or regulatory checks are outside our control.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">3. Shipping Fees</h2>
				<p>
					Shipping fees (if any) are shown at checkout before payment. Promotions or free-shipping
					thresholds may apply and can change over time.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">4. Order Tracking</h2>
				<p>
					Once dispatched, you’ll receive a tracking link via email/SMS. Please allow up to 24 hours
					for the tracking status to update after shipment.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">5. Address Accuracy</h2>
				<p>
					Please provide complete and accurate shipping details. We’re not responsible for delays or
					losses due to incorrect/incomplete addresses. If you need to update an address after
					placing an order, contact us immediately.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">6. Delivery Attempts</h2>
				<p>
					Carriers usually make multiple attempts. If delivery fails after repeated attempts, the
					order may be returned to us. We can reship (additional fees may apply) or process a refund
					excluding shipping fees, after inspection.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">7. Damaged or Missing Items</h2>
				<p>
					If your package arrives damaged or missing items, contact us within 48 hours with photos
					and your order details at
					<a
						href={`mailto:${contact.email}`}
						class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
					>
						{contact.email}
					</a>. We’ll investigate and assist with replacements or resolutions.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">8. International Shipping</h2>
				<p>
					Currently, we ship within India only. If international shipping becomes available, we’ll
					update this page with applicable duties, taxes, and timelines.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">9. Contact</h2>
				<p>
					For any shipping or delivery questions, email
					<a
						href={`mailto:${contact.email}`}
						class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
					>
						{contact.email}
					</a>.
				</p>
			</div>
		</div>
	</div>
</section>

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
