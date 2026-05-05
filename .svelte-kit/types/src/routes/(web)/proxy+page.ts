// @ts-nocheck
import type { PageLoad } from './$types';

export const ssr = false;

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	const [blogsResult, productResult, instagramResult] = await Promise.allSettled([
		fetch('/api/blogs').then(async (res) => (res.ok ? res.json() : { posts: [] })),
		fetch('/api/product').then(async (res) => (res.ok ? res.json() : { product: null })),
		fetch('/api/instagram').then(async (res) => (res.ok ? res.json() : { posts: [] }))
	]);

	const blogPosts =
		blogsResult.status === 'fulfilled' && Array.isArray((blogsResult.value as any).posts)
			? (blogsResult.value as any).posts
			: [];

	const featuredProduct =
		productResult.status === 'fulfilled' && (productResult.value as any)?.product
			? (productResult.value as any).product
			: null;

	const instagramPosts =
		instagramResult.status === 'fulfilled' && Array.isArray((instagramResult.value as any).posts)
			? (instagramResult.value as any).posts
			: [];

	return { blogPosts, featuredProduct, instagramPosts };
};
