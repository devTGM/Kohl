import { json } from '@sveltejs/kit';
import { getProductByHandle, isShopifyConfigured } from '$lib/server/shopify';

export const GET = async ({ params }) => {
	if (!isShopifyConfigured()) {
		return json({ message: 'Shopify is not configured.' }, { status: 503 });
	}

	const handle = params.handle;
	if (!handle) {
		return json({ message: 'Product handle is required.' }, { status: 400 });
	}

	try {
		const product = await getProductByHandle(handle);
		if (!product) {
			return json({ message: 'Product not found.' }, { status: 404 });
		}

		return json({ product });
	} catch (error) {
		console.error('Shopify product GET error', error);
		return json({ message: 'Unable to fetch product.' }, { status: 500 });
	}
};
