<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import '@fontsource-variable/big-shoulders-display';
	import '@fontsource/ibm-plex-mono/400.css';

	gsap.registerPlugin(SplitText, ScrollTrigger);

	type Credit = { role: string; name: string; note?: string };

	// The credits describe the effect that's revealing them.
	const CREDITS: Credit[] = [
		{ role: 'Starring', name: 'Three bars of colour', note: 'cyan · magenta · yellow' },
		{ role: 'And', name: 'The line behind them' },
		{ role: 'Timing', name: 'Half a second in, half out', note: 'power3.inOut · 70 ms apart' },
		{ role: 'Shot on', name: 'GSAP SplitText', note: 'every line split, covered and uncovered' }
	];

	const FPS = 24;
	const RUNTIME = 96; // seconds of "film" the full scroll stands for

	let root: HTMLElement;
	let timecode = $state('00:00:00:00');

	const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const ctx = gsap.context(() => {
			// the timecode runs with the scroll, like a reel through a gate
			ScrollTrigger.create({
				trigger: root,
				start: 'top top',
				end: 'bottom bottom',
				onUpdate: (self) => {
					const frames = Math.round(self.progress * RUNTIME * FPS);
					const s = frames / FPS;
					timecode = `00:${pad(s / 60)}:${pad(s % 60)}:${pad(frames % FPS)}`;
				}
			});

			if (reduced) return;

			root.querySelectorAll<HTMLElement>('.card').forEach((card) => {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: card,
						start: 'top 70%',
						toggleActions: 'play none none reverse'
					}
				});

				card.querySelectorAll<HTMLElement>('.reveal').forEach((el, order) => {
					SplitText.create(el, {
						type: 'lines',
						linesClass: 'line',
						onSplit(self) {
							self.lines.forEach((line, k) => {
								// each line gets its text and three colour separations laid over it
								line.innerHTML =
									`<span class="line-text">${line.innerHTML}</span>` +
									'<span class="strip strip-c"></span>' +
									'<span class="strip strip-m"></span>' +
									'<span class="strip strip-y"></span>';
								const text = line.querySelector('.line-text');
								const strips = line.querySelectorAll('.strip');
								const at = order * 0.28 + k * 0.12;

								gsap.set(text, { opacity: 0 });
								tl.fromTo(
									strips,
									{ scaleX: 0, transformOrigin: '0% 50%' },
									{ scaleX: 1, duration: 0.45, ease: 'power3.inOut', stagger: 0.07 },
									at
								)
									// the cut: the line is there the moment the last strip covers it
									.set(text, { opacity: 1 }, at + 0.59)
									.to(
										strips,
										{
											scaleX: 0,
											transformOrigin: '100% 50%',
											duration: 0.45,
											ease: 'power3.inOut',
											stagger: 0.07
										},
										at + 0.62
									);
							});
						}
					});
				});
			});
		}, root);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Block Reveal — Playground</title>
</svelte:head>

<div class="theatre" bind:this={root}>
	<!-- letterbox: the frame the whole sequence plays inside -->
	<div class="bar bar-top" aria-hidden="true">
		<span class="timecode">{timecode}</span>
		<span>Reel 1 · Playground</span>
	</div>
	<div class="bar bar-bottom">
		<span aria-hidden="true">Scroll to roll the credits</span>
		<a href={resolve('/')}>← Playground</a>
	</div>
	<div class="grain" aria-hidden="true"></div>

	<main>
		<section class="card card-title">
			<p class="role reveal">A playground short</p>
			<h1 class="reveal">Block Reveal</h1>
			<p class="note reveal">A title sequence in three colours.</p>
		</section>

		{#each CREDITS as credit (credit.name)}
			<section class="card">
				<p class="role reveal">{credit.role}</p>
				<h2 class="reveal">{credit.name}</h2>
				{#if credit.note}
					<p class="note reveal">{credit.note}</p>
				{/if}
			</section>
		{/each}

		<section class="card card-end">
			<h2 class="reveal">Fin.</h2>
			<p class="note reveal">Scroll back up to run it in reverse.</p>
		</section>
	</main>
</div>

<style>
	.theatre {
		--house: #0e0d0c;
		--screen: #f1ece2;
		--dim: #8d877c;
		--cyan: #12a5b8;
		--magenta: #d42a7c;
		--yellow: #f1c232;
		--bar: 7svh;

		background: var(--house);
		color: var(--screen);
		font-family: 'Big Shoulders Display Variable', 'Arial Narrow', sans-serif;
	}

	/* ---------- letterbox ---------- */
	.bar {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: var(--bar);
		min-height: 2.75rem;
		padding: 0 clamp(1rem, 4vw, 2.5rem);
		background: #000;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--dim);
	}

	.bar-top {
		top: 0;
	}

	.bar-bottom {
		bottom: 0;
	}

	.timecode {
		color: var(--screen);
		font-variant-numeric: tabular-nums;
	}

	.bar a {
		color: var(--screen);
		text-decoration: none;
		transition: color 150ms ease-out;
	}

	.bar a:hover {
		color: var(--yellow);
	}

	.bar a:focus-visible {
		outline: 2px solid var(--yellow);
		outline-offset: 4px;
	}

	/* film grain: a still noise texture, jogged a few pixels each frame on the compositor */
	.grain {
		position: fixed;
		inset: -50%;
		z-index: 2;
		pointer-events: none;
		opacity: 0.08;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		animation: grain 0.5s steps(4) infinite;
	}

	@keyframes grain {
		25% {
			transform: translate(-3%, 2%);
		}
		50% {
			transform: translate(2%, -4%);
		}
		75% {
			transform: translate(-2%, -1%);
		}
	}

	/* ---------- the cards ---------- */
	.card {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: clamp(0.75rem, 2vh, 1.5rem);
		min-height: 100svh;
		padding: calc(var(--bar) + 2rem) clamp(1rem, 5vw, 4rem);
		text-align: center;
	}

	.card-end {
		min-height: 90svh;
	}

	h1,
	h2 {
		margin: 0;
		font-weight: 800;
		line-height: 0.86;
		letter-spacing: -0.005em;
		text-transform: uppercase;
	}

	h1 {
		font-size: clamp(4.5rem, 3rem + 11vw, 15rem);
	}

	h2 {
		max-width: 12ch;
		font-size: clamp(3.25rem, 2rem + 7vw, 9.5rem);
	}

	.role,
	.note {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: clamp(0.7rem, 0.6rem + 0.3vw, 0.85rem);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--dim);
	}

	.note {
		letter-spacing: 0.08em;
		text-transform: none;
	}

	/* ---------- the reveal ---------- */
	/* each split line hugs its text, so the strips cover exactly the words and no more */
	.reveal :global(.line) {
		position: relative;
		width: fit-content;
		margin-inline: auto;
		padding: 0.04em 0.06em;
	}

	.reveal :global(.line-text) {
		display: inline-block;
	}

	.reveal :global(.strip) {
		position: absolute;
		inset: 0;
		transform: scaleX(0);
	}

	.reveal :global(.strip-c) {
		background: var(--cyan);
	}

	.reveal :global(.strip-m) {
		background: var(--magenta);
	}

	.reveal :global(.strip-y) {
		background: var(--yellow);
	}

	@media (prefers-reduced-motion: reduce) {
		.grain {
			animation: none;
		}
	}
</style>
