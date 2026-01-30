<script>
	import { onMount, tick } from 'svelte';
	import { SplitText } from 'gsap/SplitText';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { gsap } from 'gsap';

	gsap.registerPlugin(SplitText, ScrollTrigger);

	let container = $state();

	onMount(() => {
		if (!container) return;

		const ctx = gsap.context(async () => {
			await tick();

			const split = new SplitText(container.querySelectorAll('h1, p'), {
				type: 'lines',
				linesClass: 'reveal-line'
			});

			split.lines.forEach((line) => {
				// Inject span for text control
				const originalContent = line.innerHTML;
				line.innerHTML = `<span class="reveal-text">${originalContent}</span>`;

				// Create the block
				const block = document.createElement('div');
				block.className = 'reveal-block';
				line.appendChild(block);

				const text = line.querySelector('.reveal-text');

				// Apply structural styles via GSAP to avoid :global() in CSS
				gsap.set(line, {
					position: 'relative',
					display: 'inline-block',
					overflow: 'hidden',
					opacity: 0,
					padding: '0.1em 0'
				});

				gsap.set(text, {
					display: 'inline-block'
				});

				gsap.set(block, {
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: '#abff02',
					zIndex: 2
				});

				// Animation timeline
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: line,
						start: 'top 85%',
						toggleActions: 'play none none reverse'
					}
				});

				tl.set(text, { opacity: 0 })
					.set(line, { opacity: 1 })
					.fromTo(
						block,
						{ scaleX: 0, transformOrigin: 'left' },
						{ scaleX: 1, duration: 0.5, ease: 'power3.inOut' }
					)
					.set(text, { opacity: 1 })
					.to(block, {
						scaleX: 0,
						transformOrigin: 'right',
						duration: 0.5,
						ease: 'power3.inOut'
					});
			});
		}, container);

		return () => ctx.revert();
	});
</script>

<main bind:this={container} class="page-container">
	<div class="spacer"></div>
	<h1 class="reveal-target">Cinematography</h1>
	<p class="reveal-description">
		Capturing the essence of motion through the lens of pure storytelling.
	</p>
	<div class="spacer"></div>
</main>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200vh;
		background: #0f0f0f;
		color: #ffffff;
		margin: 0;
		text-align: center;
	}

	.spacer {
		height: 80vh;
	}

	.reveal-target {
		font-size: 8rem;
		font-weight: 900;
		text-transform: uppercase;
		margin: 0;
	}

	.reveal-description {
		font-size: 2rem;
		font-weight: 300;
		max-width: 600px;
		margin-top: 2rem;
		color: #a0a0a0;
	}
</style>
