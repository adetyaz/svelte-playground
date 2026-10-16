<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap';
	import christyBig from '$lib/assets/images/smooth-slider/christy-big.png';
	import christyThumb from '$lib/assets/images/smooth-slider/christy-image.png';
	import alinaBig from '$lib/assets/images/smooth-slider/alina-big.png';
	import alinaThumb from '$lib/assets/images/smooth-slider/alina-image.png';
	import margotBig from '$lib/assets/images/smooth-slider/margot-big.png';
	import margotThumb from '$lib/assets/images/smooth-slider/margot-image.png';

	const people = [
		{ name: 'Christy', big: christyBig, thumb: christyThumb },
		{ name: 'Alina', big: alinaBig, thumb: alinaThumb },
		{ name: 'Margot', big: margotBig, thumb: margotThumb }
	];

	// Two copies of every card and background panel, so one can leave on one side
	// while its twin enters on the other. Card i and panel i always share a slot.
	const strip = [...people, ...people];

	const SLIDE_DURATION = 0.8;
	const AUTOPLAY_DELAY = 4;
	const SIDE_IMAGE_SCALE = 0.88; // background images outside the centre frame

	let root: HTMLElement;
	let preview: HTMLElement;
	let track: HTMLElement;
	let marquee: HTMLElement;
	let closeButton: HTMLButtonElement;
	let footer: HTMLElement;

	// The name shown in the big strip behind the open card, repeated to fill the screen
	let marqueeName = $state('');
	const MARQUEE_COPIES = [0, 1, 2, 3, 4, 5];

	onMount(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const cards = gsap.utils.toArray<HTMLElement>('.thumb-item', root);
		const panels = gsap.utils.toArray<HTMLElement>('.preview-slide', root);
		const panelImages = panels.map((panel) => panel.querySelector('img')!);
		const nameRolls = cards.map((card) => card.querySelector<HTMLElement>('.name-roll')!);
		const closeLines = gsap.utils.toArray<HTMLElement>('.close-line', root);

		// Slot 0 is the centre, -1/1 its neighbours, everything else is off-screen
		const slotOf = gsap.utils.wrap(-cards.length / 2, cards.length / 2);

		let offset = 0; // only ever counts up/down; slots wrap from it
		let busy = false;
		let isOpen = false;
		let destroyed = false;

		const cardSlot = (i: number, at = offset) => slotOf(i - at);
		const activeCard = () => cards.find((_, i) => cardSlot(i) === 0)!;

		// Side cards are centred on the screen edges, so they're always half visible
		const cardX = (slot: number) => (slot * window.innerWidth) / 2;

		// Background frames sit edge to edge and move as one strip. The centre frame's
		// image is full size; the rest are smaller and grow as they arrive in the centre.
		// The smallest image still fills its frame, so the strip never shows a gap.
		const panelX = (slot: number) => slot * window.innerWidth;
		const imageScale = (slot: number) => (slot === 0 ? 1 / SIDE_IMAGE_SCALE : 1);

		function updateCardState() {
			cards.forEach((card, i) => {
				const slot = cardSlot(i);
				const visible = Math.abs(slot) <= 1;
				card.tabIndex = visible ? 0 : -1;
				card.setAttribute('aria-hidden', String(!visible));
				card.toggleAttribute('aria-current', slot === 0);
				// On narrow screens side cards overlap the centre name; keep the centre card on top
				card.style.zIndex = slot === 0 ? '2' : '1';
			});
		}

		function place() {
			cards.forEach((card, i) => {
				const slot = cardSlot(i);
				gsap.set(card, { xPercent: -50, yPercent: -50, x: cardX(slot) });
				gsap.set(panels[i], { x: panelX(slot) });
				gsap.set(panelImages[i], { scale: imageScale(slot) });
			});
			updateCardState();
		}

		// Autoplay
		const autoplay = gsap.delayedCall(AUTOPLAY_DELAY, () => go(1)).pause();

		function startAutoplay() {
			if (!reduceMotion && !isOpen && !destroyed) autoplay.restart(true);
		}

		// Slide: dir is 1 for next, -1 for previous
		function go(dir: number) {
			if (busy || isOpen) return;
			busy = true;
			autoplay.pause();

			const from = offset;
			offset += dir;

			const tl = gsap.timeline({
				defaults: { duration: SLIDE_DURATION, ease: 'power3.inOut' },
				onComplete: () => {
					busy = false;
					startAutoplay();
				}
			});

			cards.forEach((card, i) => {
				const before = cardSlot(i, from);
				const after = cardSlot(i);

				// A card and its panel wrapping from one end to the other jump while off-screen
				if (Math.abs(after - before) > 1) {
					tl.set(card, { x: cardX(after) }, 0)
						.set(panels[i], { x: panelX(after) }, 0)
						.set(panelImages[i], { scale: imageScale(after) }, 0);
				} else {
					tl.to(card, { x: cardX(after) }, 0)
						.to(panels[i], { x: panelX(after) }, 0)
						.to(panelImages[i], { scale: imageScale(after) }, 0);
				}
			});
			updateCardState();

			// Every name rolls up to its identical copy, then snaps back
			tl.fromTo(nameRolls, { yPercent: 0 }, { yPercent: -100 }, 0).set(nameRolls, { yPercent: 0 });
		}

		// Detail view
		const sideCards = () => cards.filter((_, i) => Math.abs(cardSlot(i)) === 1);

		// Open card: full screen height, slightly narrower than it is tall.
		// On narrow screens it's capped below the screen width so the big name shows at its sides.
		const detailSize = () => ({
			width: Math.min(window.innerHeight * 0.91, window.innerWidth * 0.8),
			height: window.innerHeight
		});
		let restSize = { width: 0, height: 0 }; // the card's size before it opened

		// Keep the close button on the card's bottom edge while the card resizes,
		// but never lower than just above the footer text
		function pinCloseButton() {
			const size = closeButton.offsetHeight;
			const gap = size * 0.3;
			const onCard = activeCard().offsetHeight / 2 - size / 2 - gap;
			const aboveFooter =
				footer.getBoundingClientRect().top - window.innerHeight / 2 - size / 2 - gap;
			gsap.set(closeButton, { y: Math.min(onCard, aboveFooter) });
		}

		async function openDetail() {
			if (busy || isOpen) return;
			busy = true;
			isOpen = true;
			autoplay.pause();

			const active = activeCard();
			restSize = { width: active.offsetWidth, height: active.offsetHeight };
			const w = restSize.width;

			// Render the strip for this person, then measure it
			marqueeName = active.getAttribute('aria-label') ?? '';
			await tick();
			if (destroyed) return;
			const stripWidth = marquee.scrollWidth;

			gsap
				.timeline({
					onUpdate: pinCloseButton,
					onComplete: () => {
						busy = false;
						closeButton.focus({ preventScroll: true });
					}
				})
				// Names drop out, side cards slide off their edges, background goes dark
				.to(nameRolls, { yPercent: 100, duration: 0.5, ease: 'power3.in' }, 0)
				.to(
					sideCards(),
					{
						x: (_: number, card: HTMLElement) => Number(gsap.getProperty(card, 'x')) * 2.2,
						duration: 1,
						ease: 'power3.inOut'
					},
					0
				)
				.to(preview, { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 0)
				// Portrait -> square -> full-height rectangle; the photo crops rather than stretches
				.to(active, { width: w * 1.1, height: w * 1.04, duration: 0.7, ease: 'power3.inOut' }, 0)
				.to(active, { ...detailSize(), duration: 1.3, ease: 'expo.inOut' }, 0.6)
				// Big name slides in left to right behind the card while it grows
				.fromTo(
					marquee,
					{ x: -stripWidth, autoAlpha: 1 },
					{ x: (window.innerWidth - stripWidth) / 2, duration: 1.8, ease: 'expo.inOut' },
					0.5
				)
				// Close button grows with the card, then its cross appears
				.fromTo(
					closeButton,
					{ autoAlpha: 0, scale: 0.5 },
					{ autoAlpha: 1, scale: 1, duration: 1.1, ease: 'expo.out' },
					0.9
				)
				// Cross draws in from the top: "\" grows from its left end, "/" from its right end
				.fromTo(
					closeLines,
					{ clipPath: (i: number) => (i ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)') },
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' },
					1.1
				);
		}

		function closeDetail() {
			if (busy || !isOpen) return;
			busy = true;

			const active = activeCard();

			gsap
				.timeline({
					onUpdate: pinCloseButton,
					onComplete: () => {
						busy = false;
						isOpen = false;
						gsap.set(marquee, { autoAlpha: 0 });
						gsap.set(active, { clearProps: 'width,height' });
						active.focus({ preventScroll: true });
						startAutoplay();
					}
				})
				.to(closeButton, { autoAlpha: 0, scale: 0.5, duration: 0.5, ease: 'power2.in' }, 0)
				.to(marquee, { x: -marquee.scrollWidth, duration: 1, ease: 'power3.inOut' }, 0)
				.to(active, { ...restSize, duration: 1.1, ease: 'expo.inOut' }, 0.1)
				.to(preview, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' }, 0.5)
				.to(
					sideCards(),
					{
						x: (_: number, card: HTMLElement) =>
							cardX(Math.sign(Number(gsap.getProperty(card, 'x')))),
						duration: 1,
						ease: 'power3.out'
					},
					0.5
				)
				.fromTo(
					nameRolls,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 0.7, ease: 'power3.out' },
					0.9
				);
		}

		// Input
		let swiped = false; // a swipe that ends on a card shouldn't also count as a click
		let swipeStart: { x: number; y: number } | null = null;

		const cardClicks = cards.map((card, i) => {
			const onClick = () => {
				if (swiped) return;
				const slot = cardSlot(i);
				if (slot === 0) openDetail();
				else if (Math.abs(slot) === 1) go(slot);
			};
			card.addEventListener('click', onClick);
			return () => card.removeEventListener('click', onClick);
		});

		// Swipe left/right (touch, pen or mouse drag) to change slide
		const onPointerDown = (e: PointerEvent) => {
			swipeStart = { x: e.clientX, y: e.clientY };
			swiped = false;
		};

		const onPointerUp = (e: PointerEvent) => {
			if (!swipeStart) return;
			const dx = e.clientX - swipeStart.x;
			const dy = e.clientY - swipeStart.y;
			swipeStart = null;
			if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
				swiped = true;
				go(dx < 0 ? 1 : -1);
			}
		};

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeDetail();
			else if (e.key === 'ArrowRight') go(1);
			else if (e.key === 'ArrowLeft') go(-1);
		};

		const onResize = () => {
			place();
			if (isOpen) {
				gsap.set(activeCard(), detailSize());
				gsap.set(sideCards(), {
					x: (_: number, card: HTMLElement) => Number(gsap.getProperty(card, 'x')) * 2.2
				});
				gsap.set(marquee, { x: (window.innerWidth - marquee.scrollWidth) / 2 });
				pinCloseButton();
			}
		};

		closeButton.addEventListener('click', closeDetail);
		root.addEventListener('pointerdown', onPointerDown);
		root.addEventListener('pointerup', onPointerUp);
		window.addEventListener('keydown', onKeydown);
		window.addEventListener('resize', onResize);

		// Initial state: everything that animates stays hidden until fonts and images are ready
		gsap.set(closeButton, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
		gsap.set(nameRolls, { yPercent: 100 });
		place();
		busy = true;

		Promise.all([
			document.fonts.ready,
			...gsap.utils
				.toArray<HTMLImageElement>('img', root)
				.map((img) => img.decode().catch(() => {}))
		]).then(() => {
			if (destroyed) return;
			const visibleCards = cards.filter((_, i) => Math.abs(cardSlot(i)) <= 1);

			gsap
				.timeline({
					onComplete: () => {
						busy = false;
						startAutoplay();
					}
				})
				.fromTo(
					preview,
					{ autoAlpha: 0, scale: 1.1 },
					{ autoAlpha: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
					0
				)
				.fromTo(
					gsap.utils.toArray('.label-row', root),
					{ autoAlpha: 0 },
					{ autoAlpha: 1, duration: 0.8 },
					0.4
				)
				.set(track, { autoAlpha: 1 }, 0.4)
				.from(
					visibleCards,
					{ autoAlpha: 0, y: 60, duration: 1, ease: 'power3.out', stagger: 0.1 },
					0.4
				)
				.to(nameRolls, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.9);
		});

		return () => {
			destroyed = true;
			autoplay.kill();
			gsap.killTweensOf(root.querySelectorAll('*'));
			cardClicks.forEach((off) => off());
			closeButton.removeEventListener('click', closeDetail);
			root.removeEventListener('pointerdown', onPointerDown);
			root.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('keydown', onKeydown);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:head>
	<title>Smooth Slider</title>
</svelte:head>

<div class="slider" bind:this={root}>
	<header class="label-row">
		<p>Reflections</p>
		<p>Reflections</p>
		<p>Reflections</p>
	</header>

	<div class="preview-image" bind:this={preview}>
		{#each strip as person, i (i)}
			<div class="preview-slide">
				<img src={person.big} alt="" />
			</div>
		{/each}
	</div>

	<div class="detail">
		<div class="detail-marquee" aria-hidden="true" bind:this={marquee}>
			{#if marqueeName}
				{#each MARQUEE_COPIES as copy (copy)}
					<span>{marqueeName}</span>
				{/each}
			{/if}
		</div>
	</div>

	<div class="thumbs" bind:this={track}>
		{#each strip as person, i (i)}
			<button class="thumb-item" type="button" aria-label={person.name}>
				<img src={person.thumb} alt="" />
				<span class="name" aria-hidden="true">
					<span class="name-roll"><span>{person.name}</span><span>{person.name}</span></span>
				</span>
			</button>
		{/each}
	</div>

	<button class="close-button" type="button" aria-label="Close" bind:this={closeButton}>
		<span class="close-line"></span>
		<span class="close-line"></span>
	</button>

	<footer class="label-row" bind:this={footer}>
		<p>Reflections</p>
		<p>Reflections</p>
		<p>Reflections</p>
	</footer>
</div>

<style>
	@font-face {
		font-family: 'WayFinder CF';
		src: url('$lib/assets/fonts/wayfindercf-thin.otf') format('opentype');
	}

	/*
	  Fluid sizing: everything scales smoothly with the viewport between a min and max,
	  so there are no breakpoint jumps from phone to large desktop.
	*/
	.slider {
		/* card: ~45vw on phones, ~27vw on desktop, never taller than the screen allows */
		--card-w: min(clamp(11rem, 20vw + 6rem, 32rem), 42vh, 42dvh);
		--card-h: calc(var(--card-w) * 627 / 476);

		--edge: clamp(1rem, 4vw, 4rem); /* header/footer side inset */
		--edge-y: clamp(1rem, 3vh, 2rem); /* header/footer top/bottom inset */
		--label: clamp(0.625rem, 0.55rem + 0.2vw, 0.8125rem); /* "REFLECTIONS" */
		--close-size: clamp(2.625rem, 2.1rem + 1.575vw, 3.675rem);

		/* the page is its own full-screen layer, so nothing leaks onto other routes */
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: #000;
		color: #fff;
		font-family: 'Inter', sans-serif;
		/* horizontal swipes are handled in the script */
		touch-action: pan-y;
	}

	.label-row {
		position: fixed;
		left: var(--edge);
		right: var(--edge);
		text-transform: uppercase;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		z-index: 4;
		font-size: var(--label);
		pointer-events: none;
		/* revealed by the intro */
		visibility: hidden;
	}

	.label-row p {
		margin: 0;
	}

	header {
		top: var(--edge-y);
	}

	footer {
		bottom: var(--edge-y);
	}

	/* Background: a track of panels, one per card, moving with the cards */
	.preview-image {
		position: fixed;
		inset: 0;
		overflow: hidden;
		/* revealed by the intro */
		visibility: hidden;
	}

	.preview-image::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 3;
		background: rgb(0 0 0 / 0.3);
	}

	/* Full-screen frames joined edge to edge like a film strip; the script sets their x */
	.preview-slide {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.preview-slide img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}

	/* Detail view: the big name strip behind the enlarged card */
	.detail {
		position: fixed;
		inset: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		overflow: hidden;
		pointer-events: none;
	}

	.detail-marquee {
		flex: none;
		display: flex;
		gap: 0.2em;
		font-family: 'WayFinder CF', sans-serif;
		font-size: min(24vw, 32vh);
		line-height: 1;
		/* lift the lowercase letters to the visual centre of the card */
		margin-top: -0.2em;
		white-space: nowrap;
		visibility: hidden;
	}

	/* Card row */
	.thumbs {
		position: fixed;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		/* revealed by the intro */
		visibility: hidden;
	}

	.thumb-item {
		position: absolute;
		top: 50%;
		left: 50%;
		width: var(--card-w);
		height: var(--card-h);
		padding: 0;
		border: 0;
		background: #111;
		color: inherit;
		cursor: pointer;
		pointer-events: auto;
		-webkit-tap-highlight-color: transparent;
	}

	.thumb-item:focus-visible {
		outline: 1px solid #fff;
		outline-offset: 6px;
	}

	.thumb-item img {
		display: block;
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
		-webkit-user-drag: none;
	}

	/*
	  The name is a window over the lower part of the card holding two stacked copies,
	  each filling the window with the text at its bottom. Rolling the stack up one
	  window swaps the copies.
	*/
	.name {
		position: absolute;
		top: 61%;
		left: -32%;
		height: 36%;
		overflow: hidden;
		font-family: 'WayFinder CF', sans-serif;
		font-size: calc(var(--card-w) * 0.34);
		font-weight: 200;
		line-height: 1;
		white-space: nowrap;
		text-align: left;
		pointer-events: none;
	}

	.name-roll {
		display: block;
		height: 100%;
	}

	.name-roll span {
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		height: 100%;
		/* room for descenders (g, y) above the window's clipped bottom edge */
		padding-bottom: 0.25em;
	}

	/* Centred on screen; the script pins it to the open card's bottom edge, above the footer */
	.close-button {
		position: fixed;
		z-index: 5;
		left: 50%;
		top: 50%;
		width: var(--close-size);
		height: var(--close-size);
		padding: 0;
		border: 1px solid rgb(255 255 255 / 0.6);
		border-radius: 50%;
		background: rgb(0 0 0 / 0.25);
		color: #fff;
		cursor: pointer;
		visibility: hidden;
		-webkit-tap-highlight-color: transparent;
	}

	/* The script draws each stroke in from its top end with clip-path */
	.close-line {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 31%;
		height: 1.5px;
		background: currentColor;
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.close-line + .close-line {
		transform: translate(-50%, -50%) rotate(-45deg);
	}
</style>
