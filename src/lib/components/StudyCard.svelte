<script lang="ts">
	// the cards keep their own type, independent of the page around them
	import '@fontsource-variable/space-grotesk';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';
	import { CURVES, TINTS, barcode, type Study } from '$lib/utils/studies';

	let {
		study,
		index,
		mode,
		flipped = false
	}: { study: Study; index: number; mode: 'shot' | 'drawn'; flipped?: boolean } = $props();

	const fig = $derived(String(index + 1).padStart(2, '0'));
	const tint = $derived(TINTS[index % TINTS.length]);
	const curve = $derived(CURVES[study.curve]);
	const tools = $derived(study.tag.split(' · '));
	const showShot = $derived(mode === 'shot' && !!study.shot);
</script>

<div class="body" style:--tint={tint} aria-hidden="true">
	<!-- front -->
	<div class="face front">
		<div class="art" class:is-shot={showShot}>
			{#if showShot}
				<img src={study.shot} alt="" loading="lazy" decoding="async" draggable="false" />
			{:else}
				<span class="art-fig">{fig}</span>
				<svg class="art-curve" viewBox="-6 -16 72 70" fill="none">
					<path d={curve.d} />
					<circle cx="0" cy="40" r="2.4" />
					<circle cx="60" cy="0" r="2.4" />
				</svg>
				<span class="art-ease">{curve.ease}</span>
				{#if mode === 'shot'}
					<span class="art-missing">NO SHOT YET</span>
				{/if}
			{/if}
		</div>
		<div class="label">
			<span class="kicker">{study.tag}</span>
			<span class="title">{study.title}</span>
			<span class="meta">
				<span class="code" style:background-image={barcode(study.slug)}></span>
				<span>No. {fig}</span>
			</span>
		</div>
	</div>

	<!-- back: the stat side, built only while the card is turning or turned -->
	{#if flipped}
		<div class="face back">
			<div class="back-inner">
				<header class="back-head">
					<span class="back-name">{study.title}</span>
					<span class="back-no"><small>No.</small>{fig}</span>
				</header>

				<div class="window">
					<svg viewBox="-6 -16 72 70" fill="none">
						<path d={curve.d} />
					</svg>
					<span class="window-caption">FIG. {fig} — {curve.ease}</span>
				</div>

				<ul class="types">
					{#each tools as tool (tool)}
						<li>{tool}</li>
					{/each}
				</ul>

				<dl class="stats">
					<div>
						<dt>Ease</dt>
						<dd>{curve.ease}</dd>
					</div>
					<div>
						<dt>Route</dt>
						<dd>/{study.slug}</dd>
					</div>
					<div>
						<dt>Stack</dt>
						<dd>Svelte 5</dd>
					</div>
				</dl>

				<p class="flavor">“{study.note}.”</p>

				<span class="view">VIEW STUDY <span class="view-arrow">↗</span></span>
			</div>
		</div>
	{/if}

	<!-- glass thickness: the sides are what the yaw shows; top and bottom barely read -->
	<span class="edge edge-l"></span>
	<span class="edge edge-r"></span>
</div>

<style>
	.body {
		--t: 6px;
		--r: 0.85em;
		--ink: #0b1220;

		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
	}

	/*
	  Depth of field, light and fade arrive as inline filter and opacity from the deck, written
	  per face and edge rather than as inherited variables. Edges are never blurred: they're a few
	  pixels wide, so a blur costs a layer and shows nothing.
	*/

	.face {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: var(--r);
		backface-visibility: hidden;
		background: #f6f8fb;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.75),
			inset 0 0 0 0.35em rgba(255, 255, 255, 0.18);
	}

	/* glass sheen + dimming layer when another card has focus */
	.face::before,
	.face::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
	}

	.face::before {
		z-index: 2;
		background:
			linear-gradient(125deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 32%),
			linear-gradient(305deg, rgba(160, 230, 255, 0.28) 0%, rgba(255, 255, 255, 0) 30%);
		mix-blend-mode: screen;
	}

	.face::after {
		z-index: 3;
		background: #02040a;
		opacity: 0;
		transition: opacity 150ms ease-out;
	}

	.front {
		display: grid;
		grid-template-rows: 1fr auto;
		transform: translateZ(calc(var(--t) / 2));
	}

	.back {
		transform: rotateY(180deg) translateZ(calc(var(--t) / 2));
		background: var(--tint);
		padding: 0.45em;
	}

	/* ---------- front ---------- */
	.art {
		position: relative;
		overflow: hidden;
		margin: 0.45em 0.45em 0;
		border-radius: calc(var(--r) - 0.45em) calc(var(--r) - 0.45em) 0.25em 0.25em;
		background-color: var(--tint);
		background-image:
			linear-gradient(rgba(11, 18, 32, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(11, 18, 32, 0.08) 1px, transparent 1px);
		background-size: 1.25em 1.25em;
		color: var(--ink);
	}

	.art.is-shot {
		background: #0b1220;
	}

	.art img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 30%;
		user-select: none;
		outline: 1px solid oklch(0 0 0 / 0.1);
		outline-offset: -1px;
		border-radius: inherit;
	}

	.art-fig {
		position: absolute;
		top: 0.1em;
		right: 0.25em;
		font-size: 4.4em;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.06em;
		color: transparent;
		-webkit-text-stroke: 1px rgba(11, 18, 32, 0.35);
	}

	.art-curve {
		position: absolute;
		left: 12%;
		bottom: 14%;
		width: 76%;
		overflow: visible;
	}

	.art-curve path {
		stroke: var(--ink);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.art-curve circle {
		fill: #ff5c1f;
	}

	.art-ease,
	.art-missing {
		position: absolute;
		left: 0.6em;
		font-family: 'Space Mono', monospace;
		font-size: 0.6em;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.art-ease {
		top: 0.8em;
		padding: 0.2em 0.55em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.55);
	}

	.art-missing {
		bottom: 0.7em;
		opacity: 0.6;
	}

	.label {
		display: grid;
		gap: 0.25em;
		padding: 0.55em 0.75em 0.65em;
		color: var(--ink);
	}

	.kicker,
	.meta {
		font-family: 'Space Mono', monospace;
		font-size: 0.5em;
		letter-spacing: 0.16em;
		color: #5a6680;
	}

	.title {
		font-size: 1.05em;
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.3em;
	}

	.code {
		width: 9em;
		height: 1.6em;
		color: var(--ink);
		opacity: 0.8;
	}

	/* ---------- back ---------- */
	.back-inner {
		display: flex;
		flex-direction: column;
		gap: 0.45em;
		height: 100%;
		padding: 0.6em 0.65em;
		border-radius: calc(var(--r) - 0.45em);
		background: #f7f4ec;
		color: var(--ink);
	}

	.back-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4em;
	}

	.back-name {
		font-size: 0.8em;
		font-weight: 700;
		line-height: 1;
		text-transform: uppercase;
	}

	.back-no {
		font-size: 0.95em;
		font-weight: 700;
		color: #d9431a;
		white-space: nowrap;
	}

	.back-no small {
		font-size: 0.5em;
		margin-right: 0.15em;
	}

	.window {
		position: relative;
		aspect-ratio: 16 / 9;
		border: 0.2em solid var(--tint);
		border-radius: 0.3em;
		background-color: #0b1a33;
		background-image:
			linear-gradient(rgba(232, 239, 250, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(232, 239, 250, 0.08) 1px, transparent 1px);
		background-size: 0.9em 0.9em;
	}

	.window svg {
		position: absolute;
		inset: 12% 22% 20%;
		overflow: visible;
	}

	.window path {
		stroke: #ff5c1f;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.window-caption {
		position: absolute;
		left: 0.5em;
		bottom: 0.35em;
		font-family: 'Space Mono', monospace;
		font-size: 0.42em;
		letter-spacing: 0.12em;
		color: rgba(232, 239, 250, 0.7);
		text-transform: uppercase;
	}

	.types {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.types li {
		padding: 0.2em 0.55em;
		border-radius: 999px;
		background: var(--ink);
		color: #f7f4ec;
		font-family: 'Space Mono', monospace;
		font-size: 0.45em;
		letter-spacing: 0.14em;
	}

	.stats {
		display: grid;
		margin: 0;
	}

	.stats div {
		display: flex;
		justify-content: space-between;
		gap: 0.5em;
		padding: 0.28em 0;
		border-bottom: 1px solid rgba(11, 18, 32, 0.14);
		font-size: 0.55em;
	}

	.stats dt {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.stats dd {
		margin: 0;
		font-family: 'Space Mono', monospace;
		color: #3c4760;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.flavor {
		margin: 0;
		font-size: 0.55em;
		font-style: italic;
		line-height: 1.35;
		color: #3c4760;
	}

	.view {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5em 0.7em;
		border-radius: 0.35em;
		background: #ff5c1f;
		color: #0b1220;
		font-family: 'Space Mono', monospace;
		font-size: 0.55em;
		font-weight: 700;
		letter-spacing: 0.16em;
	}

	/* ---------- edges: the slab's thickness ---------- */
	.edge {
		position: absolute;
		background: linear-gradient(180deg, #9ff6ff 0%, #f7b4ff 35%, #fff2a8 65%, #9ff6ff 100%);
	}

	.edge-l,
	.edge-r {
		top: var(--r);
		width: var(--t);
		height: calc(100% - 2 * var(--r));
	}

	.edge-l {
		left: calc(var(--t) / -2);
		transform: rotateY(90deg);
	}

	.edge-r {
		left: calc(100% - var(--t) / 2);
		transform: rotateY(90deg);
	}
</style>
