<script lang="ts">
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import { contact } from '$lib/config/socials';

	const lastUpdated = '23rd October, 2025';
</script>

<svelte:head>
	<title>Terms & Conditions | Kohl & Spice</title>
	<meta
		name="description"
		content={`Read the terms for using Kohl & Spice, including purchases, returns, and site use. Updated ${lastUpdated}.`}
	/>
</svelte:head>

<section
	class="brand-story relative overflow-hidden py-18 lg:py-28"
	aria-labelledby="terms-heading"
>
	<div class="custom-container text-center font-libre text-40 text-brown-300 italic lg:text-72">
		<h1 id="terms-heading">Terms & Conditions</h1>
	</div>
</section>

<section class="w-full bg-white px-4 py-12 font-sans md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl space-y-8 font-dm-sans text-black md:space-y-10 lg:px-8">
		<p class="text-20 font-normal">Last Updated: {lastUpdated}</p>

		<div class="space-y-6 text-18 leading-relaxed">
			<p>
				Welcome to Kohl & Spice (www.kohlspice.in). By accessing or purchasing from our site, you
				agree to these Terms & Conditions. Please read them carefully. If you disagree with any
				part, please do not use our website.
			</p>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">1. Eligibility & Account</h2>
				<p>You must be at least 18 years old or using the site under supervision of a guardian.</p>
				<p>
					You are responsible for maintaining the confidentiality of your account credentials and
					for all activities under your account.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">2. Products & Orders</h2>
				<p>
					All products are offered subject to availability. Prices, offers, and formulations may
					change without notice.
				</p>
				<p>
					We reserve the right to refuse or cancel any order (including suspected fraud, inaccurate
					pricing, or inventory issues). If we cancel, we will refund any payment received.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">3. Payments</h2>
				<p>
					Payments are processed securely through third-party gateways. We do not store card or bank
					details. You agree to provide accurate billing information and authorize charges for your
					orders.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">4. Shipping & Delivery</h2>
				<p>
					Shipping timelines provided at checkout are estimates. Delays may occur due to logistics
					or external factors. Title and risk pass to you upon delivery.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">5. Returns & Refunds</h2>
				<p>
					For hygiene and safety, opened products are generally not returnable. If you receive a
					damaged, defective, or incorrect item, contact us within 48 hours with your order details
					and photos at
					<a
						href={`mailto:${contact.email}`}
						class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
						>{contact.email}</a
					>.
				</p>
				<p>
					Approved refunds will be processed to the original payment method; timelines may vary by
					bank.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">6. Use of Content</h2>
				<p>
					All content (text, images, graphics, trademarks) is owned by Kohl & Spice or licensed
					partners. You may not copy, reproduce, distribute, or create derivative works without
					prior written consent.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">7. User Conduct</h2>
				<p>
					You agree not to misuse the site, interfere with security, submit false information, or
					attempt unauthorized access. Any fraudulent or abusive behavior may lead to account
					termination and legal action.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">8. Disclaimers</h2>
				<p>
					Skincare results vary by individual. Always patch test and consult a dermatologist if you
					have specific concerns. The site and products are provided “as is” without warranties of
					any kind, express or implied, to the fullest extent permitted by law.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">9. Limitation of Liability</h2>
				<p>
					To the fullest extent permitted by law, Kohl & Spice is not liable for indirect,
					incidental, or consequential damages arising from use of the site or products. Our total
					liability for any claim is limited to the amount you paid for the product or service in
					question.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">10. Changes to Terms</h2>
				<p>
					We may update these Terms & Conditions periodically. Continued use of the site after
					changes means you accept the revised terms.
				</p>
			</div>

			<div class="space-y-3">
				<h2 class="text-28 font-semibold text-black">11. Contact</h2>
				<p class="text-18 leading-relaxed">
					For questions about these Terms, please email
					<a
						href={`mailto:${contact.email}`}
						class="font-medium text-brown-300 underline decoration-1 underline-offset-4 transition-colors hover:text-brown-200"
						>{contact.email}</a
					>.
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
