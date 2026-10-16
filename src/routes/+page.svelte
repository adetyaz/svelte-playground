<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
	import { SplitText } from 'gsap/SplitText';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';

	gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText);

	type Study = {
		slug: string;
		title: string;
		note: string;
		tag: string;
		curve: string;
	};

	// Each study carries its own ease curve, plotted like a drawing on the sheet.
	const CURVES = {
		out: 'M0,40 C22,2 34,0 60,0',
		inOut: 'M0,40 C26,40 34,0 60,0',
		back: 'M0,40 C14,-8 30,-6 60,0',
		elastic: 'M0,40 C8,-12 14,8 22,-5 C30,-14 40,3 60,0',
		steps: 'M0,40 L15,40 L15,27 L30,27 L30,14 L45,14 L45,0 L60,0',
		linear: 'M0,40 L60,0'
	};

	// Routes are discovered from the file system — add or remove a route folder
	// and the index updates itself. KNOWN only supplies curated metadata.
	const KNOWN: Record<string, { title?: string; note: string; tag: string; curve: string }> = {
		'block-reveal': { note: 'blocks wipe, text appears', tag: 'GSAP · TEXT', curve: CURVES.steps },
		'text-reveal': { note: 'scroll-driven text reveal', tag: 'GSAP · SCROLL', curve: CURVES.inOut },
		'text-rev': { note: 'split text on scroll', tag: 'GSAP · TEXT', curve: CURVES.inOut },
		flip: { note: 'layout magic with gsap flip', tag: 'GSAP · FLIP', curve: CURVES.back },
		movie: { note: 'browse films, flip between views', tag: 'GSAP · FLIP', curve: CURVES.back },
		'smooth-slider': {
			note: 'a film-strip slider that opens up',
			tag: 'GSAP',
			curve: CURVES.inOut
		},
		'3d-gallery': {
			note: 'a scroll-triggered depth gallery',
			tag: 'GSAP · SCROLL',
			curve: CURVES.out
		},
		'flipping-cards': {
			note: 'cards that turn on scroll',
			tag: 'GSAP · SCROLL',
			curve: CURVES.out
		},
		'3d-book': { note: 'a book that opens in css 3d', tag: 'CSS 3D', curve: CURVES.out },
		'3d-sphere': { note: 'a sphere built from flat divs', tag: 'CSS 3D', curve: CURVES.elastic },
		'animated-circle': { note: 'one circle, many states', tag: 'SVELTE', curve: CURVES.elastic },
		transitions: { note: 'enter & leave, with motion', tag: 'MOTION', curve: CURVES.inOut },
		actions: { note: 'svelte actions, observed', tag: 'SVELTE', curve: CURVES.linear },
		'state-functions': { note: 'svelte 5 runes at work', tag: 'SVELTE', curve: CURVES.linear },
		'black-store': { note: 'a storefront in black', tag: 'UI', curve: CURVES.out },
		'cross-chain': { note: 'send usdc across chains', tag: 'UI · WEB3', curve: CURVES.inOut },
		'custodial-wallet': { note: 'a wallet flow, custodied', tag: 'UI · WEB3', curve: CURVES.inOut },
		pokemon: { title: 'Pokémon', note: "gotta fetch 'em all", tag: 'DATA', curve: CURVES.out },
		'more-details': { note: 'progressive disclosure', tag: 'UI', curve: CURVES.steps },
		splitter: { note: 'a tip calculator', tag: 'UI', curve: CURVES.linear }
	};

	const titleize = (slug: string) =>
		slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	// import.meta.glob keys are re-scanned by Vite when route folders are
	// added or removed, so the index updates itself without touching this file.
	const pages = import.meta.glob('./*/+page.svelte');

	const discovered = Object.keys(pages)
		.map((path) => path.split('/')[1])
		.filter(Boolean);

	const ordered = [
		...Object.keys(KNOWN).filter((slug) => discovered.includes(slug)),
		...discovered.filter((slug) => !(slug in KNOWN)).sort()
	];

	const studies: Study[] = ordered.map((slug) => ({
		slug,
		title: KNOWN[slug]?.title ?? titleize(slug),
		note: KNOWN[slug]?.note ?? 'fresh off the drafting table',
		tag: KNOWN[slug]?.tag ?? 'NEW',
		curve: KNOWN[slug]?.curve ?? CURVES.out
	}));

	let root: HTMLElement;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = gsap.context(() => {
			const split = new SplitText('.hero-title', { type: 'chars', charsClass: 'hero-char' });

			gsap.set('.row', { autoAlpha: 0, y: 28 });
			gsap.set('#hero-curve', { strokeDashoffset: 1 });

			const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
			tl.from('.masthead', { autoAlpha: 0, y: -18, duration: 0.7 })
				.from('.hero-eyebrow', { autoAlpha: 0, y: 14, duration: 0.5 }, '-=0.35')
				.from(split.chars, { yPercent: 115, duration: 0.9, stagger: 0.04 }, '-=0.2')
				.from('.hero-sub', { autoAlpha: 0, y: 18, duration: 0.6 }, '-=0.5')
				.from('.figure-label', { autoAlpha: 0, duration: 0.4 }, '-=0.7')
				.to('#hero-curve', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, '-=0.3')
				.from('.handle', { autoAlpha: 0, duration: 0.35, stagger: 0.12 }, '-=0.6')
				.fromTo('.curve-dot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, '-=0.2')
				.to(
					'.curve-dot',
					{
						motionPath: {
							path: '#hero-curve',
							align: '#hero-curve',
							alignOrigin: [0.5, 0.5]
						},
						duration: 1.8,
						ease: 'power2.inOut'
					},
					'<'
				)
				.from('.index-head', { autoAlpha: 0, y: 12, duration: 0.5 }, '-=1.2');

			ScrollTrigger.batch('.row', {
				start: 'top 94%',
				once: true,
				onEnter: (batch) =>
					gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out' })
			});

			return () => split.revert();
		}, root);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Playground — Index of Motion Studies</title>
</svelte:head>

<div class="sheet" bind:this={root}>
	<header class="masthead">
		<span class="brand">ADETAYO<span class="brand-dot">.</span>LAB</span>
		<span class="masthead-meta">INDEX — {studies.length} STUDIES</span>
	</header>

	<section class="hero">
		<div class="hero-text">
			<p class="hero-eyebrow">INDEX OF STUDIES — VOL. 01</p>
			<h1 class="hero-title">
				<span class="t-solid">PLAY</span><span class="t-outline">GROUND</span>
			</h1>
			<p class="hero-sub">
				Nineteen studies in motion, drafted in Svelte — with GSAP, Motion, and whatever the browser
				gives us for free.
			</p>
		</div>

		<figure class="curve-figure">
			<figcaption class="figure-label">FIG. 00 — THE EASE · EXPO.INOUT</figcaption>
			<div class="curve-stage">
				<svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
					<line x1="20" y1="220" x2="380" y2="220" class="axis" />
					<line x1="20" y1="214" x2="20" y2="226" class="axis" />
					<line x1="380" y1="214" x2="380" y2="226" class="axis" />
					<line x1="20" y1="220" x2="160" y2="220" class="handle" />
					<rect x="154" y="214" width="12" height="12" class="handle handle-sq" />
					<line x1="240" y1="40" x2="380" y2="40" class="handle" />
					<rect x="234" y="34" width="12" height="12" class="handle handle-sq" />
					<path id="hero-curve" d="M20,220 C160,220 240,40 380,40" pathLength="1" />
				</svg>
				<span class="curve-dot"></span>
			</div>
		</figure>
	</section>

	<section class="index">
		<div class="index-head">
			<span>FIG.</span>
			<span>STUDY</span>
			<span class="col-note">NOTES</span>
			<span class="col-curve">EASE</span>
			<span class="col-tag">TOOLS</span>
			<span></span>
		</div>

		<ol class="rows">
			{#each studies as study, i (study.slug)}
				<li>
					<a class="row" href={resolve(`/${study.slug}`)}>
						<span class="fig">FIG. {String(i + 1).padStart(2, '0')}</span>
						<span class="study-title">{study.title}</span>
						<span class="col-note note">{study.note}</span>
						<svg class="col-curve spark" viewBox="0 0 60 40" fill="none" aria-hidden="true">
							<path d={study.curve} pathLength="1" />
						</svg>
						<span class="col-tag tag">{study.tag}</span>
						<span class="arrow" aria-hidden="true">↗</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<footer class="colophon">
		<span>SHEET 01 / 01 — SCALE 1:1</span>
		<span>SVELTE 5 · GSAP · MOTION</span>
	</footer>
</div>

<style>
	.sheet {
		--ink: #000308;
		--ink-2: #06234d;
		--paper: #e8effa;
		--muted: #7e93b8;
		--hairline: rgba(232, 239, 250, 0.14);
		--accent: #ff5c1f;

		position: relative;
		min-height: 100vh;
		background: radial-gradient(120% 90% at 50% 0%, var(--ink-2) 0%, var(--ink) 60%);
		color: var(--paper);
		font-family: 'Space Grotesk Variable', 'Inter', sans-serif;
		overflow-x: clip;
	}

	/* blueprint grid */
	.sheet::before {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(rgba(232, 239, 250, 0.045) 1px, transparent 1px),
			linear-gradient(90deg, rgba(232, 239, 250, 0.045) 1px, transparent 1px),
			linear-gradient(rgba(232, 239, 250, 0.09) 1px, transparent 1px),
			linear-gradient(90deg, rgba(232, 239, 250, 0.09) 1px, transparent 1px);
		background-size:
			48px 48px,
			48px 48px,
			240px 240px,
			240px 240px;
	}

	/* ---------- masthead ---------- */
	.masthead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem clamp(1.25rem, 4vw, 3rem);
		border-bottom: 1px solid var(--hairline);
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
	}

	.brand {
		font-weight: 700;
	}

	.brand-dot {
		color: var(--accent);
	}

	.masthead-meta {
		color: var(--muted);
	}

	/* ---------- hero ---------- */
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		align-items: end;
		gap: clamp(2rem, 5vw, 4rem);
		padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3rem) clamp(2.5rem, 5vw, 4rem);
	}

	.hero-eyebrow {
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		color: var(--accent);
		margin: 0 0 1.25rem;
	}

	.hero-title {
		margin: 0;
		font-size: clamp(3.4rem, 11.5vw, 10rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.035em;
		overflow: hidden;
	}

	.t-outline {
		color: transparent;
		-webkit-text-stroke: 1.5px var(--paper);
	}

	.hero-sub {
		max-width: 34rem;
		margin: 1.75rem 0 0;
		color: var(--muted);
		font-size: clamp(0.95rem, 1.4vw, 1.1rem);
		line-height: 1.65;
	}

	/* ---------- fig 00: the ease ---------- */
	.curve-figure {
		margin: 0;
	}

	.figure-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		color: var(--muted);
		margin-bottom: 0.75rem;
	}

	.curve-stage {
		position: relative;
		border: 1px solid var(--hairline);
		padding: clamp(0.75rem, 2vw, 1.5rem);
	}

	.curve-stage svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.axis {
		stroke: var(--hairline);
		stroke-width: 1;
	}

	.handle {
		stroke: var(--muted);
		stroke-width: 1;
		stroke-dasharray: 3 4;
		fill: none;
	}

	.handle-sq {
		fill: var(--ink-2);
		stroke-dasharray: none;
	}

	#hero-curve {
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-dasharray: 1;
	}

	.curve-dot {
		position: absolute;
		top: 0;
		left: 0;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 14px 2px rgba(255, 92, 31, 0.55);
		pointer-events: none;
	}

	/* ---------- index ---------- */
	.index {
		padding: 0 clamp(1.25rem, 4vw, 3rem);
	}

	.index-head,
	.row {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1.3fr) minmax(0, 1fr) 72px auto 2rem;
		align-items: center;
		gap: clamp(1rem, 2.5vw, 2rem);
	}

	.index-head {
		padding: 0.9rem clamp(0.75rem, 1.5vw, 1.25rem);
		border-bottom: 1px solid var(--hairline);
		font-family: 'Space Mono', monospace;
		font-size: 0.64rem;
		letter-spacing: 0.2em;
		color: var(--muted);
	}

	.rows {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row {
		position: relative;
		isolation: isolate;
		padding: clamp(1.1rem, 2.2vw, 1.6rem) clamp(0.75rem, 1.5vw, 1.25rem);
		border-bottom: 1px solid var(--hairline);
		color: var(--paper);
		text-decoration: none;
	}

	/* orange drafting-pencil sweep */
	.row::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.45s cubic-bezier(0.77, 0, 0.18, 1);
	}

	.row:hover::before,
	.row:focus-visible::before {
		transform: scaleX(1);
	}

	.row:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	.fig {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		color: var(--muted);
		transition: color 0.3s;
	}

	.study-title {
		font-size: clamp(1.35rem, 3vw, 2.3rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.05;
		text-transform: uppercase;
		transition:
			color 0.3s,
			transform 0.45s cubic-bezier(0.77, 0, 0.18, 1);
	}

	.note {
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--muted);
		text-align: right;
		transition: color 0.3s;
	}

	.spark path {
		stroke: var(--muted);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition:
			stroke-dashoffset 0.6s cubic-bezier(0.77, 0, 0.18, 1) 0.08s,
			stroke 0.3s;
	}

	.tag {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		white-space: nowrap;
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		color: var(--muted);
		transition:
			color 0.3s,
			border-color 0.3s;
	}

	.arrow {
		font-family: 'Space Mono', monospace;
		font-size: 1.1rem;
		text-align: right;
		transition:
			color 0.3s,
			transform 0.45s cubic-bezier(0.77, 0, 0.18, 1);
	}

	.row:hover .fig,
	.row:focus-visible .fig,
	.row:hover .note,
	.row:focus-visible .note {
		color: rgba(8, 28, 58, 0.75);
	}

	.row:hover .study-title,
	.row:focus-visible .study-title,
	.row:hover .arrow,
	.row:focus-visible .arrow {
		color: var(--ink);
	}

	.row:hover .study-title,
	.row:focus-visible .study-title {
		transform: translateX(0.4rem);
	}

	.row:hover .spark path,
	.row:focus-visible .spark path {
		stroke-dashoffset: 0;
		stroke: var(--ink);
	}

	.row:hover .tag,
	.row:focus-visible .tag {
		color: var(--ink);
		border-color: rgba(8, 28, 58, 0.5);
	}

	.row:hover .arrow,
	.row:focus-visible .arrow {
		transform: translate(4px, -4px);
	}

	/* ---------- colophon ---------- */
	.colophon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: clamp(2.5rem, 5vw, 4rem);
		padding: 1.1rem clamp(1.25rem, 4vw, 3rem);
		border-top: 1px solid var(--hairline);
		font-family: 'Space Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		color: var(--muted);
	}

	/* ---------- responsive ---------- */
	@media (max-width: 900px) {
		.hero {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.curve-figure {
			max-width: 26rem;
		}

		.index-head {
			display: none;
		}

		.row {
			grid-template-columns: minmax(0, 1fr) auto 2rem;
			grid-template-areas:
				'fig fig fig'
				'title tag arrow';
			row-gap: 0.5rem;
		}

		.fig {
			grid-area: fig;
		}

		.study-title {
			grid-area: title;
		}

		.tag {
			grid-area: tag;
		}

		.arrow {
			grid-area: arrow;
		}

		.col-note,
		.col-curve {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.row::before,
		.study-title,
		.arrow,
		.spark path {
			transition: none;
		}

		.spark path {
			stroke-dashoffset: 0;
		}
	}
</style>
