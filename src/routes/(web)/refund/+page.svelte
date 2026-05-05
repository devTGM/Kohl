<script lang="ts">
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import { contact } from '$lib/config/socials';

	const lastUpdated = '23rd October, 2025';
</script>

<svelte:head>
	<title>Refund & Returns | Kohl & Spice</title>
	<meta
		name="description"
		content={`Understand Kohl & Spice return and refund policy for skincare purchases. Updated ${lastUpdated}.`}
	/>
</svelte:head>

<section
	class="brand-story relative overflow-hidden py-18 lg:py-28"
	aria-labelledby="refund-heading"
>
	<div class="custom-container text-center font-libre text-40 text-brown-300 italic lg:text-72">
		<h1 id="refund-heading">Refund & Returns Policy</h1>
	</div>
</section>

<section class="w-full bg-white px-4 py-12 font-sans md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl space-y-8 font-dm-sans text-black md:space-y-10 lg:px-8">
		<p class="text-20 font-normal">Last Updated: {lastUpdated}</p>

		<div class="space-y-6 text-18 leading-relaxed">
			<p>
				We want you to love Kohl & Spice. Due to the nature of skincare, opened items are generally
				not returnable. If there’s an issue, we’re here to help—please review the details below and
				reach us at
				<a
					href={`mailto:${contact.email}`}
					class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
				>
					{contact.email}
				</a>.
			</p>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">1. Eligibility</h2>
				<p>Unopened, unused products may be eligible for return within 7 days of delivery.</p>
				<p>
					Opened/used items are not eligible for return unless they arrived damaged or defective.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">2. Damaged or Incorrect Items</h2>
				<p>
					If you receive a damaged, leaking, or incorrect product, contact us within 48 hours of
					delivery with order details and photos. We will investigate and offer a replacement or
					refund as appropriate.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">3. Return Process</h2>
				<p>
					Email us at {contact.email} with your order number, issue, and photos (if applicable).
				</p>
				<p>
					Approved returns must be sent back in original packaging. Return shipping instructions
					will be shared; in some cases, return shipping costs may apply.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">4. Refunds</h2>
				<p>
					Once we receive and inspect the returned item, approved refunds are processed to the
					original payment method. Banks/payment providers may take 5–10 business days to reflect
					the amount.
				</p>
				<p>
					Shipping fees are non-refundable unless the return is due to our error (damaged/incorrect
					item).
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">5. Exchanges</h2>
				<p>
					Exchanges are subject to inventory availability. If unavailable, we’ll process a refund
					instead.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">6. Non-Returnable Items</h2>
				<p>
					Opened/used skincare products; items without original packaging; and free gifts or samples
					are non-returnable.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">7. Contact</h2>
				<p>
					For any refund/return questions, email
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
