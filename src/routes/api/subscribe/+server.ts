import { json } from '@sveltejs/kit';
import { MAILCHIMP_API_KEY, MAILCHIMP_DATA_CENTER, MAILCHIMP_LIST_ID } from '$env/static/private';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const isConfigured = MAILCHIMP_API_KEY && MAILCHIMP_DATA_CENTER && MAILCHIMP_LIST_ID;

export const POST = async ({ request }) => {
	if (!isConfigured) {
		return json({ message: 'Subscription service is not configured.' }, { status: 500 });
	}

	let email: string | undefined;

	try {
		const body = await request.json();
		email = body?.email?.trim();
	} catch {
		// ignore, validation below will handle missing email
	}

	if (!email || !EMAIL_REGEX.test(email)) {
		return json({ message: 'Please provide a valid email address.' }, { status: 400 });
	}

	const auth = Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString('base64');

	try {
		const response = await fetch(
			`https://${MAILCHIMP_DATA_CENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
			{
				method: 'POST',
				headers: {
					Authorization: `Basic ${auth}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email_address: email,
					status: 'subscribed'
				})
			}
		);

		const data = await response.json().catch(() => null);

		if (response.ok) {
			return json({ message: 'Thanks for subscribing!' });
		}

		if (
			response.status === 400 &&
			data &&
			typeof data === 'object' &&
			'title' in data &&
			data.title === 'Member Exists'
		) {
			return json(
				{
					message: 'You are already on the list—thanks for being with us!'
				},
				{ status: 200 }
			);
		}

		const detail =
			data && typeof data === 'object' && 'detail' in data ? (data.detail as string) : null;

		return json(
			{
				message: detail ?? 'We could not complete your subscription. Please try again later.'
			},
			{ status: response.status === 200 ? 500 : response.status }
		);
	} catch (error) {
		console.error('Mailchimp subscription error', error);

		return json(
			{
				message: 'Something went wrong while subscribing. Please try again.'
			},
			{ status: 500 }
		);
	}
};
