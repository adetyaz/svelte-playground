<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/martian-mono/standard.css';
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { gsap } from 'gsap';

	let { children } = $props();

	let overlay: HTMLElement;
	let label: HTMLElement;
	let entering = false;

	const destinationName = (pathname: string) => {
		if (pathname === '/') return 'Playground';
		const slug = pathname.split('/').filter(Boolean).pop() ?? '';
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const panels = overlay.querySelectorAll('.wipe-panel');

		const cover = () =>
			gsap
				.timeline()
				.set(overlay, { pointerEvents: 'auto' })
				.set(panels, { transformOrigin: 'top' })
				.to(panels, { scaleY: 1, duration: 0.5, ease: 'expo.inOut', stagger: 0.055 })
				.to(label, { autoAlpha: 1, duration: 0.25 }, '-=0.25')
				.then();

		const reveal = () =>
			gsap
				.timeline()
				.set(panels, { transformOrigin: 'bottom' })
				.to(label, { autoAlpha: 0, duration: 0.2 })
				.to(panels, { scaleY: 0, duration: 0.5, ease: 'expo.inOut', stagger: 0.055 }, '<')
				.set(overlay, { pointerEvents: 'none' })
				.then();

		const stop = beforeNavigate((navigation) => {
			const to = navigation.to;
			if (!to || entering) return;
			if (to.url.pathname === navigation.from?.url.pathname) return;

			navigation.cancel();
			label.textContent = destinationName(to.url.pathname);
			entering = true;

			cover().then(async () => {
				await goto(to.url, { replaceState: navigation.type === 'popstate' });
				entering = false;
				reveal();
			});
		});

		return stop;
	});
</script>

{@render children()}

<div class="wipe" bind:this={overlay} aria-hidden="true">
	{#each Array(5) as _, i (i)}
		<div class="wipe-panel"></div>
	{/each}
	<span class="wipe-label" bind:this={label}></span>
</div>

<style>
	.wipe {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		pointer-events: none;
	}

	.wipe-panel {
		flex: 1;
		background: #c8b6ff;
		transform: scaleY(0);
		transform-origin: top;
	}

	.wipe-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.8rem;
		font-stretch: 87.5%;
		letter-spacing: 0.04em;
		color: #07070b;
		opacity: 0;
		visibility: hidden;
		white-space: nowrap;
	}
</style>
