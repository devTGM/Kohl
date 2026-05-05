import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const FIELDS = 'id,caption,media_url,permalink,media_type,thumbnail_url,timestamp';
const LIMIT = 4;

const buildEndpoint = () => {
	const accessToken = env.INSTAGRAM_ACCESS_TOKEN?.trim();
	if (!accessToken) {
		return { error: 'Instagram access token is missing.' } as const;
	}

	const userId = env.INSTAGRAM_USER_ID?.trim();
	const apiVersion = env.INSTAGRAM_API_VERSION?.trim() || 'v19.0';
	const baseUrl = env.INSTAGRAM_API_BASE?.trim();

	if (baseUrl) {
		return { url: baseUrl, accessToken } as const;
	}

	if (userId) {
		return {
			url: `https://graph.facebook.com/${apiVersion}/${userId}/media`,
			accessToken
		} as const;
	}

	return { url: 'https://graph.instagram.com/me/media', accessToken } as const;
};

export const GET = async () => {
	const endpoint = buildEndpoint();
	if ('error' in endpoint) {
		return json({ posts: [], error: endpoint.error }, { status: 500 });
	}

	const url = new URL(endpoint.url);
	url.searchParams.set('fields', FIELDS);
	url.searchParams.set('access_token', endpoint.accessToken);
	url.searchParams.set('limit', String(LIMIT));

	try {
		const response = await fetch(url.toString());
		if (!response.ok) {
			const body = await response.text();
			console.error('Instagram API error', response.status, body);
			return json({ posts: [] }, { status: 502 });
		}

		const payload = (await response.json()) as {
			data?: Array<{
				id?: string;
				caption?: string;
				media_url?: string;
				permalink?: string;
				media_type?: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO' | string;
				thumbnail_url?: string;
				timestamp?: string;
			}>;
		};

		const posts = (payload.data ?? [])
			.slice(0, LIMIT)
			.map((item) => {
				const src =
					item.media_type === 'VIDEO'
						? item.thumbnail_url ?? item.media_url
						: item.media_url;

				return {
					id: item.id ?? '',
					src: src ?? '',
					alt: item.caption?.trim() || 'Instagram post',
					permalink: item.permalink ?? ''
				};
			})
			.filter((item) => item.src);

		return json(
			{ posts },
			{
				headers: {
					'cache-control': 'public, max-age=300'
				}
			}
		);
	} catch (error) {
		console.error('Instagram API fetch error', error);
		return json({ posts: [] }, { status: 502 });
	}
};
