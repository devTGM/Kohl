<script lang="ts">
	import type { ShopifyArticle } from '$lib/types/shopify';

	type DisplayPost = {
		title: string;
		date: string;
		image: string;
		alt: string;
		url?: string | null;
	};

	export let posts: ShopifyArticle[] = [];

	const fallbackPosts: DisplayPost[] = [
		{
			title: 'Milky Serums Are Having a Moment, But What Makes Them Work?',
			date: 'June 28, 2026',
			image: '/images/blogs/1.webp',
			alt: 'Dropper resting on a clear dish',
			url: null
		},
		{
			title: 'Transparency Over Trends: What’s Really in Your Serum?',
			date: 'June 28, 2026',
			image: '/images/blogs/2.webp',
			alt: 'Serum ingredients arranged in glass dishes',
			url: null
		},
		{
			title: 'Minimal Skincare, Maximum Results: The Art of Doing Less',
			date: 'June 28, 2026',
			image: '/images/blogs/3.webp',
			alt: 'Dropper over a milky texture',
			url: null
		}
	];

	const formatDate = (value?: string | null) => {
		if (!value) return '';
		const date = new Date(value);
		return Number.isNaN(date.valueOf())
			? ''
			: new Intl.DateTimeFormat('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				}).format(date);
	};

	let displayedPosts: DisplayPost[] = fallbackPosts;
	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;

	$: displayedPosts = posts?.length
		? posts.map((post, index) => {
				const fallback = fallbackPosts[index % fallbackPosts.length];
				return {
					title: post.title,
					date: formatDate(post.publishedAt) || fallback.date,
					image: post.image?.url ?? fallback.image,
					alt: post.image?.altText ?? post.title,
					url: post.handle ? `/blog/${post.handle}` : (post.url ?? null)
				};
			})
		: fallbackPosts;
	$: currentIndex = Math.min(currentIndex, Math.max(0, displayedPosts.length - 1));

	const goToSlide = (index: number) => {
		currentIndex = Math.max(0, Math.min(displayedPosts.length - 1, index));
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent) => {
		touchEndX = event.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		const delta = touchStartX - touchEndX;

		if (delta > 40) {
			goToSlide(currentIndex + 1);
		} else if (delta < -40) {
			goToSlide(currentIndex - 1);
		}

		touchStartX = 0;
		touchEndX = 0;
	};
</script>

<section class="bg-white py-18 md:py-18 lg:py-20" aria-labelledby="recent-blogs-heading">
	<div class="custom-container">
		<div class="space-y-2 text-center">
			<h2
				id="recent-blogs-heading"
				class="font-libre text-32 text-brown-300 italic md:text-36 lg:text-48"
			>
				Recent Blogs
			</h2>
		</div>

		<!-- Mobile carousel -->
		<div
			class="mt-7 block md:hidden"
			role="region"
			aria-label="Recent blogs carousel"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
		>
			<div class="overflow-hidden">
				<div
					class="flex transition-transform duration-300 ease-out"
					style={`transform: translateX(-${currentIndex * 100}%);`}
				>
					{#each displayedPosts as post}
						<article class="w-full shrink-0 px-3">
							{#if post.url}
								<a href={post.url} class="block space-y-4">
									<div class="relative overflow-hidden rounded-2xl bg-brown-450">
										<span
											class="absolute top-4 left-4 rounded-md bg-white px-3 py-1 font-dm-sans text-14 font-semibold"
										>
											{post.date}
										</span>
										<img
											src={post.image}
											alt={post.alt}
											loading="lazy"
											class="h-80 w-full object-cover md:h-90 lg:h-95"
										/>
									</div>
									<h3 class="font-dm-sans text-20 leading-130 md:text-22">
										{post.title}
									</h3>
								</a>
							{:else}
								<div class="space-y-4">
									<div class="relative overflow-hidden rounded-2xl bg-brown-450">
										<span
											class="absolute top-4 left-4 rounded-md bg-white px-3 py-1 font-dm-sans text-14 font-semibold"
										>
											{post.date}
										</span>
										<img
											src={post.image}
											alt={post.alt}
											loading="lazy"
											class="h-80 w-full object-cover md:h-90 lg:h-95"
										/>
									</div>
									<h3 class="font-dm-sans text-20 leading-130 md:text-22">
										{post.title}
									</h3>
								</div>
							{/if}
						</article>
					{/each}
				</div>
			</div>

			<div class="mt-5 flex items-center justify-center gap-1.25">
				{#each displayedPosts as _, index}
					<button
						type="button"
						class={`h-2.5 w-2.5 rounded-full transition ${
							index === currentIndex ? 'bg-main-brown' : 'bg-[#f4eee6]'
						}`}
						on:click={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
						aria-current={index === currentIndex}
					></button>
				{/each}
			</div>
		</div>

		<!-- Desktop grid -->
		<div class="mt-7 hidden gap-8 md:grid md:grid-cols-2 xl:grid-cols-3">
			{#each displayedPosts as post}
				<article class="space-y-4">
					{#if post.url}
						<a href={post.url} class="block space-y-4">
							<div class="relative overflow-hidden rounded-2xl bg-brown-450">
								<span
									class="absolute top-4 left-4 rounded-md bg-white px-3 py-1 font-dm-sans text-14 font-semibold"
								>
									{post.date}
								</span>
								<img
									src={post.image}
									alt={post.alt}
									loading="lazy"
									class="h-80 w-full object-cover md:h-90 lg:h-95"
								/>
							</div>
							<h3 class="font-dm-sans text-20 leading-130 md:text-22">
								{post.title}
							</h3>
						</a>
					{:else}
						<div class="space-y-4">
							<div class="relative overflow-hidden rounded-2xl bg-brown-450">
								<span
									class="absolute top-4 left-4 rounded-md bg-white px-3 py-1 font-dm-sans text-14 font-semibold"
								>
									{post.date}
								</span>
								<img
									src={post.image}
									alt={post.alt}
									loading="lazy"
									class="h-80 w-full object-cover md:h-90 lg:h-95"
								/>
							</div>
							<h3 class="font-dm-sans text-20 leading-130 md:text-22">
								{post.title}
							</h3>
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>
