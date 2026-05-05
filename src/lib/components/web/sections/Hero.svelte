<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	let lineOneEl: HTMLElement;
	let lineTwoEl: HTMLElement;
	let taglineEl: HTMLElement;
	let ctaWrapper: HTMLElement | null = null;

	const lineOneWords = ['Clinical', 'Results.'];
	const lineTwoWords = ['A', 'Ritual', 'You’ll', 'Love.'];
	const taglineWords = ['Formulated', 'for', 'Indian', 'Skintones'];
	const ctaWords = ['Get', 'Hyperfade', 'Now'];

	const animateText = () => {
		const words: Element[] = [];

		if (lineOneEl) words.push(...lineOneEl.querySelectorAll('.word'));
		if (lineTwoEl) words.push(...lineTwoEl.querySelectorAll('.word'));
		if (taglineEl) words.push(...taglineEl.querySelectorAll('.word'));
		if (ctaWrapper) words.push(...ctaWrapper.querySelectorAll('.word'));

		if (!words.length) return;

		gsap.from(words, {
			y: 40,
			opacity: 0,
			duration: 1.1,
			ease: 'power3.out',
			stagger: 0.08
		});
	};

	onMount(() => {
		animateText();
	});
</script>

<section class="relative h-screen">
	<div
		class="fixed top-0 z-0 flex h-full w-full bg-[url(/images/hero-web-mobile.webp)] bg-cover bg-center bg-no-repeat py-24 lg:items-center lg:bg-[url(/images/hero-web.webp)] lg:py-0"
	>
		<div class="custom-container w-full space-y-5">
			<div class=" pt-4 lg:pt-20">
				<h1 class="overflow-hidden text-40 leading-tight text-white md:text-72">
					<div
						bind:this={lineOneEl}
						class="flex flex-wrap justify-center gap-x-2 overflow-hidden font-libre italic lg:justify-start"
					>
						{#each lineOneWords as word}
							<span class="word inline-block">{word}</span>
						{/each}
					</div>
					<div
						bind:this={lineTwoEl}
						class="flex flex-wrap justify-center gap-x-2 overflow-hidden font-dm-sans lg:justify-start"
					>
						{#each lineTwoWords as word}
							<span class="word inline-block">{word}</span>
						{/each}
					</div>
				</h1>
				<p
					bind:this={taglineEl}
					class="flex flex-wrap justify-center gap-x-2 overflow-hidden font-dm-sans text-18 text-white md:text-24 lg:justify-start"
				>
					{#each taglineWords as word}
						<span class="word inline-block">{word}</span>
					{/each}
				</p>
			</div>
			<div
				class="absolute bottom-6 left-0 w-full overflow-hidden px-5 lg:relative lg:bottom-0 lg:px-0"
				bind:this={ctaWrapper}
			>
				<Button href="/shop" class="hero-cta w-full lg:w-fit">Get Hyperfade Now</Button>
			</div>
		</div>
	</div>
	<div class=" absolute bottom-0 left-0 h-12 w-full rounded-t-60 bg-white"></div>
</section>
