// @ts-nocheck
import { SHOPIFY_DEFAULT_PRODUCT_HANDLE } from '$env/static/private';
import { getProductByHandle, isShopifyConfigured, listProducts } from '$lib/server/shopify';
import { fetchJudgeMeReviews, isJudgeMeConfigured } from '$lib/server/judgeme';
import type { PageServerLoad } from './$types';

const FALLBACK_PRODUCT_COUNT = 12;

export const load = async () => {
	if (!isShopifyConfigured()) {
		return {
			shopifyReady: false,
			product: null,
			products: [],
			error: 'Shopify environment variables are missing.'
		};
	}

	const handle = SHOPIFY_DEFAULT_PRODUCT_HANDLE?.trim();

	try {
		console.log('[shop page] Judge.me configured:', isJudgeMeConfigured());

		const products = await listProducts(FALLBACK_PRODUCT_COUNT);
		let selectedProduct = null;

		if (handle) {
			selectedProduct = products.find((product) => product.handle === handle) ?? null;

			if (!selectedProduct) {
				selectedProduct = await getProductByHandle(handle);
			}
		}

		if (!selectedProduct) {
			selectedProduct = products[0] ?? null;
		}

		let reviews: unknown[] = [];
		let reviewSummary: unknown = null;
		let reviewCount = 0;

		if (selectedProduct && isJudgeMeConfigured()) {
			const result = await fetchJudgeMeReviews(selectedProduct.id, 30);
			console.log('[shop load] reviews fetched for product', {
				handle: selectedProduct.handle,
				productId: selectedProduct.id,
				reviews: result.reviews?.length ?? 0,
				summary: result.summary
			});
			reviews = result.reviews;
			reviewSummary = result.summary;
			reviewCount = result.summary.total;
		}

		console.log('Shop page loaded product:', selectedProduct?.title ?? 'None');
		return {
			shopifyReady: true,
			product: selectedProduct,
			products,
			reviews,
			reviewSummary,
			reviewCount,
			error: selectedProduct ? null : 'No products found in Shopify.'
		};
	} catch (error) {
		console.error('Shop page load error', error);
		return {
			shopifyReady: true,
			product: null,
			products: [],
			reviews: [],
			reviewSummary: null,
			reviewCount: 0,
			error: 'Unable to load product from Shopify.'
		};
	}
};
;null as any as PageServerLoad;