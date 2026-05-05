import { json } from '@sveltejs/kit';
import { isShopifyConfigured, listArticles } from '$lib/server/shopify';

export const GET = async () => {
	if (!isShopifyConfigured()) {
		return json({ posts: [] });
	}

	try {
		const posts = await listArticles({ first: 3 });
		return json({ posts });
	} catch (error) {
		console.error('API blog load error', error);
		return json({ posts: [] }, { status: 502 });
	}
};
