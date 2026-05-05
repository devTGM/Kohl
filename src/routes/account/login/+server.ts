import { SHOPIFY_DOMAIN } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

const domainToUrl = (domain: string) => (domain.startsWith('http') ? domain : `https://${domain}`);

export const GET = () => {
	if (!SHOPIFY_DOMAIN) {
		throw error(503, 'SHOPIFY_DOMAIN is not configured.');
	}

	const url = `${domainToUrl(SHOPIFY_DOMAIN)}/account/login`;
	throw redirect(302, url);
};
