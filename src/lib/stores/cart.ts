import type { ShopifyCart } from '$lib/types/shopify';
import { get, writable } from 'svelte/store';

type CartStatus = 'idle' | 'loading' | 'ready' | 'error';
export type CheckoutProductInput = { variantId: string; quantity: number };

export interface CartState {
	cart: ShopifyCart | null;
	status: CartStatus;
	message: string | null;
}

const initialState: CartState = {
	cart: null,
	status: 'idle',
	message: null
};

export const cartState = writable<CartState>(initialState);
export const cartOpen = writable(false);

const setState = (next: Partial<CartState>) =>
	cartState.update((current) => ({ ...current, ...next }));

const handleResponse = async (response: Response) => {
	const json = await response.json().catch(() => ({}));
	if (!response.ok) {
		const message = json?.message || `Request failed (${response.status})`;
		throw new Error(message);
	}
	return json;
};

export const loadCart = async () => {
	setState({ status: 'loading', message: null });
	try {
		const res = await fetch('/api/shopify/cart');
		const { cart } = await handleResponse(res);
		setState({ cart: cart ?? null, status: 'ready' });
	} catch (error) {
		setState({
			status: 'error',
			message: error instanceof Error ? error.message : 'Unable to load cart.'
		});
	}
};

export const openCartDrawer = () => cartOpen.set(true);
export const closeCartDrawer = () => cartOpen.set(false);

export const addLineToCart = async (
	merchandiseId: string,
	quantity = 1,
	options?: { openDrawer?: boolean }
) => {
	const { openDrawer: shouldOpenDrawer = true } = options ?? {};
	setState({ status: 'loading', message: null });
	try {
		const res = await fetch('/api/shopify/cart', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'add',
				lines: [{ merchandiseId, quantity }]
			})
		});

		const { cart } = await handleResponse(res);
		setState({ cart, status: 'ready' });
		if (shouldOpenDrawer) openCartDrawer();
		return { ok: true };
	} catch (error) {
		setState({
			status: 'error',
			message: error instanceof Error ? error.message : 'Unable to add to cart.'
		});
		return { ok: false, message: get(cartState).message };
	}
};

export const updateLineQuantity = async (lineId: string, quantity: number) => {
	const nextQty = Math.max(0, Math.floor(quantity));
	setState({ status: 'loading', message: null });
	try {
		const res = await fetch('/api/shopify/cart', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				nextQty === 0
					? { action: 'remove', lineIds: [lineId] }
					: { action: 'update', lineId, quantity: nextQty }
			)
		});

		const { cart } = await handleResponse(res);
		setState({ cart, status: 'ready' });
	} catch (error) {
		setState({
			status: 'error',
			message: error instanceof Error ? error.message : 'Unable to update cart.'
		});
	}
};

export const removeLine = async (lineId: string) => updateLineQuantity(lineId, 0);

export const getCheckoutUrl = () => get(cartState).cart?.checkoutUrl ?? '';

export const toNumericVariantId = (shopifyVariantId: string) => {
	const parsed = shopifyVariantId.split('/').pop()?.trim() ?? '';
	return /^\d+$/.test(parsed) ? parsed : '';
};

export const buildCartCheckoutProducts = (cart: ShopifyCart | null): CheckoutProductInput[] =>
	(cart?.lines ?? [])
		.map((line) => ({
			variantId: toNumericVariantId(line.merchandise.id),
			quantity: Math.max(1, Math.floor(line.quantity || 1))
		}))
		.filter((product) => Boolean(product.variantId));
