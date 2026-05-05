<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import { contact } from '$lib/config/socials';
	import type { ActionData } from './$types';

	export let form: ActionData | undefined;

	let isSubmitting = false;

	const enhanceForm: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result, update }) => {
			isSubmitting = false;
			await update({ reset: result.type === 'success' });
		};
	};
</script>

<svelte:head>
	<title>Contact Kohl & Spice | Support & Questions</title>
	<meta
		name="description"
		content={`Reach Kohl & Spice for product questions, skincare advice, or order support. Call ${contact.phone} or email ${contact.email}.`}
	/>
</svelte:head>

<section class="w-full bg-white px-4 py-12 font-sans md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl">
		<div class="flex flex-col items-start lg:grid lg:grid-cols-5 lg:gap-4">
			<div class="contents font-dm-sans font-black lg:col-span-2 lg:flex lg:flex-col lg:gap-6">
				<div class="order-1 mb-4 w-full text-center lg:order-0 lg:mb-0 lg:text-left">
					<h2 class="mb-2 font-libre text-40 text-brown-300 italic lg:text-48">Contact Us</h2>
					<div class="mt-4 hidden space-y-4 lg:block">
						<p class="max-w-md pr-8 text-18 leading-relaxed font-normal">
							Let’s talk, We’re here to help. <br />
Whether you have a question about your routine, your order, or your skin concerns, our team is always ready to assist.
							<!-- Let's Talk, But You First! <br /> We're proud of the relationships we build. We're all wildly
							different from each other, so chances are at least one of us has something in common with
							you! -->
						</p>
					</div>
				</div>

				<div class="order-3 mt-8 w-full space-y-3 text-20 lg:order-0 lg:mt-auto">
					<div class="flex items-center justify-start gap-2 lg:justify-start">
						<span class="font-semibold">Call:</span>
						<a
							href={contact.phoneHref}
							class=" font-normal underline decoration-1 underline-offset-4 transition-colors hover:text-[#C49A85]"
						>
							{contact.phone}
						</a>
					</div>
					<div class="flex items-center justify-start gap-2 lg:justify-start">
						<span class="font-semibold">Email:</span>
						<a
							href={`mailto:${contact.email}`}
							class="font-normal underline decoration-1 underline-offset-4 transition-colors hover:text-[#C49A85]"
						>
							{contact.email}
						</a>
					</div>
				</div>
			</div>

			<div class="order-2 w-full lg:order-0 lg:col-span-3">
				<div class="rounded-20 border border-gray-100 bg-white p-4 font-dm-sans text-black md:p-10">
					<h3 class="mb-6 text-center text-20 font-semibold lg:text-left lg:text-24">
						Get in touch!
<!-- Stay Connected With Kohl & Spice -->
						<!-- You've got questions, we've got answers on anything! -->
					</h3>

					<form method="POST" class="space-y-4" use:enhance={enhanceForm}>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="space-y-1">
								<input
									name="name"
									type="text"
									placeholder="Enter your name"
									value={form?.values?.name ?? ''}
									required
									aria-invalid={form?.errors?.name ? 'true' : 'false'}
									class="w-full rounded-full border border-gray-100 bg-neutral-100 px-6 py-4 text-16 transition-all outline-none placeholder:text-16 placeholder:text-black/50 focus:ring-2 focus:ring-brown-300/50"
								/>
								{#if form?.errors?.name}
									<p class="text-12 text-red-600">{form.errors.name}</p>
								{/if}
							</div>
							<div class="space-y-1">
								<input
									name="email"
									type="email"
									placeholder="Enter your email"
									value={form?.values?.email ?? ''}
									required
									aria-invalid={form?.errors?.email ? 'true' : 'false'}
									class="w-full rounded-full border border-gray-100 bg-neutral-100 px-6 py-4 text-16 transition-all outline-none placeholder:text-16 placeholder:text-black/50 focus:ring-2 focus:ring-brown-300/50"
								/>
								{#if form?.errors?.email}
									<p class="text-12 text-red-600">{form.errors.email}</p>
								{/if}
							</div>
						</div>

						<div class="space-y-1">
							<input
								name="phone"
								type="tel"
								placeholder="Enter your phone number (optional)"
								value={form?.values?.phone ?? ''}
								class="w-full rounded-full border border-gray-100 bg-neutral-100 px-6 py-4 text-16 transition-all outline-none placeholder:text-16 placeholder:text-black/50 focus:ring-2 focus:ring-brown-300/50"
							/>
						</div>

						<div class="space-y-1">
							<textarea
								name="message"
								rows="4"
								placeholder="Any message"
								required
								aria-invalid={form?.errors?.message ? 'true' : 'false'}
								class="w-full resize-none rounded-3xl bg-neutral-100 px-6 py-4 text-sm text-16 transition-all outline-none placeholder:text-16 placeholder:text-black/50 focus:ring-2 focus:ring-brown-300/50"
								>{form?.values?.message ?? ''}</textarea
							>
							{#if form?.errors?.message}
								<p class="text-12 text-red-600">{form.errors.message}</p>
							{/if}
						</div>

						{#if form?.message}
							<p class={form?.success ? 'text-14 text-green-600' : 'text-14 text-red-600'}>
								{form.message}
							</p>
						{/if}

						<button
							type="submit"
							class="mt-2 w-full rounded-full bg-main-brown py-4 text-16 font-medium tracking-widest text-white uppercase shadow-md transition-colors hover:bg-[#4a3b36] disabled:cursor-not-allowed disabled:opacity-70"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Sending...' : 'Submit'}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
<Subscribe />
