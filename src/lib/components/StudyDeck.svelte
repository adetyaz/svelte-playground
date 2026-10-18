<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import StudyCard from './StudyCard.svelte';
	import type { Study } from '$lib/utils/studies';

	gsap.registerPlugin(ScrollTrigger);

	let {
		studies,
		brand,
		intro
	}: {
		studies: Study[];
		/** wordmark, top-left */
		brand?: Snippet;
		/** what this place is, in the empty corner above the ribbon */
		intro?: Snippet;
	} = $props();

	// Slugs come from the file system at build time, so they can't be typed as literal routes.
	const routeOf = (slug: string) => resolve(`/${slug}` as '/');

	type ArtMode = 'shot' | 'drawn';
	const MODE_KEY = 'playground:deck-art';

	// Ribbon geometry, in units of card width (w).
	const VISIBLE_HALF = 22; // slots drawn either side of centre
	const RADIUS = 4.2; // arc radius
	const SPACING = 0.24; // arc length between neighbouring cards
	const FACE = -50; // how far the centre card is turned away from the camera (deg)
	const FOLLOW = 0.5; // how much cards turn with the arc; under 1 keeps every front in view
	const TILT_Z = -24; // ribbon rises to the right
	const TILT_X = 14; // seen slightly from above
	const TWIST = 0.7; // per-slot roll, so the ribbon reads as a ribbon (deg)
	// Slots either side of centre that stay sharp. Blur is the costliest thing the GPU does here,
	// so only the outer cards get it, where they're small on screen; brightness carries the depth
	// falloff across the middle.
	const FOCUS_BAND = 9;
	const MAX_BLUR = 4;
	const EDGE_BAND = 8; // past this the cards are too blurred and small to show their thickness
	const DWELL = 120; // ms the pointer must rest on a card before it turns; a passing sweep turns nothing

	const DRIFT = 0.22; // idle travel, slots per second
	const SCROLL_PX_PER_SLOT = 70;
	const DRAG_PX_PER_SLOT = 64;
	const INTRO_SLOTS = 22;
	// Steering: the pointer's distance from the middle, along the ribbon, sets the travel speed.
	const STEER_MAX = 7; // slots per second at the ends of the rail
	const STEER_DEAD = 0.12; // the still zone in the middle, as a share of half the rail

	// Repeat studies only until the ribbon is full; past that, every card is unique.
	const slots = $derived.by(() => {
		const n = studies.length;
		if (!n) return [];
		// Just enough to fill the arc. The wrap, where the sequence restarts, sits out of sight.
		const count = Math.max(n, VISIBLE_HALF * 2 + 4);
		return Array.from({ length: count }, (_, i) => ({
			key: i,
			study: studies[i % n],
			index: i % n,
			copy: Math.floor(i / n)
		}));
	});

	let mode = $state<ArtMode>('shot');
	let centre = $state(0);
	let ready = $state(false);
	let focused = $state(-1);
	let steering = $state(false);
	// Cards with their stat side built: only the ones turning or turned. Every other back is
	// hidden, so its ~25 elements would only cost style work.
	const flipped = new SvelteSet<number>();
	// the caption names the turned card while there is one, otherwise whatever is passing the middle
	const captioned = $derived(studies[focused === -1 ? centre : (slots[focused]?.index ?? centre)]);

	let track: HTMLElement;
	let viewport: HTMLElement;
	let ring: HTMLElement;
	const cardEls: HTMLAnchorElement[] = [];

	// Set from onMount; the template handlers call through these.
	let focusCard: (i: number) => void = () => {};
	let blurCard: (i: number) => void = () => {};
	let leave: (i: number, slug: string) => void = () => {};
	let centreOn: (i: number) => void = () => {};
	let setSteering: (on: boolean) => void = () => {};
	let dragged = false;

	let stage: HTMLElement;
	let cursor: HTMLElement;

	const setMode = (next: ArtMode) => {
		mode = next;
		try {
			localStorage.setItem(MODE_KEY, next);
		} catch {
			/* storage unavailable: the choice just won't persist */
		}
	};

	const onCardClick = (event: MouseEvent, i: number, slug: string) => {
		event.preventDefault();
		if (dragged) return;
		// Touch has no hover: the first tap flips the card, the second opens it.
		const touch = (event as PointerEvent).pointerType === 'touch';
		if (touch && focused !== i) {
			focusCard(i);
			return;
		}
		leave(i, slug);
	};

	onMount(() => {
		try {
			const saved = localStorage.getItem(MODE_KEY);
			if (saved === 'shot' || saved === 'drawn') mode = saved;
		} catch {
			/* ignore */
		}

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const n = cardEls.length;
		const focusAmt = cardEls.map(() => ({ v: 0 }));
		const shown = cardEls.map(() => true);
		const near = cardEls.map(() => true);
		// Depth of field, light and fade are written straight onto the two faces and two edges of
		// each card. Filter and opacity aren't inherited, so the browser restyles just those four
		// elements; set as CSS variables on the card they'd restyle all ~45 elements inside it.
		// Only the front: the back is hidden until a card turns, and the turning card drops its filter.
		const faces = cardEls.map((el) => [...el.querySelectorAll<HTMLElement>('.front')]);
		const edges = cardEls.map((el) => [...el.querySelectorAll<HTMLElement>('.edge')]);
		const lastFilter = cardEls.map(() => '');
		const lastFade = cardEls.map(() => '');
		const lastEdge = cardEls.map(() => '');
		const setAll = (els: HTMLElement[], prop: 'filter' | 'opacity', value: string) => {
			for (const e of els) e.style[prop] = value;
		};
		const drift = { v: 1 }; // eased to 0 while a card has focus, so the ribbon glides to a stop
		let lastRing = '';
		let lastAlpha = '';
		let onScreen = true;
		const anim = {
			intro: reduced ? 0 : INTRO_SLOTS,
			swing: reduced ? 0 : -35,
			alpha: reduced ? 1 : 0
		};

		let w = cardEls[0]?.offsetWidth ?? 200;
		let target = 0;
		let current = 0;
		let lastIntro = anim.intro;
		let lockUntil = 0;
		let leaving = false;

		const wrap = (t: number) => ((((t + n / 2) % n) + n) % n) - n / 2;
		const smoothstep = (a: number, b: number, x: number) => {
			const k = Math.min(Math.max((x - a) / (b - a), 0), 1);
			return k * k * (3 - 2 * k);
		};

		const place = (eff: number, vel: number) => {
			const R = RADIUS * w;
			const step = SPACING / RADIUS;
			const motionBlur = Math.min(Math.round(Math.abs(vel) * 18), 8);

			const ringTransform = `rotateZ(${TILT_Z}deg) rotateX(${TILT_X}deg) rotateY(${anim.swing.toFixed(2)}deg)`;
			if (ringTransform !== lastRing) ring.style.transform = lastRing = ringTransform;
			const alpha = anim.alpha.toFixed(2);
			if (alpha !== lastAlpha) viewport.style.opacity = lastAlpha = alpha;

			for (let i = 0; i < n; i++) {
				const el = cardEls[i];
				const t = wrap(i - eff);
				const a = Math.abs(t);
				const f = focusAmt[i].v;

				if (a > VISIBLE_HALF && f === 0) {
					if (shown[i]) {
						setAll(faces[i], 'opacity', (lastFade[i] = '0'));
						el.classList.add('is-off');
						shown[i] = false;
					}
					continue;
				}
				if (!shown[i]) {
					el.classList.remove('is-off');
					shown[i] = true;
				}

				const phi = t * step;
				// The focused card lifts toward the viewer in place, so it stays under the cursor.
				const x = R * Math.sin(phi);
				const z = R * (Math.cos(phi) - 1) * (1 - f) + f * w * 1.1;
				const yaw = ((phi * 180 * FOLLOW) / Math.PI + FACE) * (1 - f);
				const roll = t * TWIST * (1 - f);

				// Undo the ring's tilt as the card comes forward, so it ends upright, then flip it.
				el.style.transform =
					`translate3d(${x}px, 0px, ${z}px) rotateY(${yaw}deg) rotateZ(${roll}deg) ` +
					`rotateX(${-TILT_X * f}deg) rotateZ(${-TILT_Z * f}deg) ` +
					`rotateY(${180 * f}deg) scale(${1 + 0.32 * f})`;

				const blur = (Math.min(Math.max(a - FOCUS_BAND, 0) * 0.4, MAX_BLUR) + motionBlur) * (1 - f);
				const light = 0.5 + 0.55 * Math.cos(phi * 1.4) + 0.2 * f;
				const fade = 1 - smoothstep(VISIBLE_HALF - 4, VISIBLE_HALF, a) * (1 - f);

				// thickness fades out with distance rather than switching off at a line
				const edge = fade * Math.max(1 - smoothstep(EDGE_BAND - 3, EDGE_BAND, a), f);

				// A filter rasterises the face before it's scaled up, so the focused card drops it and
				// its text stays crisp. Values are rounded finer than the eye can step through.
				const filterV =
					f > 0.05 ? 'none' : `blur(${blur.toFixed(1)}px) brightness(${light.toFixed(2)})`;
				const fadeV = fade.toFixed(2);
				const edgeV = edge.toFixed(2);
				if (filterV !== lastFilter[i]) setAll(faces[i], 'filter', (lastFilter[i] = filterV));
				if (fadeV !== lastFade[i]) setAll(faces[i], 'opacity', (lastFade[i] = fadeV));
				if (edgeV !== lastEdge[i]) setAll(edges[i], 'opacity', (lastEdge[i] = edgeV));

				const isNear = edge > 0;
				if (isNear !== near[i]) {
					el.classList.toggle('is-far', !isNear);
					near[i] = isNear;
				}
			}
		};

		const tick = (_time: number, deltaMs: number) => {
			if (!onScreen) return;
			// Hit-test first, against the layout the browser has already settled. After the writes
			// below it would force a second, synchronous style and layout pass inside this frame.
			// While steering at speed the cards stream past the pointer, so nothing turns over.
			const cruising = steering && Math.abs(steerV) > 0.35;
			if (cruising && focused !== -1) blurCard(focused);
			else if (pointerIn && !dragging && !leaving && !cruising) resolveHover();

			const dt = Math.min(deltaMs, 50) / 1000;
			if (!reduced && !dragging && !leaving && !steering) target += DRIFT * drift.v * dt;

			if (steering && !leaving) {
				let want = 0;
				if (pointerIn) {
					const half = Math.min(window.innerWidth, window.innerHeight * 1.6) / 2;
					const d =
						((px - window.innerWidth / 2) * dir.x + (py - window.innerHeight / 2) * dir.y) / half;
					const mag = Math.max(0, Math.min(Math.abs(d), 1) - STEER_DEAD) / (1 - STEER_DEAD);
					want = Math.sign(d) * mag ** 1.6 * STEER_MAX * (reduced ? 0.5 : 1) * steerGain.v;
				}
				steerV += (want - steerV) * (1 - Math.pow(0.9, dt * 60));
				target += steerV * dt;

				// the cursor trails the pointer slightly, and leans the way the ribbon is travelling
				const k = reduced ? 1 : 1 - Math.pow(0.75, dt * 60);
				cx += (px - cx) * k;
				cy += (py - cy) * k;
				const lean = steerV / STEER_MAX;
				cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${TILT_Z}deg)`;
				cursor.style.setProperty('--lean', lean.toFixed(3));
				cursor.style.setProperty('--pace', Math.abs(lean).toFixed(3));
			}
			current += (target - current) * (1 - Math.pow(0.88, dt * 60));

			const eff = current + anim.intro;
			// Motion blur belongs to the swing in and out. Dragging gets none: the hand already
			// carries the motion, and a blur that changes every frame restyles every card.
			const vel = (anim.intro - lastIntro) / Math.max(dt * 60, 0.001);
			lastIntro = anim.intro;
			place(eff, vel);

			const c = Math.round(eff);
			const idx = slots[((c % n) + n) % n].index;
			if (idx !== centre) centre = idx;
		};

		// ---------- focus ----------
		focusCard = (i: number) => {
			if (focused === i || leaving) return;
			if (focused !== -1) blurCard(focused);
			focused = i;
			lockUntil = performance.now() + 250; // the flip passes edge-on; don't read that as leaving
			viewport.classList.add('has-focus');
			gsap.to(drift, { v: 0, duration: 0.6, ease: 'power2.out', overwrite: true });
			cardEls[i].classList.add('is-focused');
			flipped.add(i);
			gsap.to(focusAmt[i], {
				v: 1,
				duration: reduced ? 0 : 0.9,
				ease: 'expo.out',
				overwrite: true
			});
		};

		blurCard = (i: number) => {
			if (i === -1 || leaving) return;
			cardEls[i].classList.remove('is-focused');
			gsap.to(focusAmt[i], {
				v: 0,
				duration: reduced ? 0 : 0.6,
				ease: 'power3.out',
				overwrite: true,
				onComplete: () => {
					flipped.delete(i);
				}
			});
			if (focused === i) {
				focused = -1;
				viewport.classList.remove('has-focus');
				gsap.to(drift, { v: 1, duration: 0.9, ease: 'power1.inOut', overwrite: true });
			}
		};

		centreOn = (i: number) => {
			// nearest copy of slot i to the current position
			target = current + wrap(i - current);
		};

		// Hover is resolved every frame from the last pointer position, not from enter/leave:
		// cards move under a still cursor, and the focused card flips under it. A change only
		// takes effect once the pointer has stayed on the new target for DWELL ms.
		let pointerIn = false;
		let px = 0;
		let py = 0;
		let candidate = -1;
		let candidateSince = 0;
		const resolveHover = () => {
			const hit = document.elementFromPoint(px, py)?.closest<HTMLAnchorElement>('.card');
			const i = hit ? cardEls.indexOf(hit) : -1;
			if (i === focused) {
				candidate = -1;
				return;
			}
			const now = performance.now();
			if (i !== candidate) {
				candidate = i;
				candidateSince = now;
				return;
			}
			if (now - candidateSince < DWELL || now < lockUntil) return;
			candidate = -1;
			if (i === -1) blurCard(focused);
			else focusCard(i);
		};

		// ---------- drag ----------
		let dragging = false;
		let pointerId = -1;
		let startX = 0;
		let startY = 0;
		let lastX = 0;
		let lastY = 0;
		let dragVel = 0;
		const dir = { x: Math.cos((TILT_Z * Math.PI) / 180), y: Math.sin((TILT_Z * Math.PI) / 180) };

		// ---------- steering ----------
		let steerV = 0;
		let cx = window.innerWidth / 2;
		let cy = window.innerHeight / 2;
		// eases in on switch-on, so a pointer that's still off to one side doesn't launch the ribbon
		const steerGain = { v: 0 };

		setSteering = (on: boolean) => {
			steering = on;
			stage.classList.toggle('is-steering', on);
			gsap.to(steerGain, {
				v: on ? 1 : 0,
				duration: on ? 0.8 : 0.2,
				ease: 'power2.inOut',
				overwrite: true
			});
			if (on) {
				cx = px || window.innerWidth / 2;
				cy = py || window.innerHeight / 2;
				if (focused !== -1) blurCard(focused);
			} else {
				steerV = 0;
			}
		};

		const onDown = (e: PointerEvent) => {
			if (e.button !== 0 || leaving) return;
			// steering on touch: hold a finger toward either end to travel, lift to stop
			if (steering) {
				if (e.pointerType === 'touch') {
					pointerIn = true;
					px = e.clientX;
					py = e.clientY;
				}
				return;
			}
			pointerId = e.pointerId;
			startX = lastX = e.clientX;
			startY = lastY = e.clientY;
			dragged = false;
			dragVel = 0;
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== 'touch' || (steering && pointerIn)) {
				pointerIn = true;
				px = e.clientX;
				py = e.clientY;
			}
			if (e.pointerId !== pointerId) return;

			if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 6) {
				dragging = dragged = true;
				viewport.setPointerCapture(e.pointerId);
				viewport.classList.add('is-dragging');
				if (focused !== -1) blurCard(focused);
			}
			if (!dragging) return;

			const along = (e.clientX - lastX) * dir.x + (e.clientY - lastY) * dir.y;
			const slotsMoved = along / DRAG_PX_PER_SLOT;
			target -= slotsMoved;
			dragVel = dragVel * 0.6 + slotsMoved * 0.4;
			lastX = e.clientX;
			lastY = e.clientY;
		};

		const onUp = (e: PointerEvent) => {
			if (steering && e.pointerType === 'touch') pointerIn = false;
			if (e.pointerId !== pointerId) return;
			pointerId = -1;
			if (dragging) {
				target -= dragVel * 14; // fling
				dragging = false;
				viewport.classList.remove('is-dragging');
				if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
			}
			// the click that follows a drag is swallowed in onCardClick
			setTimeout(() => (dragged = false), 0);
		};

		const onLeaveViewport = () => {
			pointerIn = false;
			candidate = -1;
			if (!dragging && focused !== -1) blurCard(focused);
		};

		// ---------- scroll ----------
		let lastScroll = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			const r = track.getBoundingClientRect();
			if (r.bottom > 0 && r.top < window.innerHeight) {
				target += (y - lastScroll) / SCROLL_PX_PER_SLOT;
			}
			lastScroll = y;
		};

		const onResize = () => {
			w = cardEls[0]?.offsetWidth ?? w;
		};

		// Nothing to draw while the deck is off screen; the hero above it shouldn't pay for it.
		const visibility = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
		});
		visibility.observe(viewport);

		// ---------- enter & leave ----------
		const intro = ScrollTrigger.create({
			trigger: track,
			start: 'top 80%',
			once: true,
			onEnter: () => {
				if (reduced) return;
				gsap
					.timeline()
					.to(anim, { alpha: 1, duration: 0.6, ease: 'power1.out' }, 0)
					.to(anim, { intro: 0, duration: 2.4, ease: 'expo.out' }, 0)
					.to(anim, { swing: 0, duration: 2.6, ease: 'expo.out' }, 0)
					.fromTo(
						track.querySelectorAll('.deck-copy'),
						// opacity, not autoAlpha: the words stay readable to assistive tech while they fade in
						{ opacity: 0, y: 12 },
						{ opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' },
						0.25
					);
			}
		});

		leave = (i: number, slug: string) => {
			if (leaving) return;
			if (reduced) {
				goto(resolve(`/${slug}` as '/'));
				return;
			}
			leaving = true;
			viewport.classList.remove('has-focus');
			gsap.killTweensOf(anim);
			// the reverse of the entrance: the ribbon runs back the way it came
			gsap
				.timeline({ onComplete: () => void goto(resolve(`/${slug}` as '/')) })
				.to(focusAmt[i], { v: 0, duration: 0.5, ease: 'power2.in' }, 0)
				.to(anim, { intro: INTRO_SLOTS, duration: 1.1, ease: 'expo.in' }, 0)
				.to(anim, { swing: -35, duration: 1.1, ease: 'expo.in' }, 0)
				.to(anim, { alpha: 0, duration: 0.35, ease: 'power1.in' }, 0.75);
		};

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && steering) setSteering(false);
		};

		viewport.addEventListener('pointerdown', onDown);
		window.addEventListener('keydown', onKey);
		viewport.addEventListener('pointermove', onMove);
		viewport.addEventListener('pointerup', onUp);
		viewport.addEventListener('pointercancel', onUp);
		viewport.addEventListener('pointerleave', onLeaveViewport);
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		gsap.ticker.add(tick);
		ready = true;

		return () => {
			gsap.ticker.remove(tick);
			visibility.disconnect();
			gsap.killTweensOf(anim);
			focusAmt.forEach((f) => gsap.killTweensOf(f));
			intro.kill();
			gsap.killTweensOf(drift);
			gsap.killTweensOf(steerGain);
			window.removeEventListener('keydown', onKey);
			viewport.removeEventListener('pointerdown', onDown);
			viewport.removeEventListener('pointermove', onMove);
			viewport.removeEventListener('pointerup', onUp);
			viewport.removeEventListener('pointercancel', onUp);
			viewport.removeEventListener('pointerleave', onLeaveViewport);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<section class="deck-track" bind:this={track} aria-label="Studies">
	<div class="deck-stage" bind:this={stage}>
		<div class="viewport" class:ready bind:this={viewport}>
			<div class="ring" bind:this={ring}>
				{#each slots as slot, i (slot.key)}
					{@const href = routeOf(slot.study.slug)}
					<a
						class="card"
						{href}
						bind:this={cardEls[i]}
						tabindex={slot.copy === 0 ? 0 : -1}
						aria-hidden={slot.copy === 0 ? undefined : 'true'}
						aria-label="{slot.study.title} — {slot.study.note}"
						draggable="false"
						onclick={(e) => onCardClick(e, i, slot.study.slug)}
						onfocus={(e) => {
							if (!e.currentTarget.matches(':focus-visible')) return;
							centreOn(i);
							focusCard(i);
						}}
						onblur={() => blurCard(i)}
					>
						<StudyCard study={slot.study} index={slot.index} {mode} flipped={flipped.has(i)} />
					</a>
				{/each}
			</div>
		</div>

		<!-- the ribbon runs bottom-left to top-right; the words sit in the two corners it leaves -->
		<header class="deck-head">
			<div class="deck-copy">{@render brand?.()}</div>
			<div class="deck-tools deck-copy">
				<button
					type="button"
					class="steer-toggle"
					aria-pressed={steering}
					onclick={() => setSteering(!steering)}
				>
					<svg viewBox="0 0 24 12" aria-hidden="true">
						<path class="steer-chev steer-chev-l" d="M7 2 3 6l4 4" />
						<circle cx="12" cy="6" r="1.6" />
						<path class="steer-chev steer-chev-r" d="m17 2 4 4-4 4" />
					</svg>
					{steering ? 'Steering' : 'Steer'}
				</button>
				<div class="art-switch" role="group" aria-label="Card art">
					<button type="button" aria-pressed={mode === 'shot'} onclick={() => setMode('shot')}>
						Screenshots
					</button>
					<button type="button" aria-pressed={mode === 'drawn'} onclick={() => setMode('drawn')}>
						Drawings
					</button>
				</div>
			</div>
		</header>

		<!-- steering: a rail along the ribbon, still in the middle, faster toward either end -->
		<div class="steer-rail" aria-hidden="true">
			<span class="steer-stop"></span>
		</div>
		<div class="steer-cursor" bind:this={cursor} aria-hidden="true">
			<span class="steer-ring"></span>
			<span class="steer-arrow steer-arrow-l"></span>
			<span class="steer-arrow steer-arrow-r"></span>
		</div>

		{#if intro}
			<div class="deck-intro deck-copy">{@render intro()}</div>
		{/if}

		<p class="deck-hint deck-copy" aria-live="polite">
			{#if steering}
				Point toward either end to travel, back to the middle to stop. Esc turns steering off.
			{:else}
				Scroll or drag to browse. Rest on a card to turn it over.
			{/if}
		</p>

		<div class="deck-caption deck-copy" aria-hidden="true">
			<span class="caption-tag">{captioned?.tag.toLowerCase()}</span>
			<span class="caption-title">{captioned?.title}</span>
			<span class="caption-note">{captioned?.note}</span>
		</div>
	</div>
</section>

<style>
	.deck-track {
		position: relative;
		height: 320vh;
	}

	.deck-stage {
		--void: #07070b;
		--paper: #eeebf5;
		--mute: #8e89a0;
		--lilac: #c8b6ff;
		--gutter: clamp(1.25rem, 4vw, 3rem);

		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		overflow: hidden;
		background:
			radial-gradient(55% 50% at 55% 50%, rgb(200 182 255 / 0.09), transparent 70%), var(--void);
		color: var(--paper);
	}

	.deck-head,
	.deck-intro,
	.deck-hint,
	.deck-caption {
		position: absolute;
		z-index: 2;
	}

	.deck-head {
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem var(--gutter);
	}

	.deck-intro {
		top: clamp(5.5rem, 17svh, 11rem);
		left: var(--gutter);
		max-width: min(30rem, 42vw);
		/* plain text over the ribbon: let the pointer through to the cards */
		pointer-events: none;
	}

	.deck-hint,
	.caption-tag {
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.66rem;
		font-stretch: 87.5%;
		letter-spacing: 0.02em;
		color: var(--mute);
	}

	.deck-hint {
		bottom: 1.5rem;
		left: var(--gutter);
		margin: 0;
		pointer-events: none;
	}

	/* names whichever study is passing the middle of the ribbon */
	.deck-caption {
		right: var(--gutter);
		bottom: 1.5rem;
		display: grid;
		justify-items: end;
		gap: 0.3rem;
		max-width: 22rem;
		text-align: right;
		pointer-events: none;
	}

	.caption-title {
		font-family: 'Bricolage Grotesque Variable', sans-serif;
		font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem);
		font-weight: 560;
		font-stretch: 80%;
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.caption-note {
		font-family: 'Bricolage Grotesque Variable', sans-serif;
		font-size: 0.9rem;
		color: var(--mute);
	}

	.deck-tools {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.steer-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.5rem 0.85rem 0.5rem 0.7rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		box-shadow: 0 0 0 1px rgb(255 255 255 / 0.1);
		color: var(--mute);
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.66rem;
		font-stretch: 87.5%;
		cursor: pointer;
		transition-property: background-color, color, box-shadow, scale;
		transition-duration: 150ms;
		transition-timing-function: ease-out;
	}

	.steer-toggle svg {
		width: 1.4rem;
		overflow: visible;
		fill: currentColor;
	}

	.steer-chev {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: translate 200ms cubic-bezier(0.2, 0, 0, 1);
	}

	.steer-toggle:hover {
		color: var(--paper);
	}

	.steer-toggle:hover .steer-chev-l {
		translate: -1.5px 0;
	}

	.steer-toggle:hover .steer-chev-r {
		translate: 1.5px 0;
	}

	.steer-toggle:active {
		scale: 0.96;
	}

	/* on: lit from inside rather than filled, so it doesn't merge with the art toggle beside it */
	.steer-toggle[aria-pressed='true'] {
		background: rgb(200 182 255 / 0.14);
		box-shadow:
			inset 0 0 0 1px var(--lilac),
			0 0 22px rgb(200 182 255 / 0.3);
		color: var(--lilac);
	}

	.steer-toggle[aria-pressed='true'] .steer-chev-l {
		animation: steer-nudge-l 1.6s ease-in-out infinite;
	}

	.steer-toggle[aria-pressed='true'] .steer-chev-r {
		animation: steer-nudge-r 1.6s ease-in-out infinite;
	}

	@keyframes steer-nudge-l {
		50% {
			translate: -2px 0;
		}
	}

	@keyframes steer-nudge-r {
		50% {
			translate: 2px 0;
		}
	}

	.steer-toggle:focus-visible {
		outline: 2px solid var(--lilac);
		outline-offset: 2px;
	}

	/* ---------- steering rail and cursor ---------- */
	.steer-rail {
		position: absolute;
		z-index: 1;
		left: 50%;
		top: 50%;
		width: min(100vw, 160svh);
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgb(200 182 255 / 0.55) 12%,
			rgb(200 182 255 / 0.12) 44%,
			transparent 44% 56%,
			rgb(200 182 255 / 0.12) 56%,
			rgb(200 182 255 / 0.55) 88%,
			transparent
		);
		transform: translate(-50%, -50%) rotate(-24deg) scaleX(0.6);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 300ms ease-out,
			transform 600ms cubic-bezier(0.2, 0, 0, 1);
	}

	/* the still zone, marked by a short notch */
	.steer-stop {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1px;
		height: 9px;
		background: var(--lilac);
		transform: translate(-50%, -50%);
	}

	.deck-stage:global(.is-steering) .steer-rail {
		opacity: 1;
		transform: translate(-50%, -50%) rotate(-24deg) scaleX(1);
	}

	.steer-cursor {
		--lean: 0;
		--pace: 0;

		position: fixed;
		z-index: 3;
		left: 0;
		top: 0;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms ease-out;
	}

	.deck-stage:global(.is-steering) .viewport:hover ~ .steer-cursor {
		opacity: 1;
	}

	/* a ring that stretches into a capsule as the ribbon picks up speed */
	.steer-ring {
		position: absolute;
		left: -22px;
		top: -22px;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgb(7 7 11 / 0.6);
		box-shadow:
			inset 0 0 0 1.5px var(--lilac),
			0 0 calc(10px + var(--pace) * 24px) rgb(200 182 255 / 0.45);
		backdrop-filter: blur(4px);
		transform: translateX(calc(var(--lean) * 8px)) scaleX(calc(1 + var(--pace) * 0.7))
			scaleY(calc(1 - var(--pace) * 0.18));
	}

	.steer-arrow {
		position: absolute;
		left: -4px;
		top: -4px;
		width: 8px;
		height: 8px;
		border-top: 2px solid var(--lilac);
		border-right: 2px solid var(--lilac);
	}

	/* the chevron on the side of travel reaches out; the other one fades back */
	.steer-arrow-r {
		transform: translateX(calc(7px + max(var(--lean), 0) * 30px)) rotate(45deg);
		opacity: calc(0.45 + max(var(--lean), 0) * 0.55 - max(calc(var(--lean) * -1), 0) * 0.6);
	}

	.steer-arrow-l {
		transform: translateX(calc(-7px + min(var(--lean), 0) * 30px)) rotate(-135deg);
		opacity: calc(0.45 + max(calc(var(--lean) * -1), 0) * 0.55 - max(var(--lean), 0) * 0.6);
	}

	@media (pointer: fine) {
		.deck-stage:global(.is-steering) .viewport {
			cursor: none;
		}
	}

	@media (hover: none) {
		.deck-stage:global(.is-steering) .viewport:active ~ .steer-cursor {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.steer-toggle[aria-pressed='true'] .steer-chev {
			animation: none;
		}
	}

	.art-switch {
		display: inline-flex;
		padding: 3px;
		border-radius: 999px;
		box-shadow: 0 0 0 1px rgb(255 255 255 / 0.1);
	}

	.art-switch button {
		padding: 0.45rem 0.85rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--mute);
		font-family: 'Martian Mono Variable', monospace;
		font-size: 0.66rem;
		font-stretch: 87.5%;
		cursor: pointer;
		transition-property: background-color, color, scale;
		transition-duration: 150ms;
		transition-timing-function: ease-out;
	}

	.art-switch button:hover {
		color: var(--paper);
	}

	.art-switch button:active {
		scale: 0.96;
	}

	.art-switch button[aria-pressed='true'] {
		background: var(--lilac);
		color: var(--void);
	}

	.art-switch button:focus-visible {
		outline: 2px solid var(--lilac);
		outline-offset: 2px;
	}

	.viewport {
		--card-w: clamp(150px, 14vw, 220px);

		position: absolute;
		inset: 0;
		perspective: 1500px;
		touch-action: pan-y;
		cursor: grab;
		user-select: none;
		visibility: hidden;
	}

	.viewport.ready {
		visibility: visible;
	}

	.viewport:global(.is-dragging) {
		cursor: grabbing;
	}

	.ring {
		position: absolute;
		top: 50%;
		left: 50%;
		transform-style: preserve-3d;
	}

	.card {
		position: absolute;
		width: var(--card-w);
		aspect-ratio: 5 / 7;
		margin-left: calc(var(--card-w) / -2);
		margin-top: calc(var(--card-w) * -0.7);
		font-family: 'Space Grotesk Variable', sans-serif;
		font-size: calc(var(--card-w) / 15);
		transform-style: preserve-3d;
		color: inherit;
		text-decoration: none;
		-webkit-tap-highlight-color: transparent;
	}

	.card:global(.is-off) {
		pointer-events: none;
	}

	.card:global(.is-far) :global(.edge) {
		display: none;
	}

	.card:focus-visible {
		outline: none;
	}

	.card:focus-visible :global(.face) {
		box-shadow:
			inset 0 0 0 2px var(--lilac),
			0 0 0 2px var(--lilac);
	}

	/* targets the faces directly: an inherited variable here would restyle every card's insides */
	.viewport:global(.has-focus) .card:not(:global(.is-focused)) :global(.face::after) {
		opacity: 0.55;
	}

	.viewport:global(.is-dragging) .card {
		cursor: grabbing;
	}

	/* narrow screens: the corners shrink, so the words stack at the top and bottom edges */
	@media (max-width: 720px) {
		.deck-intro {
			top: 4.5rem;
			right: var(--gutter);
			max-width: none;
		}

		.deck-hint {
			display: none;
		}

		.deck-caption {
			left: var(--gutter);
			justify-items: start;
			text-align: left;
		}

		.art-switch button {
			padding: 0.4rem 0.6rem;
		}
	}
</style>
