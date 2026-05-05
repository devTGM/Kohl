import { json } from '@sveltejs/kit';
import { isShopifyConfigured, listProductsByCollectionHandle } from '$lib/server/shopify';
import { toLegacyProduct } from '$lib/server/legacy-shopify-format';

const parsePage = (value: string | null) => Math.max(1, Number.parseInt(value ?? '1', 10) || 1);
const parseLimit = (value: string | null) =>
	Math.min(100, Math.max(1, Number.parseInt(value ?? '50', 10) || 50));

export const GET = async ({ params, url }) => {
	if (!isShopifyConfigured()) {
		return json({ message: 'Shopify is not configured.' }, { status: 503 });
	}

	const handle = params.handle?.trim();
	if (!handle) {
		return json({ message: 'Collection handle is required.' }, { status: 400 });
	}

	const page = parsePage(url.searchParams.get('page'));
	const limit = parseLimit(url.searchParams.get('limit'));
	const first = Math.min(250, page * limit);

	try {
		const products = await listProductsByCollectionHandle(handle, first);
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
			count: formattedProducts.length,
			handle
		});
	} catch (error) {
		console.error('Collection products API GET error', error);
		return json({ message: 'Unable to fetch collection products.' }, { status: 500 });
	}
};
