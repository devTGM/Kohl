import { json } from '@sveltejs/kit';
import { isShopifyConfigured, listProducts } from '$lib/server/shopify';

export const GET = async ({ url }) => {
	if (!isShopifyConfigured()) {
		return json({ message: 'Shopify is not configured.' }, { status: 503 });
	}

	const firstParam = url.searchParams.get('first');
	const first = Math.min(50, Math.max(1, Number.parseInt(firstParam ?? '12', 10) || 12));

	try {
		const products = await listProducts(first);
		return json({ products });
	} catch (error) {
		console.error('Shopify products GET error', error);
		return json({ message: 'Unable to fetch products.' }, { status: 500 });
	}
};
