import {
	JUDGEME_PRIVATE_TOKEN,
	JUDGEME_SHOP_DOMAIN,
	SHOPIFY_API_VERSION
} from '$env/static/private';
import type { ShopifyReview, ShopifyReviewSummary } from '$lib/types/shopify';

const apiVersion = SHOPIFY_API_VERSION || '2025-01';
const apiBase = 'https://judge.me/api/v1';

export const isJudgeMeConfigured = () => Boolean(JUDGEME_PRIVATE_TOKEN && JUDGEME_SHOP_DOMAIN);

const buildSummary = (list: ShopifyReview[]): ShopifyReviewSummary => {
	const total = list.length;
	const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
	const average = total ? Number((sum / total).toFixed(2)) : 0;
	const distribution = [1, 2, 3, 4, 5].map((stars) => ({
		stars,
		count: list.filter((r) => Math.round(Number(r.rating) || 0) === stars).length
	}));

	return { average, total, distribution };
};

const toNumericProductId = (gid?: string | null) => {
	if (!gid) return null;
	const match = gid.match(/Product\/(\d+)/i);
	return match ? match[1] : null;
};

const normalizeReview = (node: any): ShopifyReview | null => {
	if (!node) return null;
	const rating = Number(node.rating) || 0;
	const title = node.title ?? null;
	const content = node.body ?? node.body_html ?? node.content ?? '';
	const author = node.reviewer_name ?? node.reviewer?.name ?? null;
	const email = node.reviewer_email ?? node.reviewer?.email ?? null;
	const createdAt = node.created_at ?? node.published_at ?? new Date().toISOString();

	const ensureAbsoluteUrl = (value?: string | null) => {
		if (!value) return null;
		if (value.startsWith('//')) return `https:${value}`;
		return value;
	};

	const collectPictureUrls = (pic: any) => {
		if (!pic) return [];
		const urls = [
			pic.url,
			pic.original_url,
			pic.url_original,
			pic.urls?.original,
			pic.urls?.large,
			pic.urls?.medium,
			pic.urls?.small,
			pic.urls?.thumb,
			pic.thumb_url,
			pic.thumbnail_url
		];
		return urls.filter(Boolean);
	};

	const imageCandidates: string[] = [];
	if (Array.isArray(node.pictures)) {
		for (const pic of node.pictures) {
			imageCandidates.push(...collectPictureUrls(pic));
		}
	}
	if (Array.isArray(node.picture_urls)) {
		imageCandidates.push(...node.picture_urls);
	}
	if (typeof node.picture_url === 'string') {
		imageCandidates.push(node.picture_url);
	}
	if (typeof node.picture === 'string') {
		imageCandidates.push(node.picture);
	}

	const resolvedImageUrl = imageCandidates.map(ensureAbsoluteUrl).find(Boolean) ?? null;
	const imageAlt =
		node.pictures?.[0]?.caption ??
		node.pictures?.[0]?.alt ??
		node.pictures?.[0]?.file_name ??
		null;
	const image = resolvedImageUrl
		? {
				url: resolvedImageUrl,
				altText: imageAlt
			}
		: null;

	return {
		id: String(node.id ?? `jdgm-${Math.random().toString(36).slice(2)}`),
		rating,
		title,
		content,
		author,
		email,
		createdAt,
		status: node.status ?? null,
		image: image ?? undefined
	};
};

export const fetchJudgeMeReviews = async (
	shopifyProductGid: string | null,
	first = 30
): Promise<{ reviews: ShopifyReview[]; summary: ShopifyReviewSummary }> => {
	const productId = toNumericProductId(shopifyProductGid ?? '');

	if (!productId) {
		console.warn('[judgeme] unable to derive numeric product id from', shopifyProductGid);
		return { reviews: [], summary: buildSummary([]) };
	}

	if (!isJudgeMeConfigured()) {
		console.warn('[judgeme] API not configured; set JUDGEME_PRIVATE_TOKEN and JUDGEME_SHOP_DOMAIN');
		return { reviews: [], summary: buildSummary([]) };
	}

	const url = new URL(`${apiBase}/reviews`);
	url.searchParams.set('api_token', JUDGEME_PRIVATE_TOKEN);
	url.searchParams.set('shop_domain', JUDGEME_SHOP_DOMAIN);
	// Judge.me expects Shopify numeric id via shopify_product_id to avoid overflow issues
	url.searchParams.set('shopify_product_id', productId);
	url.searchParams.set('per_page', String(first));
	url.searchParams.set('published', '1');

	try {
		const response = await fetch(url.toString(), { method: 'GET' });
		const json = await response.json().catch(() => ({}));

		if (!response.ok) {
			const message = (json as any)?.error || (json as any)?.message || `HTTP ${response.status}`;
			throw new Error(message);
		}

		const items = (json as any)?.reviews ?? [];
		const reviews = items
			.map((item: any) => normalizeReview(item))
			.filter(Boolean) as ShopifyReview[];

		console.log('[judgeme] fetched reviews', {
			productId,
			requested: first,
			received: reviews.length
		});

		return { reviews, summary: buildSummary(reviews) };
	} catch (error) {
		console.error('[judgeme] fetch error', error);
		return { reviews: [], summary: buildSummary([]) };
	}
};

export const submitJudgeMeReview = async (_input: {
	productId: string;
	rating: number;
	title?: string | null;
	content: string;
	authorName?: string | null;
	authorEmail?: string | null;
	reviewImageUrl?: string | null;
	reviewImageKey?: string | null;
}) => {
	if (!isJudgeMeConfigured()) {
		return { ok: false as const, message: 'Judge.me API not configured.' };
	}

	const productId = toNumericProductId(_input.productId);
	if (!productId) {
		return { ok: false as const, message: 'Unable to derive product id for Judge.me.' };
	}

	const payload: Record<string, unknown> = {
		api_token: JUDGEME_PRIVATE_TOKEN!,
		shop_domain: JUDGEME_SHOP_DOMAIN!,
		shopify_product_id: Number(productId),
		rating: _input.rating,
		body: _input.content,
		platform: 'shopify'
	};
	if (_input.title) payload.title = _input.title;
	if (_input.authorName) payload.reviewer_name = _input.authorName;
	if (_input.authorEmail) payload.reviewer_email = _input.authorEmail;
	if (_input.authorEmail) payload.email = _input.authorEmail;
	if (_input.reviewImageKey) {
		payload.picture_keys = [_input.reviewImageKey];
	} else if (_input.reviewImageUrl) {
		payload.picture_urls = [_input.reviewImageUrl];
	}

	try {
		const response = await fetch(`${apiBase}/reviews`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const json = await response.json().catch(() => ({}));

		if (!response.ok) {
			const message = (json as any)?.error || (json as any)?.message || `HTTP ${response.status}`;
			return { ok: false as const, message };
		}

		const review = normalizeReview((json as any)?.review ?? json);

		return { ok: true as const, review: review ?? null, message: (json as any)?.message };
	} catch (error) {
		console.error('[judgeme] submit error', error);
		return { ok: false as const, message: 'Unable to submit review to Judge.me' };
	}
};
