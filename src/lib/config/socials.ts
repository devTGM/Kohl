export type SocialLink = {
	id: 'instagram' | 'facebook' | 'tiktok' | 'x' | 'youtube' | 'whatsapp';
	label: string;
	href: string;
	icon?: 'facebook' | 'instagram' | 'twitter' | 'whatsapp';
};

export const contact = {
	email: 'support@kohlspice.in',
	phone: '+91 85060 03226',
	phoneHref: 'tel:+918506003226',
	whatsapp: 'https://api.whatsapp.com/send?phone=15488815393'
};

export const socialLinks: SocialLink[] = [
	{
		id: 'instagram',
		label: 'Instagram',
		href: 'https://instagram.com/kohlandspice',
		icon: 'instagram'
	},
	{
		id: 'facebook',
		label: 'Facebook',
		href: 'https://www.facebook.com/share/16Yq7W3tib/?mibextid=wwXIfr',
		icon: 'facebook'
	},
	{
		id: 'x',
		label: 'X (Twitter)',
		href: 'https://x.com/kohlandspice',
		icon: 'twitter'
	},
	{
		id: 'tiktok',
		label: 'TikTok',
		href: 'https://www.tiktok.com/@kohlandspice'
	},
	{
		id: 'youtube',
		label: 'YouTube',
		href: 'https://www.youtube.com/@kohlandspice'
	},
	{ id: 'whatsapp', label: 'WhatsApp', href: contact.whatsapp, icon: 'whatsapp' }
];
