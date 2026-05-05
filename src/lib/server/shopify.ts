import { SHOPIFY_API_VERSION, SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from '$env/static/private';
import type {
	CartLineInput,
	ShopifyBuyerIdentity,
	ShopifyCart,
	ShopifyArticle,
	ShopifyCollection,
	ShopifyProduct,
	ShopifyVariant
} from '$lib/types/shopify';

const apiVersion = SHOPIFY_API_VERSION || '2025-01';

const endpoint =
	SHOPIFY_DOMAIN && SHOPIFY_DOMAIN.startsWith('http')
		? `${SHOPIFY_DOMAIN}/api/${apiVersion}/graphql.json`
		: SHOPIFY_DOMAIN
			? `https://${SHOPIFY_DOMAIN}/api/${apiVersion}/graphql.json`
			: '';
const storeBaseUrl = SHOPIFY_DOMAIN
	? (SHOPIFY_DOMAIN.startsWith('http') ? SHOPIFY_DOMAIN : `https://${SHOPIFY_DOMAIN}`).replace(
			/\/$/,
			''
		)
	: '';

type GraphQLResponse<T> = {
	data?: T;
	errors?: { message?: string }[];
};

const productFragment = `
fragment ProductBasics on Product {
  id
  handle
  title
  description
  descriptionHtml
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  images(first: 10) {
    edges {
      node {
        url
        altText
      }
    }
  }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        sku
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        weight
        weightUnit
        image { url altText }
      }
    }
  }
}
`;

const cartFragment = `
fragment CartFields on Cart {
  id
  checkoutUrl
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            image { url altText }
            product { handle title }
          }
        }
      }
    }
  }
}
`;

const articleFragment = `
fragment ArticleFields on Article {
  id
  handle
  title
  excerpt
  contentHtml
  publishedAt
  onlineStoreUrl
  blog { handle title }
  image { url altText }
}
`;

const collectionFragment = `
fragment CollectionFields on Collection {
  id
  handle
  title
  description
  updatedAt
  image { url altText }
}
`;

export const isShopifyConfigured = () => Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);

const assertConfigured = () => {
	if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
		throw new Error('Shopify is not configured. Set SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_TOKEN.');
	}
};

const shopifyFetch = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
	assertConfigured();

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	const json = (await response.json().catch(() => ({}))) as GraphQLResponse<T>;

	if (!response.ok) {
		const message =
			json?.errors
				?.map((e) => e?.message)
				.filter(Boolean)
				.join('; ') || `HTTP ${response.status}`;
		throw new Error(`Shopify request failed: ${message}`);
	}

	if (json.errors?.length) {
		const message = json.errors.map((e) => e?.message || 'Unknown error').join('; ');
		throw new Error(`Shopify GraphQL error: ${message}`);
	}

	if (!json.data) {
		throw new Error('Shopify response missing data');
	}

	return json.data;
};

const mapProduct = (product: any): ShopifyProduct => ({
	id: product.id,
	handle: product.handle,
	title: product.title,
	description: product.description,
	descriptionHtml: product.descriptionHtml,
	images:
		product.images?.edges?.map((edge: any) => ({
			url: edge?.node?.url,
			altText: edge?.node?.altText ?? null
		})) ?? [],
	variants:
		product.variants?.edges?.map((edge: any) => {
			const node = edge?.node as ShopifyVariant & {
				priceV2?: { amount: string; currencyCode: string };
			};
			const price = (node as any).price ??
				(node as any).priceV2 ?? {
					amount: '0',
					currencyCode: 'USD'
				};

			return {
				id: node.id,
				title: node.title,
				availableForSale: node.availableForSale,
				price,
				compareAtPrice: node?.compareAtPrice ?? null,
				image: (edge?.node as any)?.image ?? null,
				sku: (node as any)?.sku ?? null,
				quantityAvailable: (node as any)?.quantityAvailable ?? null,
				selectedOptions: (node as any)?.selectedOptions ?? [],
				weight: (node as any)?.weight ?? null,
				weightUnit: (node as any)?.weightUnit ?? null
			};
		}) ?? [],
	minPrice: product.priceRange?.minVariantPrice,
	maxPrice: product.priceRange?.maxVariantPrice
});

const mapCart = (cart: any): ShopifyCart => ({
	id: cart.id,
	checkoutUrl: cart.checkoutUrl,
	cost: {
		subtotal: cart.cost?.subtotalAmount,
		total: cart.cost?.totalAmount
	},
	lines:
		cart.lines?.edges?.map((edge: any) => ({
			id: edge?.node?.id,
			quantity: edge?.node?.quantity,
			merchandise: {
				id: edge?.node?.merchandise?.id,
				title: edge?.node?.merchandise?.title,
				productHandle: edge?.node?.merchandise?.product?.handle,
				productTitle: edge?.node?.merchandise?.product?.title,
				image: edge?.node?.merchandise?.image
					? {
							url: edge.node.merchandise.image.url,
							altText: edge.node.merchandise.image.altText ?? null
						}
					: null,
				price: edge?.node?.merchandise?.price ??
					edge?.node?.merchandise?.priceV2 ?? {
						amount: '0',
						currencyCode: 'USD'
					}
			}
		})) ?? []
});

const mapArticle = (article: any): ShopifyArticle => {
	const blogHandle = article.blog?.handle ?? null;
	const fallbackUrl =
		storeBaseUrl && blogHandle ? `${storeBaseUrl}/blogs/${blogHandle}/${article.handle}` : null;

	return {
		id: article.id,
		handle: article.handle,
		title: article.title,
		excerpt: article.excerpt ?? null,
		contentHtml: article.contentHtml ?? null,
		publishedAt: article.publishedAt,
		image: article.image
			? {
					url: article.image.url,
					altText: article.image.altText ?? null
				}
			: null,
		blogHandle,
		blogTitle: article.blog?.title ?? null,
		url: article.onlineStoreUrl ?? fallbackUrl
	};
};

const mapCollection = (collection: any): ShopifyCollection => ({
	id: collection.id,
	handle: collection.handle,
	title: collection.title,
	description: collection.description ?? '',
	updatedAt: collection.updatedAt ?? '',
	image: collection.image
		? {
				url: collection.image.url,
				altText: collection.image.altText ?? null
			}
		: null
});

const ensureCartResult = (cart: ShopifyCart | null, errors?: { message?: string }[]) => {
	if (errors?.length) {
		const message = errors.map((err) => err?.message || 'Unknown error').join('; ');
		throw new Error(`Shopify cart error: ${message}`);
	}

	if (!cart) {
		throw new Error('Shopify cart not available.');
	}

	return cart;
};

export const getProductByHandle = async (handle: string): Promise<ShopifyProduct | null> => {
	const data = await shopifyFetch<{
		product: any;
	}>(
		`
    ${productFragment}
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductBasics
      }
    }
  `,
		{ handle }
	);

	if (!data?.product) return null;
	return mapProduct(data.product);
};

export const listProducts = async (first = 12): Promise<ShopifyProduct[]> => {
	const data = await shopifyFetch<{
		products: { edges: { node: any }[] };
	}>(
		`
    ${productFragment}
    query Products($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductBasics
          }
        }
      }
    }
  `,
		{ first }
	);

	return data?.products?.edges?.map((edge) => mapProduct(edge?.node)).filter(Boolean) ?? [];
};

export const listCollections = async (first = 50): Promise<ShopifyCollection[]> => {
	const data = await shopifyFetch<{
		collections: { edges: { node: any }[] };
	}>(
		`
    ${collectionFragment}
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            ...CollectionFields
          }
        }
      }
    }
  `,
		{ first }
	);

	return data?.collections?.edges?.map((edge) => mapCollection(edge?.node)).filter(Boolean) ?? [];
};

export const listProductsByCollectionHandle = async (
	handle: string,
	first = 50
): Promise<ShopifyProduct[]> => {
	const data = await shopifyFetch<{
		collection: { products: { edges: { node: any }[] } } | null;
	}>(
		`
    ${productFragment}
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              ...ProductBasics
            }
          }
        }
      }
    }
  `,
		{ handle, first }
	);

	return (
		data?.collection?.products?.edges?.map((edge) => mapProduct(edge?.node)).filter(Boolean) ?? []
	);
};

export const listArticles = async ({
	first = 3,
	blogHandle
}: { first?: number; blogHandle?: string } = {}): Promise<ShopifyArticle[]> => {
	if (blogHandle) {
		const data = await shopifyFetch<{
			blog: { articles: { edges: { node: any }[] } | null } | null;
		}>(
			`
      ${articleFragment}
      query BlogArticles($handle: String!, $first: Int!) {
        blog(handle: $handle) {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            edges { node { ...ArticleFields } }
          }
        }
      }
    `,
			{ handle: blogHandle, first }
		);

		return (
			data?.blog?.articles?.edges
				?.map((edge) => (edge?.node ? mapArticle(edge.node) : null))
				.filter((article): article is ShopifyArticle => Boolean(article)) ?? []
		);
	}

	const data = await shopifyFetch<{
		articles: { edges: { node: any }[] };
	}>(
		`
    ${articleFragment}
    query Articles($first: Int!) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges { node { ...ArticleFields } }
      }
    }
  `,
		{ first }
	);

	return (
		data?.articles?.edges
			?.map((edge) => (edge?.node ? mapArticle(edge.node) : null))
			.filter((article): article is ShopifyArticle => Boolean(article)) ?? []
	);
};

export const getCart = async (cartId: string): Promise<ShopifyCart | null> => {
	if (!cartId) return null;

	const data = await shopifyFetch<{
		cart: any;
	}>(` ${cartFragment} query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`, {
		id: cartId
	});

	return data?.cart ? mapCart(data.cart) : null;
};

export const createCart = async (options: {
	lines?: CartLineInput[];
	buyerIdentity?: ShopifyBuyerIdentity;
}): Promise<ShopifyCart> => {
	const data = await shopifyFetch<{
		cartCreate: { cart: any; userErrors?: { message?: string }[] };
	}>(
		`
    ${cartFragment}
    mutation CreateCart($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
      cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
		{ lines: options.lines, buyerIdentity: options.buyerIdentity }
	);

	return ensureCartResult(mapCart(data.cartCreate.cart), data.cartCreate.userErrors)!;
};

export const addLinesToCart = async (
	cartId: string,
	lines: CartLineInput[]
): Promise<ShopifyCart> => {
	const data = await shopifyFetch<{
		cartLinesAdd: { cart: any; userErrors?: { message?: string }[] };
	}>(
		`
    ${cartFragment}
    mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
		{ cartId, lines }
	);

	return ensureCartResult(mapCart(data.cartLinesAdd.cart), data.cartLinesAdd.userErrors)!;
};

export const updateCartLines = async (
	cartId: string,
	lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> => {
	const data = await shopifyFetch<{
		cartLinesUpdate: { cart: any; userErrors?: { message?: string }[] };
	}>(
		`
    ${cartFragment}
    mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
		{ cartId, lines }
	);

	return ensureCartResult(mapCart(data.cartLinesUpdate.cart), data.cartLinesUpdate.userErrors)!;
};

export const removeCartLines = async (cartId: string, lineIds: string[]): Promise<ShopifyCart> => {
	const data = await shopifyFetch<{
		cartLinesRemove: { cart: any; userErrors?: { message?: string }[] };
	}>(
		`
    ${cartFragment}
    mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
		{ cartId, lineIds }
	);

	return ensureCartResult(mapCart(data.cartLinesRemove.cart), data.cartLinesRemove.userErrors)!;
};

export const updateCartBuyerIdentity = async (
	cartId: string,
	identity: ShopifyBuyerIdentity
): Promise<ShopifyCart> => {
	const data = await shopifyFetch<{
		cartBuyerIdentityUpdate: { cart: any; userErrors?: { message?: string }[] };
	}>(
		`
    ${cartFragment}
    mutation UpdateBuyer($cartId: ID!, $identity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $identity) {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `,
		{ cartId, identity }
	);

	return ensureCartResult(
		mapCart(data.cartBuyerIdentityUpdate.cart),
		data.cartBuyerIdentityUpdate.userErrors
	)!;
};
