import { json } from '@sveltejs/kit';
import { JUDGEME_PRIVATE_TOKEN, JUDGEME_SHOP_DOMAIN } from '$env/static/private';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const JUDGEME_API_HOST = 'https://api.judge.me';

type PresignedDataResponse = {
	url?: string;
	key_prefix?: string;
	fields?: Record<string, string>;
};

const sanitizeFileName = (value: string) => {
	const clean = value.replace(/[^a-z0-9-_.]/gi, '');
	return clean || `${Date.now()}.jpg`;
};

const parseXmlNode = (xml: string, tag: string) => {
	const match = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
	return match?.[1] ?? null;
};

export const POST = async ({ request }) => {
	const formData = await request.formData().catch(() => null);
	const file = formData?.get('image');

	if (!(file instanceof File)) {
		return json({ ok: false, message: 'Image file is required.' }, { status: 400 });
	}

	if (!ALLOWED_TYPES.has(file.type)) {
		return json(
			{ ok: false, message: 'Only JPG, PNG, and WEBP images are allowed.' },
			{ status: 400 }
		);
	}

	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		return json({ ok: false, message: 'Image must be 5MB or smaller.' }, { status: 400 });
	}

	if (!JUDGEME_PRIVATE_TOKEN || !JUDGEME_SHOP_DOMAIN) {
		return json({ ok: false, message: 'Judge.me is not configured.' }, { status: 500 });
	}

	const presignedUrl = new URL('/api/v1/pictures/presigned_data', JUDGEME_API_HOST);
	presignedUrl.searchParams.set('api_token', JUDGEME_PRIVATE_TOKEN);
	presignedUrl.searchParams.set('shop_domain', JUDGEME_SHOP_DOMAIN);
	presignedUrl.searchParams.set('platform', 'shopify');

	const presignedRes = await fetch(presignedUrl.toString(), { method: 'GET' });
	const presignedData = (await presignedRes.json().catch(() => ({}))) as PresignedDataResponse;
	if (!presignedRes.ok || !presignedData?.url || !presignedData?.key_prefix || !presignedData?.fields) {
		return json({ ok: false, message: 'Unable to prepare Judge.me image upload.' }, { status: 502 });
	}

	const normalizedName = sanitizeFileName(file.name || '');
	const key = `${presignedData.key_prefix}${encodeURIComponent(normalizedName)}`;
	const uploadForm = new FormData();
	uploadForm.append('key', key);
	for (const [fieldName, fieldValue] of Object.entries(presignedData.fields)) {
		uploadForm.append(fieldName, fieldValue);
	}
	uploadForm.append('file', file);

	const uploadRes = await fetch(presignedData.url, {
		method: 'POST',
		body: uploadForm
	});

	const uploadXml = await uploadRes.text().catch(() => '');
	const uploadedKey = parseXmlNode(uploadXml, 'Key') || key;
	const uploadedLocation = parseXmlNode(uploadXml, 'Location');

	if (!uploadRes.ok || !uploadedKey) {
		return json({ ok: false, message: 'Unable to upload image to Judge.me.' }, { status: 502 });
	}

	return json({
		ok: true,
		url: uploadedLocation || null,
		key: uploadedKey,
		source: 'judgeme'
	});
};
