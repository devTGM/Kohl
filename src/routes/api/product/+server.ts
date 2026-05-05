import { SHOPIFY_DEFAULT_PRODUCT_HANDLE } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { getProductByHandle, isShopifyConfigured, listProducts } from '$lib/server/shopify';

export const GET = async () => {
	if (!isShopifyConfigured()) {
		return json({ product: null });
	}

	const handle = SHOPIFY_DEFAULT_PRODUCT_HANDLE?.trim();

	try {
		if (handle) {
			const product = await getProductByHandle(handle);
			if (product) return json({ product });
		}

		const [fallbackProduct] = await listProducts(1);
		return json({ product: fallbackProduct ?? null });
	} catch (error) {
		console.error('API product load error', error);
		return json({ product: null }, { status: 502 });
	}
};
