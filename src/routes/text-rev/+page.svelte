<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(SplitText, ScrollTrigger);

	let container = $state();

	onMount(() => {
		if (!container) return;

		const ctx = gsap.context(() => {
			// Split text into lines and words
			const split = new SplitText(container.querySelectorAll('h1, p'), {
				type: 'lines, words',
				linesClass: 'overflow-hidden'
			});

			// Animate lines rising up
			gsap.from(split.words, {
				y: '100%',
				opacity: 0,
				duration: 1.2,
				ease: 'power4.out',
				stagger: 0.015,
				scrollTrigger: {
					trigger: container,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			});
		}, container);

		return () => ctx.revert();
	});
</script>

<main
	bind:this={container}
	class="page-container flex min-h-[150vh] w-full flex-col items-center justify-center px-6 text-white md:px-12"
>
	<div class="max-w-5xl space-y-12">
		<h1 class="text-7xl font-bold tracking-tighter md:text-9xl">Hello</h1>
		<p class="text-3xl leading-tight font-light text-neutral-400 md:text-5xl">
			We believe in the power of <span class="text-white">quiet conviction</span>. In work that
			speaks softly but lingers long. In design as a tool for clarity, not decoration. We believe
			that the best ideas don't demand attention. Our philosophy is simple: Create with purpose.
		</p>
	</div>
</main>

<style>
	:root {
		--bg: #0a0a0a;
	}

	.page-container {
		background: var(--bg);
		margin: 0;
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
	}

	.page-container {
		overflow: hidden;
		padding-bottom: 0.1em;
	}
</style>
