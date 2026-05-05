export interface ShopifyImage {
	url: string;
	altText: string | null;
}

export interface ShopifyPrice {
	amount: string;
	currencyCode: string;
}

export interface ShopifyVariant {
	id: string;
	title: string;
	price: ShopifyPrice;
	availableForSale: boolean;
	compareAtPrice?: ShopifyPrice | null;
	image?: ShopifyImage | null;
	sku?: string | null;
	quantityAvailable?: number | null;
	weight?: number | null;
	weightUnit?: string | null;
	selectedOptions?: { name: string; value: string }[];
}

export interface ShopifyProduct {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	images: ShopifyImage[];
	variants: ShopifyVariant[];
	minPrice: ShopifyPrice;
	maxPrice: ShopifyPrice;
}

export interface ShopifyReview {
	id: string;
	rating: number;
	title: string | null;
	content: string;
	author: string | null;
	email?: string | null;
	createdAt: string;
	status?: string | null;
	image?: ShopifyImage | null;
	productId?: string | null;
}

export interface ShopifyReviewSummary {
	average: number;
	total: number;
	distribution: { stars: number; count: number }[];
}

// Judge.me env notes
// JUDGEME_PRIVATE_TOKEN=
// JUDGEME_SHOP_DOMAIN=

export interface ShopifyArticle {
	id: string;
	handle: string;
	title: string;
	excerpt: string | null;
	contentHtml?: string | null;
	publishedAt: string;
	image: ShopifyImage | null;
	blogHandle: string | null;
	blogTitle: string | null;
	url: string | null;
}

export interface ShopifyCollection {
	id: string;
	handle: string;
	title: string;
	description: string;
	updatedAt: string;
	image: ShopifyImage | null;
}

export interface ShopifyCartLine {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		productHandle: string;
		productTitle: string;
		image: ShopifyImage | null;
		price: ShopifyPrice;
	};
}

export interface ShopifyCartCost {
	subtotal: ShopifyPrice;
	total: ShopifyPrice;
}

export interface ShopifyCart {
	id: string;
	checkoutUrl: string;
	cost: ShopifyCartCost;
	lines: ShopifyCartLine[];
}

export interface CartLineInput {
	merchandiseId: string;
	quantity: number;
}

export interface ShopifyBuyerIdentity {
	email?: string;
	phone?: string;
	countryCode?: string;
	customerAccessToken?: string;
}
