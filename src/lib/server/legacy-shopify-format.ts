import type { ShopifyCollection, ShopifyProduct } from '$lib/types/shopify';

export const toNumericId = (gid: string) => {
	const parts = gid.split('/');
	const last = parts[parts.length - 1] ?? gid;
	const numeric = Number.parseInt(last, 10);
	return Number.isFinite(numeric) ? numeric : last;
};

const normalizeWeightUnit = (unit?: string | null) => {
	if (!unit) return '';
	const normalized = unit.toUpperCase();
	if (normalized === 'POUNDS' || normalized === 'LB') return 'lb';
	if (normalized === 'OUNCES' || normalized === 'OZ') return 'oz';
	if (normalized === 'KILOGRAMS' || normalized === 'KG') return 'kg';
	if (normalized === 'GRAMS' || normalized === 'G') return 'g';
	return unit.toLowerCase();
};

const toGrams = (weight?: number | null, unit?: string | null) => {
	if (typeof weight !== 'number' || !Number.isFinite(weight)) return 0;
	const normalized = normalizeWeightUnit(unit);
	if (normalized === 'kg') return Math.round(weight * 1000);
	if (normalized === 'lb') return Math.round(weight * 453.59237);
	if (normalized === 'oz') return Math.round(weight * 28.349523125);
	return Math.round(weight);
};

const toOptionValues = (selectedOptions?: { name: string; value: string }[], title?: string) => {
	if (selectedOptions?.length) {
		return Object.fromEntries(
			selectedOptions
				.filter((option) => option?.name && option?.value)
				.map((option) => [option.name, option.value])
		);
	}

	return title && title !== 'Default Title' ? { Title: title } : {};
};

export const toLegacyProduct = (product: ShopifyProduct) => {
	const firstVariant = product.variants[0] ?? null;
	const productId = toNumericId(product.id);

	return {
		id: productId,
		title: product.title,
		body_html: product.descriptionHtml,
		vendor: null,
		product_type: null,
		created_at: null,
		handle: product.handle,
		updated_at: null,
		tags: '',
		status: 'active',
		variants: product.variants.map((variant) => ({
			id: toNumericId(variant.id),
			title: variant.title,
			price: variant.price.amount,
			compare_at_price: variant.compareAtPrice?.amount ?? null,
			sku: variant.sku ?? null,
			quantity: variant.quantityAvailable ?? 0,
			option_values: toOptionValues(variant.selectedOptions, variant.title),
			grams: toGrams(variant.weight, variant.weightUnit),
			image: variant.image
				? {
						id: null,
						product_id: productId,
						src: variant.image.url,
						alt: variant.image.altText
					}
				: null,
			weight: variant.weight ?? 0,
			weight_unit: normalizeWeightUnit(variant.weightUnit)
		})),
		image: product.images[0]
			? {
					id: null,
					product_id: productId,
					src: product.images[0].url,
					alt: product.images[0].altText
				}
			: null,
		images: product.images.map((image) => ({
			id: null,
			product_id: productId,
			src: image.url,
			alt: image.altText
		})),
		options: [
			{
				id: null,
				product_id: productId,
				name: 'Title',
				position: 1,
				values: product.variants.map((variant) => variant.title)
			}
		],
		published_at: null,
		template_suffix: null,
		published_scope: 'web',
		admin_graphql_api_id: product.id,
		price: firstVariant?.price.amount ?? product.minPrice.amount,
		compare_at_price: firstVariant?.compareAtPrice?.amount ?? null,
		currency: firstVariant?.price.currencyCode ?? product.minPrice.currencyCode
	};
};

export const toLegacyCollection = (collection: ShopifyCollection) => ({
	id: toNumericId(collection.id),
	handle: collection.handle,
	title: collection.title,
	body_html: collection.description,
	published_at: null,
	updated_at: collection.updatedAt || null,
	image: collection.image
		? {
				id: null,
				src: collection.image.url,
				alt: collection.image.altText
			}
		: null,
	admin_graphql_api_id: collection.id
});
