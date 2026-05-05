<script lang="ts">
	import SectionHeader from '$lib/components/web/SectionHeader.svelte';
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';

	import type { ShopifyArticle } from '$lib/types/shopify';
	import { format } from 'date-fns';

	export let data: { posts: ShopifyArticle[]; error: string | null };

	const formatDate = (value?: string | null) => {
		if (!value) return '';
		const date = new Date(value);
		return Number.isNaN(date.valueOf()) ? '' : format(date, 'MMMM d, yyyy');
	};

	const posts = data.posts ?? [];
</script>

<svelte:head>
	<title>Blog | Kohl & Spice</title>
	<meta name="description" content="Articles and stories from Kohl & Spice." />
</svelte:head>

<section
	class="brand-story relative overflow-hidden py-18 lg:py-28"
	aria-labelledby="terms-heading"
>
	<div class="custom-container text-center font-libre text-40 text-brown-300 italic lg:text-72">
		<h1 id="terms-heading">Blogs</h1>
	</div>
</section>

<section class="bg-white px-4 py-12 font-dm-sans text-gray-900 md:py-16">
	<div class="mx-auto flex flex-col gap-10">
		{#if data.error}
			<p class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-14 text-amber-800">
				{data.error}
			</p>
		{/if}

		<div class="custom-container grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
			{#each posts as post}
				<article class="group space-y-4">
					<a href={`/blog/${post.handle}`} class="block space-y-4">
						<div class="relative overflow-hidden rounded-2xl bg-brown-450">
							<span
								class="absolute top-4 left-4 rounded-md bg-white px-3 py-1 font-dm-sans text-14 font-semibold"
							>
								{formatDate(post.publishedAt)}
							</span>
							<img
								src={post.image?.url ?? '/images/blogs/1.webp'}
								alt={post.image?.altText ?? post.title}
								loading="lazy"
								class="h-80 w-full object-cover transition duration-300 group-hover:scale-105 md:h-90 lg:h-95"
							/>
						</div>
						<h3
							class="group-hover:text-brown-800 font-dm-sans text-20 leading-130 text-gray-900 transition md:text-22"
						>
							{post.title}
						</h3>
					</a>
				</article>
			{/each}
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
