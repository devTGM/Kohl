<script lang="ts">
	import Subscribe from '$lib/components/web/sections/Subscribe.svelte';
	import type { ShopifyArticle } from '$lib/types/shopify';
	import { format } from 'date-fns';

	export let data: { article: ShopifyArticle };

	const article = data.article;
	const formatDate = (value?: string | null) => {
		if (!value) return '';
		const date = new Date(value);
		return Number.isNaN(date.valueOf()) ? '' : format(date, 'd MMM yyyy');
	};
</script>

<svelte:head>
	<title>{article.title} | Kohl & Spice</title>
	<meta name="description" content={article.excerpt ?? article.title} />
</svelte:head>

<section class="bg-white px-4 py-6 font-dm-sans text-gray-900">
	<div class="custom-container mx-auto flex flex-col gap-6">
		<a href="/blog" class="text-14 font-semibold hover:text-brown-500">← Back to blog</a>
		<p class="text-12 font-semibold tracking-wide uppercase">{formatDate(article.publishedAt)}</p>
		<h1 class="text-32 leading-tight font-semibold md:text-40">{article.title}</h1>
		{#if article.image}
			<img
				src={article.image.url}
				alt={article.image.altText ?? article.title}
				class="aspect-video h-auto w-full rounded-2xl object-cover shadow-sm"
				loading="lazy"
			/>
		{/if}
		<div
			class="prose prose-lg prose-headings:font-semibold prose-p:text-gray-800 prose-a:text-brown-500 max-w-none"
		>
			{@html article.contentHtml ?? article.excerpt ?? ''}
		</div>
	</div>
</section>

<Subscribe />
