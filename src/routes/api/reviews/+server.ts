import { json } from '@sveltejs/kit';
import { fetchJudgeMeReviews, isJudgeMeConfigured, submitJudgeMeReview } from '$lib/server/judgeme';

export const GET = async ({ url }) => {
	const productId = url.searchParams.get('productId');

	if (!productId || !isJudgeMeConfigured()) {
		return json({ reviews: [], summary: { average: 0, total: 0, distribution: [] } });
	}

	try {
		const result = await fetchJudgeMeReviews(productId, 50);
		return json(result);
	} catch (error) {
		console.error('API reviews load error', error);
		return json(
			{ reviews: [], summary: { average: 0, total: 0, distribution: [] } },
			{ status: 502 }
		);
	}
};

export const POST = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const { productId, rating, title, content, authorName, authorEmail, reviewImageUrl, reviewImageKey } =
		body;

	if (!productId || !rating || !content) {
		return json(
			{ ok: false, message: 'productId, rating, and content are required.' },
			{ status: 400 }
		);
	}

	const ratingValue = Number.parseFloat(rating);
	if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5) {
		return json({ ok: false, message: 'Rating must be between 1 and 5.' }, { status: 400 });
	}

	try {
		const result = await submitJudgeMeReview({
			productId,
			rating: ratingValue,
			title,
			content,
			authorName,
			authorEmail,
			reviewImageUrl,
			reviewImageKey
		});

		return json(result, { status: result.ok ? 200 : 502 });
	} catch (error) {
		console.error('API review submit error', error);
		return json({ ok: false, message: 'Unable to submit review.' }, { status: 502 });
	}
};
