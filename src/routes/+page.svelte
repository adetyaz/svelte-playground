<script lang="ts">
	import '@fontsource-variable/bricolage-grotesque/standard.css';
	import '@fontsource-variable/martian-mono/standard.css';
	import StudyDeck from '$lib/components/StudyDeck.svelte';
	import type { CurveKey, Study } from '$lib/utils/studies';

	// Routes are discovered from the file system — add or remove a route folder
	// and the index updates itself. KNOWN only supplies curated metadata.
	const KNOWN: Record<string, { title?: string; note: string; tag: string; curve: CurveKey }> = {
		'bike-reveal': {
			note: 'a product reveal, frame by frame',
			tag: 'GSAP · SCROLL',
			curve: 'inOut'
		},
		'block-reveal': { note: 'blocks wipe, text appears', tag: 'GSAP · TEXT', curve: 'steps' },
		'text-reveal': { note: 'scroll-driven text reveal', tag: 'GSAP · SCROLL', curve: 'inOut' },
		'text-rev': { note: 'split text on scroll', tag: 'GSAP · TEXT', curve: 'inOut' },
		flip: { note: 'layout magic with gsap flip', tag: 'GSAP · FLIP', curve: 'back' },
		movie: { note: 'browse films, flip between views', tag: 'GSAP · FLIP', curve: 'back' },
		'smooth-slider': {
			note: 'a film-strip slider that opens up',
			tag: 'GSAP',
			curve: 'inOut'
		},
		'3d-gallery': {
			note: 'a scroll-triggered depth gallery',
			tag: 'GSAP · SCROLL',
			curve: 'out'
		},
		'flipping-cards': {
			note: 'cards that turn on scroll',
			tag: 'GSAP · SCROLL',
			curve: 'out'
		},
		'3d-book': { note: 'a book that opens in css 3d', tag: 'CSS 3D', curve: 'out' },
		'3d-sphere': { note: 'a sphere built from flat divs', tag: 'CSS 3D', curve: 'elastic' },
		'animated-circle': { note: 'one circle, many states', tag: 'SVELTE', curve: 'elastic' },
		transitions: { note: 'enter & leave, with motion', tag: 'MOTION', curve: 'inOut' },
		actions: { note: 'svelte actions, observed', tag: 'SVELTE', curve: 'linear' },
		'state-functions': { note: 'svelte 5 runes at work', tag: 'SVELTE', curve: 'linear' },
		'black-store': { note: 'a storefront in black', tag: 'UI', curve: 'out' },
		'cross-chain': { note: 'send usdc across chains', tag: 'UI · WEB3', curve: 'inOut' },
		'custodial-wallet': { note: 'a wallet flow, custodied', tag: 'UI · WEB3', curve: 'inOut' },
		pokemon: { title: 'Pokémon', note: "gotta fetch 'em all", tag: 'DATA', curve: 'out' },
		'more-details': { note: 'progressive disclosure', tag: 'UI', curve: 'steps' },
		splitter: { note: 'a tip calculator', tag: 'UI', curve: 'linear' }
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

	// Screenshots from `npm run capture:studies`; a study without one falls back to drawn art.
	const shots = import.meta.glob<string>('/src/lib/assets/studies/*.jpg', {
		eager: true,
		query: '?url',
		import: 'default'
	});
	const shotFor = (slug: string) => shots[`/src/lib/assets/studies/${slug}.jpg`];

	const studies: Study[] = ordered.map((slug) => ({
		slug,
		title: KNOWN[slug]?.title ?? titleize(slug),
		note: KNOWN[slug]?.note ?? 'fresh off the drafting table',
		tag: KNOWN[slug]?.tag ?? 'NEW',
		curve: KNOWN[slug]?.curve ?? 'out',
		shot: shotFor(slug)
	}));
</script>

<svelte:head>
	<title>Adetayo — Playground</title>
	<meta
		name="description"
		content="Small studies in how interfaces move: animation and interaction experiments built with Svelte, GSAP and Motion."
	/>
</svelte:head>

<div class="playground">
	<StudyDeck {studies}>
		{#snippet brand()}
			<span class="wordmark">Adetayo <span class="wordmark-tag">playground</span></span>
		{/snippet}

		{#snippet intro()}
			<h1>Small studies in how interfaces move.</h1>
			<p>
				{studies.length} experiments in animation and interaction, built with Svelte, GSAP and Motion
				while learning how things should feel. Open any card to try one.
			</p>
		{/snippet}
	</StudyDeck>

	<footer class="colophon">
		<span>Built by Adetayo with Svelte 5, GSAP and Motion.</span>
		<a href="https://github.com/adetyaz" rel="noreferrer">GitHub ↗</a>
	</footer>
</div>

<style>
	.playground {
		--void: #07070b;
		--paper: #eeebf5;
		--mute: #8e89a0;
		--lilac: #c8b6ff;
		--gutter: clamp(1.25rem, 4vw, 3rem);

		background: var(--void);
		color: var(--paper);
		font-family: 'Bricolage Grotesque Variable', sans-serif;
		overflow-x: clip;
	}

	.wordmark {
		display: inline-flex;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 1.05rem;
		font-weight: 620;
		font-stretch: 85%;
		letter-spacing: -0.01em;
	}

	.wordmark-tag {
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.66rem;
		font-weight: 400;
		font-stretch: 87.5%;
		color: var(--mute);
	}

	/* set narrow and tight, so the sentence reads as a caption to the cards rather than a banner */
	h1 {
		max-width: 12ch;
		margin: 0;
		font-size: clamp(2rem, 1.1rem + 3.2vw, 3.9rem);
		font-weight: 560;
		font-stretch: 75%;
		line-height: 0.94;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	p {
		max-width: 32ch;
		margin: 1.25rem 0 0;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--mute);
		text-wrap: pretty;
	}

	.colophon {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1rem;
		padding: 1.5rem var(--gutter);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08);
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.66rem;
		font-stretch: 87.5%;
		color: var(--mute);
	}

	.colophon a {
		color: var(--paper);
		text-decoration: none;
		transition: color 150ms ease-out;
	}

	.colophon a:hover {
		color: var(--lilac);
	}

	.colophon a:focus-visible {
		outline: 2px solid var(--lilac);
		outline-offset: 3px;
		border-radius: 2px;
	}

	@media (max-width: 720px) {
		h1 {
			max-width: 14ch;
		}

		p {
			font-size: 0.9rem;
		}
	}
</style>
