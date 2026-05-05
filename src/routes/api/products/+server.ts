import { json } from '@sveltejs/kit';
import { isShopifyConfigured, listProducts } from '$lib/server/shopify';
import { toLegacyProduct } from '$lib/server/legacy-shopify-format';

const parsePage = (value: string | null) => Math.max(1, Number.parseInt(value ?? '1', 10) || 1);
const parseLimit = (value: string | null) =>
	Math.min(100, Math.max(1, Number.parseInt(value ?? '50', 10) || 50));

export const GET = async ({ url }) => {
	if (!isShopifyConfigured()) {
		return json({ message: 'Shopify is not configured.' }, { status: 503 });
	}

	const page = parsePage(url.searchParams.get('page'));
	const limit = parseLimit(url.searchParams.get('limit'));
	const first = Math.min(250, page * limit);

	try {
		const products = await listProducts(first);
		const start = (page - 1) * limit;
		const paginatedProducts = products.slice(start, start + limit);
		const formattedProducts = paginatedProducts.map(toLegacyProduct);

		return json({
			data: {
				total: products.length,
				products: formattedProducts
			},
			page,
			limit,
			count: formattedProducts.length
		});
	} catch (error) {
		console.error('Products API GET error', error);
		return json({ message: 'Unable to fetch products.' }, { status: 500 });
	}
};
