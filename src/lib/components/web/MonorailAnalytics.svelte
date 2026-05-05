<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';

	let {
		shopId = '',
		storefrontId = '',
		endpoint
	} = $props<{
		shopId?: string;
		storefrontId?: string;
		endpoint?: string;
	}>();

	const STORAGE_KEYS = {
		user: 'shopify_monorail_user_token',
		session: 'shopify_monorail_session_token'
	} as const;

	let userToken = $state<string | null>(null);
	let sessionToken = $state<string | null>(null);
	let sentInitialView = $state(false);

	const createUuid = () => {
		if (crypto?.randomUUID) return crypto.randomUUID();

		const bytes = crypto?.getRandomValues?.(new Uint8Array(16));
		if (!bytes) return `${Date.now()}-${Math.random().toString(16).slice(2)}`;

		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		return [...bytes]
			.map((byte, index) => {
				const hex = byte.toString(16).padStart(2, '0');
				return [4, 6, 8, 10].includes(index) ? `-${hex}` : hex;
			})
			.join('');
	};

	const ensureTokens = () => {
		if (!browser) return { user: null, session: null };

		if (!userToken) {
			const stored = localStorage.getItem(STORAGE_KEYS.user);
			userToken = stored || createUuid();
			if (!stored) localStorage.setItem(STORAGE_KEYS.user, userToken);
		}

		if (!sessionToken) {
			const stored = localStorage.getItem(STORAGE_KEYS.session);
			sessionToken = stored || createUuid();
			if (!stored) localStorage.setItem(STORAGE_KEYS.session, sessionToken);
		}

		return { user: userToken, session: sessionToken };
	};

	const sendPageView = async (href: string) => {
		if (!browser) return;

		if (!shopId || !storefrontId) {
			console.warn('[Monorail] Missing shopId or storefrontId; skipping page_view dispatch.', {
				shopId,
				storefrontId
			});
			return;
		}

		const tokens = ensureTokens();
		if (!tokens.session) return;

		const timestamp = Date.now();
		const messageId = crypto?.randomUUID?.() ?? createUuid();

		const payload = {
			schema_id: 'shopify_hydrogen_analytics_page_view/1.0',
			payload: {
				shop_id: shopId,
				storefront_id: storefrontId,
				event_name: 'page_view',
				url: href,
				unique_token: tokens.session
			},
			metadata: {
				event_created_at_ms: timestamp,
				event_sent_at_ms: timestamp,
				event_client: 'custom_sveltekit',
				event_id: messageId,
				page_url: href,
				user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
			}
		};

		const headers = {
			'content-type': 'application/json',
			'X-Monorail-Edge-Event-Created-At-Ms': String(timestamp),
			'X-Monorail-Edge-Event-Sent-At-Ms': String(timestamp),
			'X-Monorail-Edge-Client-Message-Id': messageId
		};

		console.log('[Monorail] Payload payload', payload);

		const endpointsToTry = [
			endpoint,
			'https://monorail-edge.shopifysvc.com/v1/produce',
			'https://monorail-edge.shopifycloud.com/v1/produce',
			'https://monorail-edge.shopify.com/v1/produce'
		]
			.filter(Boolean)
			.reduce<string[]>((acc, url) => {
				if (!acc.includes(url!)) acc.push(url!);
				return acc;
			}, []);

		let lastError: unknown = null;

		for (const url of endpointsToTry) {
			try {
				const response = await fetch(url, {
					method: 'POST',
					mode: 'no-cors',
					headers,
					credentials: 'omit',
					body: JSON.stringify(payload)
				});

				console.log('[Monorail] Response status', response?.status ?? 'unknown', {
					type: response?.type,
					ok: response?.ok,
					endpoint: url
				});

				// In no-cors mode the response is opaque; if fetch didn't throw, treat as success.
				return;
			} catch (error) {
				lastError = error;
				console.warn('[Monorail] Endpoint failed, trying fallback', { endpoint: url, error });
			}
		}

		if (lastError) {
			console.error('[Monorail] Failed to send page_view', lastError);
		}
	};

	$effect(() => {
		if (!browser) return;

		ensureTokens();

		afterNavigate(({ to }) => {
			const href = to?.url?.href ?? window.location.href;

			if (!sentInitialView) {
				sentInitialView = true;
				return sendPageView(href);
			}

			sendPageView(href);
		});
	});
</script>
