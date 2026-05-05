<svelte:options runes={true} />

<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
	type Size = 'sm' | 'md' | 'lg';
	type ButtonProps = (HTMLAnchorAttributes & HTMLButtonAttributes) & {
		children?: Snippet;
		variant?: Variant;
		size?: Size;
		loading?: boolean;
		uppercase?: boolean;
		fullWidth?: boolean;
	};

	let {
		children,
		variant = 'primary' as Variant,
		size = 'md' as Size,
		type = 'button' as HTMLButtonAttributes['type'],
		href,
		disabled = false,
		loading = false,
		uppercase = true,
		fullWidth = false,
		class: className = '',
		...restProps
	}: ButtonProps = $props();

	const variantClasses: Record<Variant, string> = {
		primary: 'rounded-full bg-main-brown text-white  font-inter ',
		secondary: '',
		ghost: '',
		accent: ''
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-6 py-2 text-18',
		md: 'px-6 py-3 text-18 md:text-20',
		lg: 'px-12 py-4 text-base'
	};

	const isDisabled = $derived(disabled || loading);
	const element = $derived(href ? 'a' : 'button');
	const classes = $derived(
		clsx(
			'inline-flex items-center justify-center font-medium gap-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80',
			uppercase && 'uppercase',
			sizeClasses[size],
			variantClasses[variant],
			fullWidth && 'w-full',
			isDisabled && 'pointer-events-none opacity-70',
			className
		)
	);
</script>

<svelte:element
	this={element}
	type={element === 'button' ? type : undefined}
	href={element === 'a' ? href : undefined}
	class={classes}
	aria-disabled={isDisabled || undefined}
	aria-busy={loading || undefined}
	tabindex={element === 'a' && isDisabled ? -1 : undefined}
	disabled={element === 'button' && isDisabled ? true : undefined}
	{...restProps}
>
	{#if loading}
		<span class="sr-only">Loading</span>
		<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
	{/if}
	{@render children?.()}
</svelte:element>
