<script lang="ts">
	import clsx from 'clsx';
	import type { HTMLAttributes } from 'svelte/elements';

	type SliderImage = {
		src: string;
		alt?: string;
	};

	export let before: SliderImage = { src: '', alt: '' };
	export let after: SliderImage = { src: '', alt: '' };
	export let initialPosition = 50;
	export let ariaLabel = 'Drag to compare before and after images';
	export let aspectRatio = '5 / 4';

	const clampPosition = (value: number) => Math.min(100, Math.max(0, value));

	let position = clampPosition(initialPosition);
	let hasInteracted = false;

	$: if (!hasInteracted && initialPosition !== position) {
		position = clampPosition(initialPosition);
	}

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		position = clampPosition(Number(target.value));
		hasInteracted = true;
	};

	let restClass: HTMLAttributes<HTMLDivElement>['class'] = '';
	let restProps: Omit<HTMLAttributes<HTMLDivElement>, 'class'> = {};

	$: {
		const { class: incomingClass = '', ...incomingRest } = $$restProps;
		restClass = incomingClass as HTMLAttributes<HTMLDivElement>['class'];
		restProps = incomingRest as Omit<HTMLAttributes<HTMLDivElement>, 'class'>;
	}

	$: containerClass = ['before-after-slider', restClass].filter(Boolean).join(' ');
</script>

<div
	class={clsx(containerClass, 'h-full')}
	style={`--position:${position}%; --aspect-ratio:${aspectRatio}`}
	{...restProps}
>
	<img class="image image-after" src={after.src} alt={after.alt} loading="lazy" />
	<img class="image image-before" src={before.src} alt={before.alt} loading="lazy" />

	<div class="label label-before font-dm-sans text-40 font-bold" aria-hidden="true">Before</div>
	<div class="label label-after font-dm-sans text-40 font-bold" aria-hidden="true">After</div>

	<div class="divider" aria-hidden="true"></div>

	<div class="handle" aria-hidden="true">
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path
				d="M10.5 6 5 12l5.5 6M13.5 6 19 12l-5.5 6"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>

	<input
		class="slider"
		type="range"
		min="0"
		max="100"
		step="1"
		aria-label={ariaLabel}
		bind:value={position}
		on:input={handleInput}
	/>
</div>

<style>
	.before-after-slider {
		--position: 50%;
		--slider-radius: 12px;
		--handle-size: 48px;
		--handle-color: #ffffff;
		--handle-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
		--accent-color: #7d5a43;
		--label-color: #ffffff;
		--label-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
		position: relative;
		width: 100%;
		aspect-ratio: var(--aspect-ratio);
		border-radius: var(--slider-radius);
		overflow: hidden;
		background: linear-gradient(135deg, #f8f3ed, #f1e6d9);
		user-select: none;
	}

	.before-after-slider .image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}

	.before-after-slider .image-before {
		clip-path: polygon(0 0, var(--position) 0, var(--position) 100%, 0 100%);
		transition: clip-path 120ms ease;
	}

	.before-after-slider .label {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
		color: var(--label-color);
		text-shadow: var(--label-shadow);
		opacity: 0.2;
		pointer-events: none;
		user-select: none;
		z-index: 1;
		transition: clip-path 120ms ease;
	}

	.before-after-slider .label-before {
		clip-path: polygon(0 0, var(--position) 0, var(--position) 100%, 0 100%);
	}

	.before-after-slider .label-after {
		clip-path: polygon(var(--position) 0, 100% 0, 100% 100%, var(--position) 100%);
	}

	.before-after-slider .divider {
		position: absolute;
		left: var(--position);
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 0 1px rgba(125, 90, 67, 0.12);
		pointer-events: none;
		z-index: 2;
	}

	.before-after-slider .handle {
		position: absolute;
		left: var(--position);
		top: 50%;
		transform: translate(-50%, -50%);
		width: var(--handle-size);
		height: var(--handle-size);
		border-radius: 999px;
		background: var(--handle-color);
		display: grid;
		place-items: center;
		box-shadow: var(--handle-shadow);
		color: var(--accent-color);
		pointer-events: none;
		z-index: 3;
	}

	.before-after-slider .handle svg {
		width: 24px;
		height: 24px;
	}

	.before-after-slider .slider {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: ew-resize;
		margin: 0;
		background: transparent;
		touch-action: pan-y;
		z-index: 4;
	}

	.before-after-slider:focus-within .handle {
		outline: 2px solid rgba(125, 90, 67, 0.7);
		outline-offset: 2px;
	}
</style>
