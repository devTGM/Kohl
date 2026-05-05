
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(web)" | "/(landing)" | "/" | "/(web)/about" | "/account" | "/account/login" | "/api" | "/api/blogs" | "/api/collections" | "/api/collections/[handle]" | "/api/collections/[handle]/products" | "/api/instagram" | "/api/products" | "/api/product" | "/api/reviews" | "/api/reviews/upload-image" | "/api/shopify" | "/api/shopify/cart" | "/api/shopify/products" | "/api/shopify/products/[handle]" | "/api/subscribe" | "/(web)/blog" | "/(web)/blog/[handle]" | "/(web)/contact" | "/(landing)/landing" | "/(landing)/landing/home" | "/(web)/playground" | "/(web)/privacy" | "/(web)/refund" | "/(web)/science" | "/(web)/shipping" | "/(web)/shop" | "/(web)/shop/[slug]" | "/(web)/terms";
		RouteParams(): {
			"/api/collections/[handle]": { handle: string };
			"/api/collections/[handle]/products": { handle: string };
			"/api/shopify/products/[handle]": { handle: string };
			"/(web)/blog/[handle]": { handle: string };
			"/(web)/shop/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/(web)": { handle?: string; slug?: string };
			"/(landing)": Record<string, never>;
			"/": { handle?: string; slug?: string };
			"/(web)/about": Record<string, never>;
			"/account": Record<string, never>;
			"/account/login": Record<string, never>;
			"/api": { handle?: string };
			"/api/blogs": Record<string, never>;
			"/api/collections": { handle?: string };
			"/api/collections/[handle]": { handle: string };
			"/api/collections/[handle]/products": { handle: string };
			"/api/instagram": Record<string, never>;
			"/api/products": Record<string, never>;
			"/api/product": Record<string, never>;
			"/api/reviews": Record<string, never>;
			"/api/reviews/upload-image": Record<string, never>;
			"/api/shopify": { handle?: string };
			"/api/shopify/cart": Record<string, never>;
			"/api/shopify/products": { handle?: string };
			"/api/shopify/products/[handle]": { handle: string };
			"/api/subscribe": Record<string, never>;
			"/(web)/blog": { handle?: string };
			"/(web)/blog/[handle]": { handle: string };
			"/(web)/contact": Record<string, never>;
			"/(landing)/landing": Record<string, never>;
			"/(landing)/landing/home": Record<string, never>;
			"/(web)/playground": Record<string, never>;
			"/(web)/privacy": Record<string, never>;
			"/(web)/refund": Record<string, never>;
			"/(web)/science": Record<string, never>;
			"/(web)/shipping": Record<string, never>;
			"/(web)/shop": { slug?: string };
			"/(web)/shop/[slug]": { slug: string };
			"/(web)/terms": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/account/login" | "/api/blogs" | "/api/collections" | `/api/collections/${string}/products` & {} | "/api/instagram" | "/api/products" | "/api/product" | "/api/reviews" | "/api/reviews/upload-image" | "/api/shopify/cart" | "/api/shopify/products" | `/api/shopify/products/${string}` & {} | "/api/subscribe" | "/blog" | `/blog/${string}` & {} | "/contact" | "/landing" | "/landing/home" | "/playground" | "/privacy" | "/refund" | "/science" | "/shipping" | "/shop" | `/shop/${string}` & {} | "/terms";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/fevicon.png" | "/images/1.webp" | "/images/22hero-web-mobile.webp" | "/images/about-hero-bg.webp" | "/images/blogs/1.webp" | "/images/blogs/2.webp" | "/images/blogs/3.webp" | "/images/footer-logo.svg" | "/images/footer.png" | "/images/footer2.svg" | "/images/footer2.webp" | "/images/formulation.svg" | "/images/girl.webp" | "/images/hero-web-mobile.webp" | "/images/hero-web.webp" | "/images/hero.webp" | "/images/highlight/1.webp" | "/images/highlight/2.webp" | "/images/highlight/3.webp" | "/images/highlight/4.webp" | "/images/home.webp" | "/images/howtouse/1.webp" | "/images/howtouse/12.webp" | "/images/howtouse/2.webp" | "/images/howtouse/3.webp" | "/images/howtouse/31.webp" | "/images/insta/1.webp" | "/images/insta/2.webp" | "/images/insta/3.webp" | "/images/insta/4.webp" | "/images/product/1.webp" | "/images/product/2.webp" | "/images/product/3.webp" | "/images/product/4.webp" | "/images/product/5.webp" | "/images/product/6.webp" | "/images/product/7.webp" | "/images/product-image-2.webp" | "/images/product-image.webp" | "/images/promo.webp" | "/images/slider/1-T+28.webp" | "/images/slider/1-T0.webp" | "/images/slider/2-T+28.webp" | "/images/slider/2-T0.webp" | "/images/slider/3-T+28.webp" | "/images/slider/3-T0.webp" | "/images/slider/4-T+28.webp" | "/images/slider/4-T0.webp" | "/images/spotify.svg" | "/images/story.webp" | "/images/testimonial/1.webp" | "/images/testimonial/2.webp" | "/images/text.webp" | "/images/texture.webp" | "/robots.txt" | string & {};
	}
}