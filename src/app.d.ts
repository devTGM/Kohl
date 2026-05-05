// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
		shiprocketCheckoutEvents?: {
			buyDirect: (payload: {
				type: 'cart' | 'product';
				products: Array<{ variantId: string; quantity: number }>;
			}) => void;
		};
	}
}

declare module '$env/static/private' {
	export const SHOPIFY_DOMAIN: string;
	export const SHOPIFY_STOREFRONT_TOKEN: string;
	export const SHOPIFY_API_VERSION: string;
	export const SHOPIFY_DEFAULT_PRODUCT_HANDLE: string;
}

declare module '$env/dynamic/private' {
	export const env: {
		SHOPIFY_DOMAIN?: string;
		SHOPIFY_STOREFRONT_TOKEN?: string;
		SHOPIFY_API_VERSION?: string;
		SHOPIFY_DEFAULT_PRODUCT_HANDLE?: string;
		[key: string]: string | undefined;
	};
}

export {};
