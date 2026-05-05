import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import {
	addLinesToCart,
	createCart,
	getCart,
	isShopifyConfigured,
	removeCartLines,
	updateCartBuyerIdentity,
	updateCartLines
} from '$lib/server/shopify';
import type { CartLineInput, ShopifyBuyerIdentity } from '$lib/types/shopify';

const CART_COOKIE = 'shopifyCartId';
const CART_TTL_SECONDS = 60 * 60 * 24 * 30;

const toMessage = (error: unknown) =>
	typeof error === 'string'
		? error
		: error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
			? error.message
			: 'Unexpected error';

const setCartCookie = (cookies: import('@sveltejs/kit').Cookies, cartId: string) =>
	cookies.set(CART_COOKIE, cartId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: CART_TTL_SECONDS
	});

const clearCartCookie = (cookies: import('@sveltejs/kit').Cookies) =>
	cookies.delete(CART_COOKIE, { path: '/' });

const sanitizeLines = (lines: CartLineInput[]) =>
	lines
		.filter((line) => line?.merchandiseId)
		.map((line) => ({
			merchandiseId: String(line.merchandiseId),
			quantity: Math.max(1, Number.parseInt(String(line.quantity), 10) || 1)
		}));

const missingConfig = () => json({ message: 'Shopify is not configured.' }, { status: 503 });

export const GET = async ({ cookies }) => {
	if (!isShopifyConfigured()) return missingConfig();

	const cartId = cookies.get(CART_COOKIE);
	if (!cartId) return json({ cart: null });

	try {
		const cart = await getCart(cartId);
		if (!cart) {
			clearCartCookie(cookies);
			return json({ cart: null });
		}

		setCartCookie(cookies, cart.id);
		return json({ cart });
	} catch (error) {
		console.error('Shopify cart GET error', error);
		return json({ message: 'Unable to load cart.' }, { status: 500 });
	}
};

export const POST = async ({ request, cookies }) => {
	if (!isShopifyConfigured()) return missingConfig();

	const body = (await request.json().catch(() => ({}))) as {
		action?: 'add' | 'update' | 'remove' | 'buyerIdentity';
		lines?: CartLineInput[];
		lineId?: string;
		lineIds?: string[];
		quantity?: number;
		buyerIdentity?: ShopifyBuyerIdentity;
	};

	const action = body.action || 'add';
	const cartId = cookies.get(CART_COOKIE) || '';

	try {
		if (action === 'add') {
			const lines = sanitizeLines(body.lines ?? []);
			if (!lines.length) {
				return json({ message: 'Provide at least one merchandiseId + quantity.' }, { status: 400 });
			}

			try {
				const cart = cartId ? await addLinesToCart(cartId, lines) : await createCart({ lines });
				setCartCookie(cookies, cart.id);
				return json({ cart });
			} catch (error) {
				// fall back to a fresh cart if the stored cart is invalid/expired
				const cart = await createCart({ lines });
				setCartCookie(cookies, cart.id);
				return json({ cart });
			}
		}

		if (action === 'update') {
			if (!cartId) return json({ message: 'No cart to update yet.' }, { status: 400 });

			const quantity = Math.max(0, Number.parseInt(String(body.quantity), 10));
			const lineId = body.lineId;

			if (!lineId || Number.isNaN(quantity)) {
				return json({ message: 'lineId and quantity are required.' }, { status: 400 });
			}

			if (quantity === 0) {
				const cart = await removeCartLines(cartId, [lineId]);
				setCartCookie(cookies, cart.id);
				return json({ cart });
			}

			const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
			setCartCookie(cookies, cart.id);
			return json({ cart });
		}

		if (action === 'remove') {
			if (!cartId) return json({ message: 'No cart to update yet.' }, { status: 400 });

			const lineIds = Array.isArray(body.lineIds)
				? body.lineIds.filter((id) => typeof id === 'string')
				: [];

			if (!lineIds.length) return json({ message: 'lineIds are required.' }, { status: 400 });

			const cart = await removeCartLines(cartId, lineIds);
			setCartCookie(cookies, cart.id);
			return json({ cart });
		}

		if (action === 'buyerIdentity') {
			if (!cartId) return json({ message: 'No cart to update yet.' }, { status: 400 });
			if (!body.buyerIdentity)
				return json({ message: 'buyerIdentity is required.' }, { status: 400 });

			const cart = await updateCartBuyerIdentity(cartId, body.buyerIdentity);
			setCartCookie(cookies, cart.id);
			return json({ cart });
		}

		return json({ message: 'Unsupported action.' }, { status: 400 });
	} catch (error) {
		console.error('Shopify cart POST error', error);
		return json({ message: toMessage(error) }, { status: 500 });
	}
};
