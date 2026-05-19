<script lang="ts">
	import SvgIcon from '$lib/components/SvgIcon.svelte';
	import SectionHeader from '../SectionHeader.svelte';
	import type { ShopifyProduct, ShopifyReview, ShopifyReviewSummary } from '$lib/types/shopify';
	import { fade } from 'svelte/transition';

	let {
		product = null,
		reviews = [],
		reviewSummary = null
	} = $props<{
		product: ShopifyProduct | null;
		reviews: ShopifyReview[];
		reviewSummary: ShopifyReviewSummary | null;
	}>();

	const fallbackReviews: ShopifyReview[] = [
		{
			id: '1',
			author: 'Salaja R.',
			createdAt: '2025-11-28',
			rating: 5,
			title: 'This serum lightened my melasma patches significantly!',
			content:
				'Have been using the correcting concentrate serum from Aminu since the last 2 months. I am very happy to report that the product has lightened my melasma patches significantly. And it has given a glowing effect to my face also. Thank you very much Aminu.',
			image: null
		},
		{
			id: '2',
			author: 'Kamal A.',
			createdAt: '2025-11-24',
			rating: 5,
			title: 'Visible change',
			content:
				'My pigmentation on my cheeks have faded very much, becoming lighter and lighter by the day, visible change.',
			image: null
		},
		{
			id: '3',
			author: 'Swati B.',
			createdAt: '2025-11-11',
			rating: 5,
			title: 'Correcting and clarifying concentrate Works Like magic',
			content:
				'I got the correcting concentrate and clarifying concentrate for my daughter who is studying in the US and had been struggling with acne last 5-6 years and nothing was working on her. I had a talk with aminu representative and they asked me to try these products... The before/after pic was taken within the gap of just one week.',
			image: { url: 'images/testimonial/1.webp', altText: 'User Review' }
		},
		{
			id: '4',
			author: 'Sasivardhini',
			createdAt: '2025-07-21',
			rating: 5,
			title: "God's gift 🍎 to me 🙏",
			content:
				"No words to explain the one stop solution AMINU CC serum... It's adaptable to my sensitive skin and extremely oily skin... It is a magic potion in a bottle... It doesn't make any irritation to my skin... The serum is nourishing and makes the skin feel soft and look healthier.",
			image: { url: 'images/testimonial/2.webp', altText: 'User Review' }
		},
		{
			id: '5',
			author: 'Poornima',
			createdAt: '2025-09-08',
			rating: 5,
			title: 'Miraculously ❤️😍',
			content:
				'Aminu is the only one in the market who focusing on effective solutions for common skin issues such as dryness, oiliness, dark circles and aging... They emphasize the importance of choosing products that balance natural ingredients with scientific innovation.',
			image: null
		},
		{
			id: '6',
			author: 'Angela',
			createdAt: '2025-05-15',
			rating: 5,
			title: null,
			content:
				'I have been dealing with dark spots and pigmentation since my teens, and after getting chicken pox last year, it only got worse I have tried everything, every serum and home remedy but nothing worked like the Correcting Concentrate. This is the only serum that actually made a difference and I started seeing results in just a month. Forever a fan <3',
			image: null
		},
		{
			id: '7',
			author: 'Jagruti',
			createdAt: '2025-05-15',
			rating: 5,
			title: 'Great results',
			content:
				'I have been using it for past two months and can see improvements in my skin when I use it consistently.',
			image: null
		}
	];

	const computeSummary = (list: ShopifyReview[]): ShopifyReviewSummary => {
		const total = list.length;
		const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
		const average = total ? Number((sum / total).toFixed(2)) : 0;
		const distribution = [1, 2, 3, 4, 5].map((stars) => ({
			stars,
			count: list.filter((r) => Math.round(Number(r.rating) || 0) === stars).length
		}));

		return { average, total, distribution };
	};

	let reviewList = $state<ShopifyReview[]>(reviews?.length ? reviews : []);
	let hasUserAddedReview = $state(false);
	let showAll = $state(false);

	const visibleReviews = $derived(
		showAll || reviewList.length <= 10 ? reviewList : reviewList.slice(0, 10)
	);

	$effect(() => {
		if (hasUserAddedReview) return;
		if (reviews && reviews.length) {
			reviewList = reviews;
		} else if (reviewSummary?.total && reviewSummary.total > 0) {
			reviewList = fallbackReviews;
		} else if (
			!reviews?.length &&
			(!reviewSummary || reviewSummary.total === 0) &&
			!reviewList.length
		) {
			reviewList = fallbackReviews;
		}
	});

	const ratingSummary = $derived(
		reviewList.length
			? computeSummary(reviewList)
			: reviewSummary && reviewSummary.total > 0
				? reviewSummary
				: computeSummary(fallbackReviews)
	);

	let isModalOpen = $state(false);
	let submitStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let submitMessage = $state<string | null>(null);
	let selectedReviewImage = $state<File | null>(null);
	let selectedReviewImagePreview = $state<string | null>(null);
	let reviewForm = $state({
		rating: 0,
		content: '',
		title: '',
		author: '',
		email: ''
	});

	const formatDate = (value?: string | null) => {
		if (!value) return '';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return new Intl.DateTimeFormat('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(date);
	};

	const toWholeStars = (value: number) => Math.min(5, Math.max(1, Math.round(value || 0)));

	const selectRating = (value: number) => {
		reviewForm = { ...reviewForm, rating: value };
	};

	const setReviewImage = (file: File | null) => {
		if (selectedReviewImagePreview) URL.revokeObjectURL(selectedReviewImagePreview);
		selectedReviewImage = file;
		selectedReviewImagePreview = file ? URL.createObjectURL(file) : null;
	};

	const onReviewImageChange = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0] ?? null;
		setReviewImage(file);
	};

	const openReviewModal = () => {
		isModalOpen = true;
		submitStatus = 'idle';
		submitMessage = null;
		reviewForm = { rating: 0, content: '', title: '', author: '', email: '' };
		setReviewImage(null);
	};

	const closeReviewModal = () => {
		isModalOpen = false;
		setReviewImage(null);
	};

	const submitReview = async () => {
		if (!product?.id) {
			submitStatus = 'error';
			submitMessage = 'Product not available yet.';
			return;
		}

		if (!reviewForm.rating || !reviewForm.content.trim()) {
			submitStatus = 'error';
			submitMessage = 'Please select a rating and add your review.';
			return;
		}

		if (!reviewForm.author.trim() || !reviewForm.email.trim()) {
			submitStatus = 'error';
			submitMessage = 'Name and email are required.';
			return;
		}

		submitStatus = 'loading';
		submitMessage = null;

		try {
			let reviewImageUrl: string | null = null;
			let reviewImageKey: string | null = null;
			if (selectedReviewImage) {
				const uploadForm = new FormData();
				uploadForm.append('image', selectedReviewImage);

				const uploadRes = await fetch('/api/reviews/upload-image', {
					method: 'POST',
					body: uploadForm
				});
				const uploadData = await uploadRes.json().catch(() => ({}));
				if (!uploadRes.ok || !uploadData?.ok || !uploadData?.key) {
					throw new Error(uploadData?.message ?? 'Unable to upload review image.');
				}
				reviewImageKey = String(uploadData.key);
				reviewImageUrl = uploadData?.url ? String(uploadData.url) : null;
			}

			const res = await fetch('/api/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productId: product.id,
					rating: reviewForm.rating,
					title: reviewForm.title || null,
					content: reviewForm.content.trim(),
					authorName: reviewForm.author.trim(),
					authorEmail: reviewForm.email.trim(),
					reviewImageUrl,
					reviewImageKey
				})
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok || !data?.ok) {
				throw new Error(data?.message ?? 'Unable to submit review.');
			}

			const newReview: ShopifyReview = data.review ?? {
				id: `temp-${Date.now()}`,
				rating: reviewForm.rating,
				title: reviewForm.title || null,
				content: reviewForm.content.trim(),
				author: reviewForm.author || 'You',
				email: reviewForm.email || null,
				createdAt: new Date().toISOString(),
				status: 'PENDING',
				image: reviewImageUrl
					? { url: reviewImageUrl, altText: 'User review image' }
					: selectedReviewImagePreview
						? { url: selectedReviewImagePreview, altText: 'User review image' }
						: null
			};

			reviewList = [newReview, ...reviewList];
			hasUserAddedReview = true;
			submitStatus = 'success';
			submitMessage = data?.message ?? 'Review submitted successfully.';
			isModalOpen = false;
		} catch (error) {
			submitStatus = 'error';
			submitMessage = error instanceof Error ? error.message : 'Unable to submit review.';
		}
	};
</script>

<section class="w-full bg-white px-4 py-12 font-sans text-gray-800 lg:py-20">
	<div class="mx-auto max-w-7xl">
		<SectionHeader
			eyebrow="Testimonials"
			title="Our Customers Rate Us"
			class="mb-10 px-10 text-brown-300 lg:px-0"
		/>

		<div
			class="mb-4 border border-gray-100 bg-white p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] lg:p-10"
		>
			<h3 class="mb-4 text-center font-poppins text-24 font-semibold text-gray-800">
				what they're saying!
			</h3>

			<div class="flex h-fit flex-col items-center justify-around gap-8 lg:flex-row lg:gap-12">
				<div class="flex w-full flex-col items-center whitespace-nowrap lg:w-auto lg:items-start">
					<div class="mb-1 flex items-center gap-2">
						<div class="flex text-sm text-yellow-400">
							{#each Array(5) as _}
								<SvgIcon icon="star" />
							{/each}
						</div>
						<span class="font-gill text-16 font-normal text-neutral-850"
							>{ratingSummary.average} out of 5</span
						>
					</div>
					<p class="font-gill text-16 font-normal text-neutral-850">
						{ratingSummary.total} reviews
					</p>
				</div>

				<div class="hidden w-px self-stretch bg-black/10 lg:block"></div>

				<div class="w-full max-w-xs lg:flex-1">
					<div class="space-y-1">
						{#each ratingSummary.distribution as dist}
							<div class="flex items-center gap-3 text-xs text-gray-400">
								<div class="flex w-24 items-center justify-end gap-0.5 text-yellow-400">
									{#each Array(5) as _, i}
										{#if i < dist.stars}
											<SvgIcon icon="star" />
										{:else}
											<SvgIcon icon="empty-star" />
										{/if}
									{/each}
								</div>
								<div class="h-3 w-[30%] flex-1 overflow-hidden bg-gray-100">
									<div
										class="h-full bg-[#4a7ba1]"
										style="width: {ratingSummary.total
											? (dist.count / ratingSummary.total) * 100
											: 0}%"
									></div>
								</div>
								<span class="w-6 text-left font-gill text-12 text-neutral-550">{dist.count}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="hidden w-px self-stretch bg-black/10 lg:block"></div>

				<div class="flex w-full min-w-[180px] flex-col items-center gap-3 lg:w-auto">
					<button
						class="w-max rounded-full bg-main-brown px-18 py-3 font-poppins text-16 font-semibold tracking-widest text-white uppercase shadow-sm transition-colors hover:bg-main-brown/90 lg:w-full"
						onclick={openReviewModal}
					>
						Write a Review
					</button>
					<button
						class="w-max rounded-full bg-neutral-100 px-18 py-3 font-poppins text-16 font-semibold tracking-widest text-gray-700 uppercase transition-colors hover:bg-neutral-200 lg:w-full"
					>
						Ask a Question
					</button>
				</div>
			</div>
		</div>

		<div class="columns-1 gap-4 space-y-4 lg:columns-3">
			{#if reviewList.length === 0}
				<div
					class="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-14 text-gray-600"
				>
					No reviews yet. Be the first to share your experience.
				</div>
			{:else}
				{#each visibleReviews as review}
					<div
						class="break-inside-avoid border border-gray-100 bg-white p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-md"
					>
						<div class="mb-4 flex items-start justify-between">
							<div class="flex text-sm text-yellow-400">
								{#each Array(toWholeStars(review.rating)) as _}
									<span>★</span>
								{/each}
							</div>
							<span class="font-gill text-12 text-neutral-550">{formatDate(review.createdAt)}</span>
						</div>

						<div class="mb-4 flex items-center gap-2">
							<div class="flex h-8 w-8 items-center justify-center bg-gray-100 text-gray-500">
								<SvgIcon icon="profile" />
							</div>
							<span class="font-gill text-16 text-black">{review.author ?? 'Anonymous'}</span>
						</div>

						{#if review.image}
							<div class="mb-4 overflow-hidden">
								<img
									src={review.image.url}
									alt={review.image.altText ?? 'User Review'}
									class="h-auto w-full object-cover"
								/>
							</div>
						{/if}

						{#if review.title}
							<h4 class="mb-2 font-gill text-16 font-semibold text-neutral-850">{review.title}</h4>
						{/if}
						<p class="mb-4 font-gill text-14 leading-5 text-neutral-850">
							{review.content}
						</p>

						<!-- <div class="flex gap-3 pt-2 text-gray-400">
						<button class="hover:text-blue-600">
							<SvgIcon icon='facebook-2' />
						</button>
						<button class="hover:text-blue-700">
							<SvgIcon icon='linkedin' />
						</button>
					</div> -->
					</div>
				{/each}
				{#if reviewList.length > visibleReviews.length}
					<div class="mt-2 flex justify-center">
						<button
							class="rounded-full border border-brown-300 px-6 py-2 text-14 font-semibold tracking-wide text-brown-300 uppercase transition hover:bg-brown-300 hover:text-white"
							onclick={() => (showAll = true)}
						>
							Show More Reviews
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</section>

{#if isModalOpen}
	<div
		transition:fade
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
		role="button"
		tabindex="0"
		aria-label="Close review modal"
		onclick={closeReviewModal}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && closeReviewModal()}
	></div>
	<div
		transition:fade
		class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 font-dm-sans"
		data-lenis-prevent
	>
		<div
			class="relative w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 shadow-2xl lg:p-8"
			style="max-height: calc(100dvh - 2rem);"
			data-lenis-prevent
		>
			<button
				class="absolute top-4 right-4 text-18 text-gray-400 hover:text-gray-700"
				aria-label="Close review modal"
				onclick={closeReviewModal}
			>
				×
			</button>

			<h3 class="text-center text-22 font-semibold text-gray-900">
				How would you rate this product?
			</h3>
			<p class="mt-2 text-center text-14 text-gray-600">
				We would love it if you would share a bit about your experience.
			</p>

			{#if product?.images?.length}
				<div class="mt-5 flex justify-center">
					<img
						src={product.images[0].url}
						alt={product.images[0].altText ?? product.title}
						class="h-28 w-28 rounded-lg object-cover shadow-sm"
					/>
				</div>
			{/if}

			<p class="mt-3 text-center text-16 font-semibold text-gray-900">
				{product?.title ?? 'This product'}
			</p>

			<div class="mt-4 flex items-center justify-center gap-2">
				{#each Array(5) as _, i}
					<button
						type="button"
						class="transition-transform"
						onclick={() => selectRating(i + 1)}
						aria-label={`Rate ${i + 1} star${i + 1 === 1 ? '' : 's'}`}
					>
						<SvgIcon
							icon="star"
							className={`h-8 w-8 ${
								reviewForm.rating >= i + 1 ? 'text-teal-600' : 'text-gray-300'
							}`}
						/>
					</button>
				{/each}
			</div>
			<div class="mt-1 flex justify-between text-12 font-semibold text-gray-500">
				<span>Poor</span>
				<span>Great</span>
			</div>

			<div class="mt-6 space-y-4">
				<div>
					<label class="text-14 font-semibold text-gray-800" for="review-content">
						Review content (Required)
					</label>
					<textarea
						id="review-content"
						class="mt-2 min-h-[140px] w-full rounded-lg border border-gray-200 p-3 text-14 text-gray-800 focus:border-main-brown focus:ring-1 focus:ring-main-brown focus:outline-none"
						placeholder="Start writing here..."
						bind:value={reviewForm.content}
					></textarea>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<!-- <div class="space-y-2">
						<label class="text-14 font-semibold text-gray-800" for="review-title">
							Title (Optional)
						</label>
						<input
							id="review-title"
							class="w-full rounded-lg border border-gray-200 p-3 text-14 text-gray-800 focus:border-main-brown focus:ring-1 focus:ring-main-brown focus:outline-none"
							placeholder="Great results"
							bind:value={reviewForm.title}
						/>
					</div> -->
					<div class="space-y-2">
						<label class="text-14 font-semibold text-gray-800" for="review-name">
							Name (Required)
						</label>
						<input
							id="review-name"
							class="w-full rounded-lg border border-gray-200 p-3 text-14 text-gray-800 focus:border-main-brown focus:ring-1 focus:ring-main-brown focus:outline-none"
							placeholder="Your name"
							bind:value={reviewForm.author}
						/>
					</div>
					<div>
						<label class="text-14 font-semibold text-gray-800" for="review-email">
							Email (Required)
						</label>
						<input
							id="review-email"
							type="email"
							class="w-full rounded-lg border border-gray-200 p-3 text-14 text-gray-800 focus:border-main-brown focus:ring-1 focus:ring-main-brown focus:outline-none"
							placeholder="you@example.com"
							bind:value={reviewForm.email}
						/>
						<p class="text-12 text-gray-500">
							We'll only contact you about your review if necessary.
						</p>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-14 font-semibold text-gray-800" for="review-image">
						Image (Optional)
					</label>
					<input
						id="review-image"
						type="file"
						accept="image/png,image/jpeg,image/webp"
						class="block w-full rounded-lg border border-gray-200 p-3 text-14 text-gray-800 file:mr-3 file:rounded-md file:border-0 file:bg-main-brown/10 file:px-3 file:py-1 file:text-13 file:font-semibold file:text-main-brown focus:border-main-brown focus:ring-1 focus:ring-main-brown focus:outline-none"
						onchange={onReviewImageChange}
					/>
					<p class="text-12 text-gray-500">JPG, PNG, or WEBP up to 5MB.</p>
					{#if selectedReviewImagePreview}
						<div class="mt-2 overflow-hidden rounded-lg border border-gray-200">
							<img
								src={selectedReviewImagePreview}
								alt="Selected review"
								class="h-40 w-full object-cover"
							/>
						</div>
						<button
							type="button"
							class="text-13 font-semibold text-gray-600 hover:text-gray-900"
							onclick={() => setReviewImage(null)}
						>
							Remove image
						</button>
					{/if}
				</div>
			</div>

			{#if submitMessage}
				<p
					class="mt-3 text-13 font-semibold {submitStatus === 'error'
						? 'text-red-600'
						: 'text-emerald-600'}"
				>
					{submitMessage}
				</p>
			{/if}

			<div class="mt-6 flex items-center justify-between">
				<button
					type="button"
					class="text-14 font-semibold text-gray-600 hover:text-gray-900"
					onclick={closeReviewModal}
				>
					Cancel
				</button>
				<button
					type="button"
					class="rounded-full bg-main-brown px-6 py-3 text-14 font-semibold tracking-wide text-white uppercase shadow-sm transition-colors hover:bg-main-brown/90 disabled:opacity-60"
					onclick={submitReview}
					disabled={submitStatus === 'loading'}
				>
					{submitStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
				</button>
			</div>
		</div>
	</div>
{/if}
