// @ts-nocheck
import { error, isHttpError } from '@sveltejs/kit';
import { fetchJudgeMeReviews, isJudgeMeConfigured } from '$lib/server/judgeme';
import { getProductByHandle, isShopifyConfigured } from '$lib/server/shopify';
import type { PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	const slug = (params.slug ?? '').trim();

	if (!slug) {
		throw error(400, 'Product handle is required.');
	}

	if (!isShopifyConfigured()) {
		return {
			shopifyReady: false,
			product: null,
			error: 'Shopify environment variables are missing.'
		};
	}

	try {
		const product = await getProductByHandle(slug);
		if (!product) {
			throw error(404, `Product with handle "${params.slug}" not found.`);
		}

		let reviews: unknown[] = [];
		let reviewSummary: unknown = null;
		let reviewCount = 0;

		if (isJudgeMeConfigured()) {
			const result = await fetchJudgeMeReviews(product.id, 30);
			reviews = result.reviews;
			reviewSummary = result.summary;
			reviewCount = result.summary.total;
		}

		return {
			shopifyReady: true,
			product,
			reviews,
			reviewSummary,
			reviewCount,
			error: null
		};
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}

		console.error('[shop/[slug]] load error', err);
		throw error(500, 'Unable to load product from Shopify.');
	}
};
