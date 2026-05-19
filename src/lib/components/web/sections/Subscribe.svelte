<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

	let email = '';
	let isSubmitting = false;
	let message = '';
	let messageVariant: 'success' | 'error' | '' = '';

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		message = '';
		messageVariant = '';

		const trimmedEmail = email.trim();

		if (!EMAIL_REGEX.test(trimmedEmail)) {
			message = 'Please enter a valid email address.';
			messageVariant = 'error';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: trimmedEmail })
			});

			const result = await response.json().catch(() => null);

			if (response.ok) {
				message = result?.message ?? 'Thanks for subscribing!';
				messageVariant = 'success';
				email = '';
			} else {
				message = result?.message ?? 'We could not add your email right now. Please try again.';
				messageVariant = 'error';
			}
		} catch (error) {
			message = 'We hit a network glitch. Please give it another shot in a moment.';
			messageVariant = 'error';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<footer class="relative overflow-hidden bg-[#85B6D6] px-5 py-18 lg:pt-20 lg:pb-15">
	<div class="custom-container relative z-10 flex flex-col items-center text-center">
		<SvgIcon icon="envelope" className="" />

		<div
			class="mt-4 rounded-full border border-white px-8 py-3 font-dm-sans text-16 leading-150 text-white"
		>
			<span class=" font-bold">1000+ </span> MEMBER JOINED
		</div>

		<h2 class=" pt-3 text-40 leading-130 text-white md:text-72">
			<span class=" font-libre italic">Get 10% Off </span>
			<br />
			<span class=" font-dm-sans">By Subscribing To Us</span>
		</h2>

		<form
			class="mt-10 flex w-full max-w-md items-center rounded-full bg-white p-0.5 shadow-md"
			on:submit={handleSubmit}
		>
			<input
				type="email"
				placeholder="Enter your email ID"
				class="w-full px-6 font-inter text-black focus:outline-none"
				bind:value={email}
				required
				aria-label="Email address"
				aria-invalid={messageVariant === 'error'}
			/>
			<button
				type="submit"
				aria-label="Submit email"
				class="flex-shrink-0 cursor-pointer rounded-full bg-[#518cb4] p-3 text-white transition-colors hover:bg-[#518cb4]/90"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<span
						class="block h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
				{:else}
					<SvgIcon icon="arrow-right" className="h-5 w-5" />
				{/if}
			</button>
		</form>
		{#if message}
			<p
				class={`mt-4 max-w-md text-left font-inter text-sm ${
					messageVariant === 'success' ? 'text-white' : 'text-[#fca5a5]'
				}`}
				role="status"
				aria-live="polite"
			>
				{message}
			</p>
		{/if}
	</div>
</footer>
