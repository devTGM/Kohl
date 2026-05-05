<script lang="ts">
	import '../app.css';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import Clarity from '@microsoft/clarity';
	import mixpanel from 'mixpanel-browser';

	let { children } = $props();

	const clarityProjectId = env.PUBLIC_CLARITY_PROJECT_ID;
	const googleAdsConversionSendTo = env.PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO;
	const googleAdsConversionCurrency = env.PUBLIC_GOOGLE_ADS_CONVERSION_CURRENCY ?? 'INR';
	const googleAdsConversionTransactionId = env.PUBLIC_GOOGLE_ADS_CONVERSION_TRANSACTION_ID;
	const googleAdsConversionValueRaw = env.PUBLIC_GOOGLE_ADS_CONVERSION_VALUE?.trim();
	const googleAdsConversionValue = googleAdsConversionValueRaw
		? Number(googleAdsConversionValueRaw)
		: 1;
	const normalizedConversionValue = Number.isFinite(googleAdsConversionValue)
		? googleAdsConversionValue
		: 1;
	const mixpanelToken = env.PUBLIC_MIXPANEL_TOKEN?.trim();

	const normalizePath = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return '';
		const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
		return withLeadingSlash.replace(/\/+$/, '') || '/';
	};

	const googleAdsConversionPaths = (env.PUBLIC_GOOGLE_ADS_CONVERSION_PATH ?? '')
		.split(',')
		.map(normalizePath)
		.filter(Boolean);

	onMount(() => {
		if (clarityProjectId) {
			Clarity.init(clarityProjectId);
		}

		if (mixpanelToken) {
			mixpanel.init(mixpanelToken, {
				autocapture: true,
				record_sessions_percent: 100
			});
		}

		if (!googleAdsConversionSendTo || !googleAdsConversionPaths.length) return;

		const win = window as typeof globalThis & {
			gtag?: (...args: unknown[]) => void;
			dataLayer?: unknown[];
		};

		const locationPath = win.location.pathname.replace(/\/+$/, '') || '/';
		const shouldFire = googleAdsConversionPaths.some((path) => {
			if (path === '/') {
				return locationPath === '/';
			}
			return locationPath === path || locationPath.startsWith(`${path}/`);
		});

		if (!shouldFire) return;

		const payload: Record<string, string | number> = {
			send_to: googleAdsConversionSendTo,
			value: normalizedConversionValue,
			currency: googleAdsConversionCurrency
		};

		if (googleAdsConversionTransactionId) {
			payload.transaction_id = googleAdsConversionTransactionId;
		}

		let attempts = 0;
		const maxAttempts = 5;
		const fireConversion = () => {
			if (win.gtag) {
				win.gtag('event', 'conversion', payload);
				return;
			}
			if (win.dataLayer) {
				win.dataLayer.push(['event', 'conversion', payload]);
				return;
			}
			if (attempts < maxAttempts) {
				attempts += 1;
				setTimeout(fireConversion, 200);
			}
		};

		fireConversion();
	});
</script>

<main class="">
	{@render children()}
</main>
