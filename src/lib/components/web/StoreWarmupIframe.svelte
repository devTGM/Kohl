<script lang="ts">
	import { browser } from '$app/environment';

	const SESSION_KEY = 'kohlspice.storeframe.warm';
	const SRC = 'https://store.kohlspice.in';

	$effect(() => {
		if (!browser) return;
		if (sessionStorage.getItem(SESSION_KEY)) return;

		const iframe = document.createElement('iframe');
		iframe.src = SRC;
		iframe.loading = 'eager';
		iframe.setAttribute('aria-hidden', 'true');
		iframe.setAttribute('tabindex', '-1');
		iframe.style.position = 'absolute';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.opacity = '0';
		iframe.style.pointerEvents = 'none';
		iframe.style.border = '0';
		iframe.style.zIndex = '-1';
		iframe.style.left = '-9999px';
		iframe.style.top = '-9999px';

		document.body.appendChild(iframe);
		sessionStorage.setItem(SESSION_KEY, '1');

		const timeout = window.setTimeout(() => {
			iframe.remove();
		}, 5000);

		return () => {
			window.clearTimeout(timeout);
			iframe.remove();
		};
	});
</script>
