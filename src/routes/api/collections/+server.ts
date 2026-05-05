import { json } from '@sveltejs/kit';
import { isShopifyConfigured, listCollections } from '$lib/server/shopify';
import { toLegacyCollection } from '$lib/server/legacy-shopify-format';

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
		const collections = await listCollections(first);
		const start = (page - 1) * limit;
		const paginatedCollections = collections.slice(start, start + limit);
		const formattedCollections = paginatedCollections.map(toLegacyCollection);

		return json({
			data: {
				total: collections.length,
				collections: formattedCollections
			},
			page,
			limit,
			count: formattedCollections.length
		});
	} catch (error) {
		console.error('Collections API GET error', error);
		return json({ message: 'Unable to fetch collections.' }, { status: 500 });
	}
};
