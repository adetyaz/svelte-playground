<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import '@fontsource-variable/fraunces/full.css';
	import '@fontsource-variable/fraunces/full-italic.css';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';

	type Volume = {
		title: string;
		ease: string;
		cloth: string;
		foil: string;
		lede: string;
		use: string;
		avoid: string;
	};

	const VOLUMES: Volume[] = [
		{
			title: 'Ease out',
			ease: 'expo.out',
			cloth: '#6b1f2a',
			foil: '#e6cf8b',
			lede: 'Starts fast and lands softly.',
			use: 'Things arriving: a menu opening, a toast, a card sliding in.',
			avoid: 'Things leaving. They seem to hesitate on the way out.'
		},
		{
			title: 'Ease in-out',
			ease: 'power3.inOut',
			cloth: '#2f4a36',
			foil: '#e6cf8b',
			lede: 'Eases away, then settles.',
			use: 'Something moving from one place on screen to another.',
			avoid: 'Replies to a click. The slow start reads as lag.'
		},
		{
			title: 'Back',
			ease: 'back.out(1.7)',
			cloth: '#233f7c',
			foil: '#e6cf8b',
			lede: 'Overshoots a little, then comes back.',
			use: 'Small pops: a badge, a like, a toggle snapping on.',
			avoid: 'Large panels. The overshoot turns into a wobble.'
		},
		{
			title: 'Elastic',
			ease: 'elastic.out(1, 0.4)',
			cloth: '#a57420',
			foil: '#20170c',
			lede: 'Springs past and wobbles to rest.',
			use: 'A playful moment, used once.',
			avoid: 'Anything people see every day.'
		}
	];

	// Each curve is sampled from the real ease, so the drawing is the motion. Progress is mapped so
	// overshoot (Back, Elastic) still fits: 0 sits at y 80, 1 at y 26.
	const toY = (p: number) => 80 - p * 54;
	const curvePath = (ease: string) => {
		const fn = gsap.parseEase(ease);
		const pts: string[] = [];
		for (let i = 0; i <= 120; i++) {
			const t = i / 120;
			pts.push(`${(10 + t * 80).toFixed(2)},${toY(fn(t)).toFixed(2)}`);
		}
		return `M${pts.join(' L')}`;
	};
	const paths = VOLUMES.map((v) => curvePath(v.ease));

	let open = $state(-1);
	let playing = $state(false);

	const books: HTMLElement[] = [];
	const markers: SVGCircleElement[] = [];
	const dots: HTMLElement[] = [];
	let closeButton: HTMLButtonElement;

	let openBook: (i: number) => void = () => {};
	let closeBook: () => void = () => {};
	let play: (i: number) => void = () => {};
	let peek: (i: number, on: boolean) => void = () => {};

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let timeline: gsap.core.Timeline | null = null;
		let busy = false;

		const parts = (i: number) => {
			const b = books[i];
			return {
				book: b,
				cover: b.querySelector<HTMLElement>('.cover')!,
				leaves: [...b.querySelectorAll<HTMLElement>('.leaf')],
				curve: b.querySelector<SVGPathElement>('.plot-curve')!
			};
		};

		// stack the layers a pixel apart so they never fight for the same depth
		books.forEach((_, i) => {
			const { cover, leaves } = parts(i);
			gsap.set(leaves, { z: (k: number) => k + 1, transformOrigin: '0% 50%' });
			gsap.set(cover, { z: 3, transformOrigin: '0% 50%' });
		});

		// ---------- entrance ----------
		if (!reduced) {
			gsap
				.timeline({ defaults: { ease: 'power3.out' } })
				.from('.intro > *', {
					opacity: 0,
					y: 14,
					duration: 0.8,
					stagger: 0.1,
					clearProps: 'transform'
				})
				// clearProps matters here: a leftover transform on a slot would become the frame of
				// reference for the open (fixed) book and trap it under the backdrop
				.from(
					'.slot',
					{ opacity: 0, y: 40, duration: 1, stagger: 0.08, clearProps: 'transform' },
					0.2
				)
				.from('.shelf', { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 0.1);
		}

		// ---------- peek ----------
		peek = (i, on) => {
			if (reduced || open !== -1 || busy) return;
			const { book, cover, leaves } = parts(i);
			gsap.to(book, { rotation: on ? -2 : 0, y: on ? -6 : 0, duration: 0.5, ease: 'power3.out' });
			gsap.to(cover, { rotationY: on ? -34 : 0, duration: 0.6, ease: 'power3.out' });
			gsap.to(leaves, {
				rotationY: (k: number) => (on ? [-20, -28][k] : 0),
				duration: 0.6,
				ease: 'power3.out'
			});
		};

		// ---------- play the ease ----------
		play = (i) => {
			const fn = gsap.parseEase(VOLUMES[i].ease);
			const marker = markers[i];
			const dot = dots[i];
			const state = { t: 0 };
			playing = true;
			gsap.killTweensOf(state);
			gsap.to(state, {
				t: 1,
				duration: reduced ? 0 : 1.6,
				ease: 'none',
				onUpdate: () => {
					const p = fn(state.t);
					marker.setAttribute('cx', String(10 + state.t * 80));
					marker.setAttribute('cy', String(toY(p)));
					dot.style.left = `${p * 100}%`;
				},
				onComplete: () => {
					playing = false;
				}
			});
		};

		// ---------- open: off the shelf, to the middle, then the cover swings over ----------
		openBook = (i) => {
			if (open !== -1 || busy) return;
			busy = true;
			open = i;
			const { book, cover, leaves, curve } = parts(i);
			// stop a peek that's still running, or it keeps tilting the book on its way out
			gsap.killTweensOf([book, cover, ...leaves]);
			gsap.set(book, { rotation: 0, y: 0 });
			gsap.set([cover, ...leaves], { rotationY: 0 });
			const from = book.getBoundingClientRect();

			// Width of one page when open: the spread is two pages wide and must fit the screen.
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const w = Math.min((vw * 0.9) / 2, (vh * 0.78) / 1.4, 360);
			const h = w * 1.4;

			// Fixed and resized for real, not scaled: text and lines stay sharp at full size.
			gsap.set(book, {
				position: 'fixed',
				left: from.left,
				top: from.top,
				'--w': `${from.width}px`,
				zIndex: 20,
				rotation: 0,
				y: 0
			});

			const others = books.filter((_, k) => k !== i).map((b) => b.closest('.slot'));

			timeline = gsap
				.timeline({
					onComplete: () => {
						busy = false;
						closeButton.focus({ preventScroll: true });
						play(i);
					}
				})
				.to(others, { opacity: 0.18, y: 10, duration: 0.5, ease: 'power2.out' }, 0)
				.to(book.parentElement!.querySelector('.label'), { opacity: 0, duration: 0.3 }, 0)
				.to('.backdrop', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0)
				.to('.intro', { opacity: 0.25, duration: 0.5 }, 0)
				.to(
					book,
					{
						left: vw / 2,
						top: (vh - h) / 2,
						'--w': `${w}px`,
						duration: 0.85,
						ease: 'power3.inOut'
					},
					0
				)
				.to(cover, { rotationY: -180, duration: 1.05, ease: 'power2.inOut' }, 0.45)
				.to(leaves, { rotationY: -180, duration: 1.05, ease: 'power2.inOut', stagger: 0.07 }, 0.52)
				.fromTo(
					curve,
					{ strokeDashoffset: 1 },
					{ strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
					1.15
				);

			if (reduced) timeline.progress(1);
		};

		closeBook = () => {
			if (open === -1 || busy || !timeline) return;
			busy = true;
			const i = open;
			const { book } = parts(i);
			const tl = timeline;
			tl.eventCallback('onReverseComplete', () => {
				gsap.set(book, { clearProps: 'position,left,top,zIndex' });
				book.style.removeProperty('--w');
				open = -1;
				busy = false;
				timeline = null;
				book.parentElement
					?.querySelector<HTMLButtonElement>('.book-hit')
					?.focus({ preventScroll: true });
			});
			tl.timeScale(1.5).reverse();
			if (reduced) tl.progress(0);
		};

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeBook();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			timeline?.kill();
		};
	});
</script>

<svelte:head>
	<title>A field guide to easing — Playground</title>
</svelte:head>

<main class="desk" class:is-reading={open !== -1}>
	<a class="back" href={resolve('/')}>← Playground</a>

	<header class="intro">
		<p class="kicker">Four volumes · CSS 3D</p>
		<h1>A field guide to easing</h1>
		<p class="sub">
			Each book is one curve. Rest on a cover to peek inside, open it to watch the curve move.
		</p>
	</header>

	<div class="shelf-wrap">
		<ul class="books">
			{#each VOLUMES as v, i (v.title)}
				<li class="slot" style:--cloth={v.cloth} style:--foil={v.foil}>
					<div class="book" class:is-open={open === i} bind:this={books[i]}>
						<!-- right-hand page, under everything: the curve and the dot -->
						<div class="page base" inert={open !== i}>
							<p class="page-head">
								<span>Vol. 0{i + 1}</span>
								<span class="page-ease">{v.ease}</span>
							</p>
							<svg class="plot" viewBox="0 0 100 92" aria-hidden="true">
								<line class="axis" x1="10" y1="80" x2="92" y2="80" />
								<line class="axis" x1="10" y1="80" x2="10" y2="14" />
								<line class="guide" x1="10" y1="26" x2="92" y2="26" />
								<text class="axis-label" x="90" y="88" text-anchor="end">time</text>
								<text class="axis-label" x="12" y="22">done</text>
								<path class="plot-curve" d={paths[i]} pathLength="1" />
								<circle class="plot-marker" r="2.2" cx="10" cy="80" bind:this={markers[i]} />
							</svg>
							<div class="track" aria-hidden="true">
								<span class="track-dot" bind:this={dots[i]}></span>
							</div>
							<button
								type="button"
								class="play"
								onclick={() => play(i)}
								disabled={playing}
								tabindex={open === i ? 0 : -1}
							>
								{playing && open === i ? 'Playing…' : 'Play it again'}
							</button>
						</div>

						<div class="page leaf"></div>
						<div class="page leaf"></div>

						<div class="cover">
							<div class="cover-front">
								<span class="cover-vol">Vol. 0{i + 1}</span>
								<svg class="cover-curve" viewBox="0 10 100 80" aria-hidden="true">
									<path d={paths[i]} />
								</svg>
								<span class="cover-title">{v.title}</span>
								<span class="cover-series">A field guide to easing</span>
							</div>
							<!-- the inside of the cover is the left-hand page once open -->
							<div class="cover-inside">
								<span class="inside-vol">Vol. 0{i + 1}</span>
								<h2>{v.title}</h2>
								<p class="lede">{v.lede}</p>
								<dl>
									<dt>Use it for</dt>
									<dd>{v.use}</dd>
									<dt>Avoid it for</dt>
									<dd>{v.avoid}</dd>
								</dl>
							</div>
						</div>
					</div>
					<!-- flat, outside the 3D book: a lifted cover would otherwise swallow the click -->
					<button
						type="button"
						class="book-hit"
						aria-label="Open volume {i + 1}, {v.title}"
						tabindex={open === -1 ? 0 : -1}
						onclick={() => openBook(i)}
						onpointerenter={() => peek(i, true)}
						onpointerleave={() => peek(i, false)}
						onfocus={() => peek(i, true)}
						onblur={() => peek(i, false)}
					></button>
					<p class="label"><span>0{i + 1}</span> {v.ease}</p>
				</li>
			{/each}
		</ul>
		<div class="shelf" aria-hidden="true"></div>
	</div>

	<button
		type="button"
		class="backdrop"
		aria-label="Close the book"
		tabindex="-1"
		onclick={() => closeBook()}
	></button>
	<button
		type="button"
		class="close"
		bind:this={closeButton}
		tabindex={open === -1 ? -1 : 0}
		onclick={() => closeBook()}
	>
		Close book <kbd>Esc</kbd>
	</button>
</main>

<style>
	.desk {
		--ink: #171c26;
		--paper: #f4eee2;
		--paper-2: #e8dfcc;
		--type: #241d16;
		--muted: #8f8a80;
		--lamp: rgb(255 214 150 / 0.11);
		--bw: clamp(128px, 15vw, 196px);

		position: relative;
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: 100vh;
		min-height: 100svh;
		padding: clamp(1.25rem, 4vw, 3rem);
		overflow: hidden;
		background:
			radial-gradient(60% 55% at 50% 0%, var(--lamp), transparent 70%),
			radial-gradient(90% 70% at 50% 100%, rgb(0 0 0 / 0.35), transparent 70%), var(--ink);
		color: #ece6da;
		font-family: 'Fraunces Variable', Georgia, serif;
	}

	.back,
	.kicker,
	.label,
	.close,
	.page-head,
	.page-ease,
	.play,
	.cover-vol,
	.cover-series,
	.inside-vol,
	dt {
		font-family: 'IBM Plex Mono', monospace;
		font-weight: 400;
	}

	.back {
		position: absolute;
		top: clamp(1.25rem, 3vw, 2rem);
		left: clamp(1.25rem, 4vw, 3rem);
		z-index: 5;
		font-size: 0.72rem;
		color: var(--muted);
		text-decoration: none;
		transition: color 150ms ease-out;
	}

	.back:hover {
		color: #ece6da;
	}

	.back:focus-visible,
	.close:focus-visible,
	.play:focus-visible {
		outline: 2px solid #e6cf8b;
		outline-offset: 3px;
		border-radius: 2px;
	}

	/* ---------- intro ---------- */
	.intro {
		max-width: 34rem;
		margin: clamp(3rem, 9vh, 6rem) auto 0;
		text-align: center;
	}

	.kicker {
		margin: 0;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		color: #e6cf8b;
	}

	h1 {
		margin: 0.6rem 0 0;
		font-size: clamp(2.2rem, 1.4rem + 3vw, 3.8rem);
		font-weight: 380;
		font-style: italic;
		font-variation-settings:
			'SOFT' 100,
			'WONK' 1,
			'opsz' 144;
		line-height: 1;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.sub {
		margin: 1rem auto 0;
		max-width: 30ch;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--muted);
		text-wrap: pretty;
	}

	/* ---------- shelf ---------- */
	.shelf-wrap {
		align-self: center;
		justify-self: center;
		padding-bottom: 2rem;
	}

	.books {
		display: flex;
		gap: clamp(1.25rem, 3vw, 2.75rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.slot {
		width: var(--bw);
	}

	/* the slot keeps the book's place on the shelf while the book itself is out being read */
	.slot::before {
		content: '';
		display: block;
		aspect-ratio: 5 / 7;
	}

	.shelf {
		height: 10px;
		margin: -2.6rem calc(clamp(1.25rem, 3vw, 2.75rem) * -1) 0;
		border-radius: 2px;
		background: linear-gradient(#3a2d22, #261d16);
		box-shadow:
			0 1px 0 rgb(255 214 150 / 0.18) inset,
			0 18px 30px rgb(0 0 0 / 0.5);
		transform-origin: center;
	}

	.label {
		margin: 1.25rem 0 0;
		font-size: 0.68rem;
		color: var(--muted);
		text-align: center;
	}

	.label span {
		color: #e6cf8b;
	}

	/* ---------- the book ---------- */
	.book {
		--w: var(--bw);

		position: absolute;
		top: 0;
		left: 0;
		width: var(--w);
		aspect-ratio: 5 / 7;
		font-size: calc(var(--w) / 15);
		perspective: calc(var(--w) * 10);
		transform-style: preserve-3d;
	}

	.slot {
		position: relative;
	}

	.page,
	.cover,
	.cover-front,
	.cover-inside {
		position: absolute;
		inset: 0;
	}

	.page {
		background: var(--paper);
		border-radius: 0 0.35em 0.35em 0;
	}

	.leaf {
		background: linear-gradient(90deg, #ebe3d3, var(--paper) 12%);
		box-shadow: inset -1px 0 0 rgb(0 0 0 / 0.06);
	}

	.cover {
		transform-style: preserve-3d;
	}

	.cover-front,
	.cover-inside {
		backface-visibility: hidden;
		border-radius: 0 0.4em 0.4em 0;
	}

	/* bookcloth: a fine weave, a darker hinge at the spine, foil stamping */
	.cover-front {
		display: flex;
		flex-direction: column;
		padding: 1.3em 1.2em 1.3em 1.6em;
		background:
			linear-gradient(
				90deg,
				rgb(0 0 0 / 0.38),
				rgb(0 0 0 / 0.08) 7%,
				transparent 9%,
				rgb(255 255 255 / 0.05) 10%,
				transparent 12%
			),
			repeating-linear-gradient(0deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 3px),
			repeating-linear-gradient(90deg, rgb(0 0 0 / 0.06) 0 1px, transparent 1px 3px), var(--cloth);
		box-shadow:
			0 0.2em 0.6em rgb(0 0 0 / 0.35),
			0 1.4em 2.4em rgb(0 0 0 / 0.35);
		color: var(--foil);
	}

	.cover-vol {
		font-size: 0.62em;
		letter-spacing: 0.1em;
		opacity: 0.85;
	}

	.cover-curve {
		width: 100%;
		margin: auto 0 0.6em;
		overflow: visible;
	}

	.cover-curve path {
		fill: none;
		stroke: var(--foil);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.cover-title {
		font-size: 1.9em;
		font-weight: 420;
		font-style: italic;
		font-variation-settings:
			'SOFT' 100,
			'WONK' 1,
			'opsz' 144;
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	.cover-series {
		margin-top: 0.7em;
		padding-top: 0.6em;
		border-top: 1px solid color-mix(in srgb, var(--foil) 45%, transparent);
		font-size: 0.5em;
		letter-spacing: 0.08em;
		opacity: 0.8;
	}

	/* inside of the cover: endpaper with the cloth turned in at the edges */
	.cover-inside {
		display: flex;
		flex-direction: column;
		gap: 0.6em;
		padding: 1.6em 1.5em;
		transform: rotateY(180deg);
		border-radius: 0.4em 0 0 0.4em;
		background: linear-gradient(270deg, rgb(0 0 0 / 0.14), transparent 9%), var(--paper-2);
		box-shadow: inset 0 0 0 0.35em var(--cloth);
		color: var(--type);
	}

	.inside-vol {
		font-size: 0.6em;
		letter-spacing: 0.1em;
		color: #8a7d68;
	}

	h2 {
		margin: 0;
		font-size: 2em;
		font-weight: 420;
		font-style: italic;
		font-variation-settings:
			'SOFT' 100,
			'WONK' 1,
			'opsz' 144;
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0;
		font-size: 0.95em;
		line-height: 1.35;
	}

	dl {
		margin: auto 0 0;
		display: grid;
		gap: 0.35em;
		font-size: 0.72em;
		line-height: 1.4;
	}

	dt {
		margin-top: 0.6em;
		font-size: 0.82em;
		letter-spacing: 0.06em;
		color: #8a7d68;
	}

	dd {
		margin: 0;
	}

	/* ---------- right-hand page: the curve, moving ---------- */
	.base {
		display: flex;
		flex-direction: column;
		padding: 1.4em 1.4em 1.2em 1.6em;
		background: linear-gradient(90deg, rgb(0 0 0 / 0.13), transparent 9%), var(--paper);
		color: var(--type);
	}

	.page-head {
		display: flex;
		justify-content: space-between;
		margin: 0;
		font-size: 0.6em;
		letter-spacing: 0.08em;
		color: #8a7d68;
	}

	.page-ease {
		color: var(--cloth);
		letter-spacing: 0;
	}

	.plot {
		flex: 1;
		width: 100%;
		min-height: 0;
		margin-top: 0.4em;
		overflow: visible;
	}

	.axis {
		stroke: #b6aa94;
		stroke-width: 0.5;
	}

	.guide {
		stroke: #cfc4ad;
		stroke-width: 0.4;
		stroke-dasharray: 1.5 1.5;
	}

	.axis-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 3.6px;
		fill: #8a7d68;
	}

	.plot-curve {
		fill: none;
		stroke: var(--cloth);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
	}

	.plot-marker {
		fill: var(--paper);
		stroke: var(--type);
		stroke-width: 0.9;
	}

	.track {
		position: relative;
		height: 1px;
		margin: 0.9em 0.9em 1.1em;
		background: #c9bda6;
	}

	.track-dot {
		position: absolute;
		left: 0;
		top: 50%;
		width: 0.7em;
		height: 0.7em;
		border-radius: 50%;
		background: var(--cloth);
		transform: translate(-50%, -50%);
	}

	.play {
		align-self: flex-start;
		padding: 0.45em 0.8em;
		border: 0;
		border-radius: 999px;
		background: var(--type);
		color: var(--paper);
		font-size: 0.6em;
		cursor: pointer;
		transition-property: scale, opacity;
		transition-duration: 150ms;
		transition-timing-function: ease-out;
	}

	.play:active {
		scale: 0.96;
	}

	.play:disabled {
		opacity: 0.45;
		cursor: default;
	}

	/* ---------- the hit area: the whole closed book is one button ---------- */
	.book-hit {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		aspect-ratio: 5 / 7;
		padding: 0;
		border: 0;
		border-radius: 0 0.4em 0.4em 0;
		background: none;
		cursor: pointer;
	}

	.book-hit:focus-visible {
		outline: 2px solid #e6cf8b;
		outline-offset: 6px;
	}

	.book.is-open + .book-hit {
		display: none;
	}

	/* ---------- reading ---------- */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 10;
		padding: 0;
		border: 0;
		background: rgb(10 12 18 / 0.72);
		backdrop-filter: blur(3px);
		cursor: zoom-out;
		opacity: 0;
		visibility: hidden;
	}

	.close {
		position: fixed;
		top: clamp(1rem, 3vw, 2rem);
		right: clamp(1rem, 4vw, 3rem);
		z-index: 30;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem 0.5rem 0.9rem;
		border: 0;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.06);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12);
		color: #ece6da;
		font-size: 0.72rem;
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 300ms ease-out,
			visibility 300ms,
			background-color 150ms ease-out;
	}

	.close:hover {
		background: rgb(255 255 255 / 0.12);
	}

	.is-reading .close {
		opacity: 1;
		visibility: visible;
		transition-delay: 0.9s, 0.9s, 0s;
	}

	kbd {
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		background: rgb(255 255 255 / 0.1);
		font: inherit;
		font-size: 0.62rem;
		color: var(--muted);
	}

	/* no keyboard to press Esc on */
	@media (hover: none) {
		kbd {
			display: none;
		}
	}

	/* ---------- small screens: two by two ---------- */
	@media (max-width: 720px) {
		.desk {
			--bw: clamp(118px, 36vw, 170px);
		}

		.books {
			display: grid;
			grid-template-columns: repeat(2, var(--bw));
			row-gap: 3.5rem;
		}

		.shelf {
			display: none;
		}

		.intro {
			margin-top: 3.5rem;
		}
	}
</style>
