import { isShopifyConfigured, listArticles } from '$lib/server/shopify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	if (!isShopifyConfigured()) {
		return { posts: [], error: 'Shopify is not configured.' };
	}

	try {
		const posts = await listArticles({ first: 18 });
		return { posts, error: null };
	} catch (error) {
		console.error('Blog index load error', error);
		return { posts: [], error: 'Unable to load blogs.' };
	}
};
