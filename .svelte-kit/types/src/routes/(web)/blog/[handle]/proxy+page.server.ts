// @ts-nocheck
import { error } from '@sveltejs/kit';
import { isShopifyConfigured, listArticles } from '$lib/server/shopify';
import type { PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	if (!isShopifyConfigured()) {
		throw error(500, 'Shopify not configured');
	}

	const handle = params.handle;

	try {
		const articles = await listArticles({ first: 50 });
		const article = articles.find((a) => a.handle === handle);

		if (!article) {
			throw error(404, 'Article not found');
		}

		return { article };
	} catch (err) {
		console.error('Blog article load error', err);
		throw error(500, 'Unable to load article');
	}
};
