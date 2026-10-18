<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import '$lib/assets/bike-reveal/font/pilat.css';
	import homeBike from '$lib/assets/bike-reveal/home-bike.png';
	import revealBike from '$lib/assets/bike-reveal/reveal-bike.png';
	import videoPoster from '$lib/assets/bike-reveal/subtle-bg-bike.png';
	import logo from '$lib/assets/bike-reveal/logo.png';
	import logoHover from '$lib/assets/bike-reveal/logo-hover.png';

	type Spot = { id: string; label: string; value: string; x: number; y: number; opens?: true };

	// Positions are percentages of the 1920×1080 render, so they track the bike at any size.
	const SPOTS: Spot[] = [
		{ id: 'brakes', label: 'Brakes', value: 'SRAM Code R', x: 67.45, y: 22.3, opens: true },
		{ id: 'saddle', label: 'Saddle', value: 'Fizik Terra Argo X3', x: 50.26, y: 36.6 },
		{ id: 'wheels', label: 'Wheels', value: 'DT Swiss H 1900', x: 76.56, y: 47.3 },
		{ id: 'battery', label: 'Battery', value: 'Juiced 52V · 1,040 Wh', x: 59.53, y: 56.2 },
		{ id: 'motor', label: 'Motor', value: 'Bafang 750W rear hub', x: 43.91, y: 66.4 }
	];

	const SPECS = [
		{ label: 'Speed', value: '80.6 KM/H' },
		{ label: 'Material', value: 'CARBON (CF)' },
		{ label: 'Sizes', value: 'S, M, L, XL' }
	];

	const FEATURES = [
		'4-Piston Caliper',
		'SwingLink lever for a firm, predictable feel',
		'Rated for e-bike weights and heavy-duty use'
	];

	// home-bike-2.png is exactly home-bike.png cropped from x = 1240, so the detail view is
	// the same render slid left until that column meets the edge of the screen.
	const CROP_X = 1240 / 1920;

	let view = $state<'home' | 'detail'>('home');
	let section = $state(0); // within the brakes view: 0 = SRAM Code R, 1 = Rear brakes
	let tip = $state<string | null>(null);

	let root: HTMLElement;
	let scene: HTMLElement;
	let track: HTMLElement;
	let panel: HTMLElement;
	let buy: HTMLElement;

	let open = () => {};
	let close = () => {};

	const onSpot = (spot: Spot) => {
		if (spot.opens) open();
		else tip = tip === spot.id ? null : spot.id;
	};

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const slide = { p: 0 };

		const detailX = () => -(scene.offsetLeft + CROP_X * scene.offsetWidth);
		const applySlide = () => {
			gsap.set(track, { x: slide.p * detailX() });
		};

		// BUY ONE stays through the brakes view, dropped to the bottom-left corner.
		const buyDrop = () => {
			const rect = buy.getBoundingClientRect();
			const top = rect.top - (gsap.getProperty(buy, 'y') as number);
			return window.innerHeight * 0.912 - rect.height - top;
		};

		const ctx = gsap.context(() => {
			// ---------- entrance ----------
			if (!reduced) {
				gsap
					.timeline({ defaults: { ease: 'expo.out' } })
					.from('.masthead', { autoAlpha: 0, y: -16, duration: 0.9 })
					.from(scene, { autoAlpha: 0, scale: 1.05, duration: 2.2, ease: 'power2.out' }, 0)
					.fromTo(
						'.home .wipe',
						{ '--wipe': 0 },
						{ '--wipe': 1, duration: 1.2, stagger: 0.1, ease: 'power2.out' },
						0.4
					)
					.from(buy, { autoAlpha: 0, x: -20, duration: 0.8 }, 0.9)
					.from('.spot', { autoAlpha: 0, scale: 0, duration: 0.8, stagger: 0.08 }, 1.1)
					.fromTo(
						'.specs .wipe',
						{ '--wipe': 0 },
						{ '--wipe': 1, duration: 1, stagger: 0.12, ease: 'power2.out' },
						1.2
					)
					.from('.spec-tick', { scaleY: 0, duration: 0.6, stagger: 0.12 }, 1.2);
			}

			// ---------- home → brakes ----------
			// Only to/fromTo here, so invalidate() can re-measure it from the home state on each open.
			const reveal = gsap
				.timeline({
					paused: true,
					onComplete: () => panel.classList.add('is-live'),
					onReverseComplete: () => {
						view = 'home';
					}
				})
				.to('.spot', { autoAlpha: 0, scale: 0.4, duration: 0.35, stagger: 0.04, ease: 'power2.in' })
				.to(
					'.home > :not(.buy)',
					{ autoAlpha: 0, x: -90, duration: 0.7, stagger: 0.06, ease: 'power3.in' },
					0
				)
				.to('.specs', { autoAlpha: 0, y: 24, duration: 0.5, ease: 'power2.in' }, 0)
				.to(buy, { y: buyDrop, duration: 1.3, ease: 'expo.inOut' }, 0.15)
				.to(slide, { p: 1, duration: 1.5, ease: 'expo.inOut', onUpdate: applySlide }, 0.1)
				.set(panel, { autoAlpha: 1 }, 0.85)
				.fromTo(
					'.lead .wipe',
					{ '--wipe': 0 },
					{ '--wipe': 1, duration: 1.1, stagger: 0.12, ease: 'power2.out' },
					0.85
				)
				.fromTo(
					'.video-card',
					{ clipPath: 'inset(100% 0% 0% 0%)' },
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' },
					1.15
				)
				.fromTo(
					'.video-card img',
					{ scale: 1.25 },
					{ scale: 1, duration: 1.6, ease: 'expo.out' },
					1.15
				)
				.fromTo(
					'.video-meta',
					{ autoAlpha: 0, y: 12 },
					{ autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
					1.5
				)
				.fromTo(
					'.back',
					{ autoAlpha: 0, x: 16 },
					{ autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' },
					1.3
				);

			gsap.set(panel, { autoAlpha: 0 });

			// ---------- SRAM Code R → Rear brakes ----------
			// One gesture plays the whole change; going back plays it in reverse.
			const swap = gsap
				.timeline({ paused: true })
				// the lead section leaves upward, its type wiped off from the right and dimmed
				// far enough that the bottom of the video card clears the top of the screen
				.to('.lead', {
					y: () => -(root.querySelector('.video-card')!.getBoundingClientRect().bottom + 40),
					duration: 1.35,
					ease: 'power2.inOut'
				})
				.to(
					'.lead .wipe',
					{ '--wipe': 0, opacity: 0.45, duration: 0.8, stagger: 0.04, ease: 'power1.in' },
					0
				)
				// the rear section rises in behind it
				.fromTo(
					'.rear-copy',
					{ y: () => window.innerHeight * 0.55 },
					{ y: 0, duration: 1.3, ease: 'expo.out' },
					0.35
				)
				.fromTo(
					'.rear .wipe',
					{ '--wipe': 0 },
					{ '--wipe': 1, duration: 1.1, stagger: 0.09, ease: 'power2.out' },
					0.5
				)
				.fromTo('.rear .tick', { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'expo.out' }, 0.7)
				// The R comes up from the bottom of the screen with the bike just behind it. Most of
				// the climb happens in the first third of a second, then both drift up and settle;
				// the bike grows to full size during the first half of that climb.
				.fromTo(
					'.big-r',
					{ y: () => window.innerHeight * 0.6, rotateY: 180, autoAlpha: 0 },
					{ y: 0, rotateY: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' },
					0.36
				)
				.fromTo(
					'.rear-bike',
					{ y: () => window.innerHeight * 0.6, autoAlpha: 0 },
					{ y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' },
					0.44
				)
				.fromTo(
					'.rear-bike',
					{ scale: 0.45 },
					{ scale: 1, duration: 0.7, ease: 'power2.out', immediateRender: false },
					0.44
				)
				// the hub HUD rides in with the bike, oversized, and closes down onto the rim as the
				// bike settles
				.fromTo(
					['.hub-ring', '.hub-dots'],
					{ scale: 2.4, autoAlpha: 0, transformOrigin: '50% 50%' },
					{ scale: 1, autoAlpha: 1, duration: 1.1, ease: 'power3.out' },
					0.55
				)
				.fromTo(
					'.hub-ring',
					{ strokeDashoffset: 100 },
					{ strokeDashoffset: 0, duration: 1.0, ease: 'power2.out' },
					0.55
				);

			let swapping = false;
			const settle = () => {
				// let trackpad momentum die out before the next gesture counts
				gsap.delayedCall(0.45, () => (swapping = false));
			};

			const go = (to: number) => {
				if (view !== 'detail' || swapping || to === section || reveal.isActive()) return;
				section = to;
				if (reduced) {
					swap.progress(to);
					return;
				}
				swapping = true;
				if (to === 1) swap.eventCallback('onComplete', settle).timeScale(1).play();
				else swap.eventCallback('onReverseComplete', settle).timeScale(1.15).reverse();
			};

			open = () => {
				if (view === 'detail' || reveal.isActive()) return;
				view = 'detail';
				tip = null;
				reveal.invalidate().timeScale(1).play();
				if (reduced) reveal.progress(1);
			};

			close = () => {
				if (view === 'home' || reveal.isActive() || swapping) return;
				panel.classList.remove('is-live');
				const rewind = () => {
					section = 0;
					reveal.timeScale(1.25).reverse();
					if (reduced) reveal.progress(0);
				};
				if (swap.progress() > 0 && !reduced) {
					swapping = true;
					gsap.to(swap, {
						progress: 0,
						duration: 0.9,
						ease: 'power2.inOut',
						onComplete: () => {
							swapping = false;
							rewind();
						}
					});
				} else {
					swap.progress(0);
					rewind();
				}
			};

			// ---------- input ----------
			const onWheel = (e: WheelEvent) => {
				if (Math.abs(e.deltaY) < 8) return;
				go(e.deltaY > 0 ? 1 : 0);
			};

			let touchY = 0;
			const onTouchStart = (e: TouchEvent) => {
				touchY = e.touches[0].clientY;
			};
			const onTouchEnd = (e: TouchEvent) => {
				const dy = touchY - e.changedTouches[0].clientY;
				if (Math.abs(dy) > 50) go(dy > 0 ? 1 : 0);
			};

			const onKey = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					if (view === 'detail') close();
					else tip = null;
				} else if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
					go(1);
				} else if (['ArrowUp', 'PageUp'].includes(e.key)) {
					go(0);
				}
			};

			const onResize = () => {
				applySlide();
				if (view === 'detail' && !reveal.isActive()) gsap.set(buy, { y: buyDrop() });
			};

			root.addEventListener('wheel', onWheel, { passive: true });
			root.addEventListener('touchstart', onTouchStart, { passive: true });
			root.addEventListener('touchend', onTouchEnd, { passive: true });
			window.addEventListener('keydown', onKey);
			window.addEventListener('resize', onResize);

			return () => {
				root.removeEventListener('wheel', onWheel);
				root.removeEventListener('touchstart', onTouchStart);
				root.removeEventListener('touchend', onTouchEnd);
				window.removeEventListener('keydown', onKey);
				window.removeEventListener('resize', onResize);
			};
		}, root);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Odyssey One — Bike Reveal</title>
</svelte:head>

<div class="odyssey" class:is-detail={view === 'detail'} bind:this={root}>
	<!-- the render: one 16:9 image that covers the screen -->
	<div class="scene" bind:this={scene}>
		<div class="track" bind:this={track}>
			<img class="bike" src={homeBike} alt="The Odyssey One e-bike, side on, lit in cyan" />

			{#each SPOTS as spot (spot.id)}
				<div
					class="spot"
					class:is-open={tip === spot.id}
					style:left="{spot.x}%"
					style:top="{spot.y}%"
				>
					<button
						type="button"
						class="spot-btn"
						aria-describedby="tip-{spot.id}"
						aria-label={spot.opens ? `${spot.label}: explore the ${spot.value}` : spot.label}
						tabindex={view === 'home' ? 0 : -1}
						onpointerenter={() => (tip = spot.id)}
						onpointerleave={() => tip === spot.id && (tip = null)}
						onfocus={() => (tip = spot.id)}
						onblur={() => tip === spot.id && (tip = null)}
						onclick={() => onSpot(spot)}
					>
						<span class="diamond"></span>
						<span class="chev chev-u"></span>
						<span class="chev chev-r"></span>
						<span class="chev chev-d"></span>
						<span class="chev chev-l"></span>
					</button>
					<div class="tip" id="tip-{spot.id}" role="tooltip">
						<span class="tip-label">{spot.label}</span>
						<span class="tip-value">{spot.value}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<header class="masthead">
		<a class="brand" href={resolve('/')} aria-label="Odyssey Bicycle — back to the playground">
			<span class="brand-mark">
				<img src={logo} alt="" width="50" height="47" />
				<img class="brand-hover" src={logoHover} alt="" width="50" height="47" />
			</span>
			<span class="brand-name">
				odyssey
				<small>BICYCLE</small>
			</span>
		</a>
		<nav aria-label="Main">
			<a href="#bikes" aria-label="Bikes"><span data-label="BIKES">BIKES</span></a>
			<a href="#services" aria-label="Services"><span data-label="SERVICES">SERVICES</span></a>
			<a href="#about" aria-label="About"><span data-label="ABOUT">ABOUT</span></a>
		</nav>
	</header>

	<!-- home -->
	<section class="home">
		<h1>
			<span class="h-light wipe">odyssey</span>
			<span class="h-heavy wipe">ONE</span>
		</h1>
		<p class="lede wipe" aria-hidden={view !== 'home'}>
			A carbon e-bike with a 52V pack hidden in the frame and 750W of quiet torque at the rear
			wheel. Built to make the long way home the one you choose.
		</p>
		<a class="buy" href="#buy" bind:this={buy}>
			<svg viewBox="0 0 196 52" aria-hidden="true">
				<rect x="1" y="1" width="194" height="50" rx="25" pathLength="100" />
			</svg>
			<span>BUY ONE</span>
		</a>
	</section>

	<dl class="specs" aria-hidden={view !== 'home'}>
		{#each SPECS as spec (spec.label)}
			<div class="spec">
				<svg class="spec-tick" viewBox="0 0 8 44" aria-hidden="true"
					><path d="M1,1 L7,7 L7,43" /></svg
				>
				<dt class="wipe">{spec.label}</dt>
				<dd class="wipe">{spec.value}</dd>
			</div>
		{/each}
	</dl>

	<!-- brakes -->
	<button
		type="button"
		class="back"
		onclick={() => close()}
		tabindex={view === 'detail' ? 0 : -1}
		aria-hidden={view !== 'detail'}
	>
		<svg viewBox="0 0 40 40" aria-hidden="true">
			<circle cx="20" cy="20" r="18" pathLength="100" />
			<path d="M22,14 L16,20 L22,26" />
		</svg>
		<span>BACK</span>
	</button>

	<div class="panel" bind:this={panel} aria-hidden={view !== 'detail'}>
		<section class="lead" aria-hidden={section !== 0}>
			<h2>
				<span class="h-light wipe">The best Brakes</span>
				<span class="h-light wipe">in the world</span>
				<span class="h-heavy wipe">SRAM CODE R</span>
			</h2>
			<div class="cols">
				<p class="wipe">
					Four-piston calipers paired with 200 mm rotors give Code R the stopping power usually
					saved for downhill bikes, so a fully loaded Odyssey slows as calmly as it accelerates.
				</p>
				<p class="wipe">
					Heat is what fades a brake. Larger pads and a bigger fluid reservoir keep Code R cool on
					long descents, so the bite at the bottom of the hill matches the bite at the top.
				</p>
			</div>

			<figure class="video-card">
				<img src={videoPoster} alt="" />
				<figcaption class="video-meta">
					<button
						type="button"
						class="play"
						aria-label="Play the Code R film"
						tabindex={view === 'detail' && section === 0 ? 0 : -1}
					>
						<svg viewBox="0 0 40 40" aria-hidden="true">
							<circle class="play-ring" cx="20" cy="20" r="18" pathLength="100" />
							<path class="play-icon" d="M17,14 L26,20 L17,26 Z" />
						</svg>
					</button>
					<span>WATCH CODE R HOLD A 1,200 M DESCENT, START TO FINISH.</span>
				</figcaption>
			</figure>
		</section>

		<section class="rear" aria-hidden={section !== 1}>
			<div class="rear-copy">
				<div class="rear-top">
					<h3>
						<svg class="tick" viewBox="0 0 8 60" aria-hidden="true"
							><path d="M1,1 L7,8 L7,59" /></svg
						>
						<span class="wipe">Rear brakes</span>
					</h3>
					<p class="wipe">
						The rear caliper does the quiet work: scrubbing speed before corners and holding the
						bike steady on loose ground. Same four pistons, tuned for control rather than raw bite.
					</p>
				</div>
				<div class="rear-bottom">
					<h4 class="wipe">Features</h4>
					<ul>
						{#each FEATURES as feature (feature)}
							<li class="wipe">{feature}</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="rear-art">
				<span class="big-r" aria-hidden="true">R</span>
				<div class="rear-bike">
					<img src={revealBike} alt="The Odyssey One from the front, angled to show the brakes" />
					<!-- HUD on the rear rotor, tilted to lie flat on the hub -->
					<svg class="hub" viewBox="-60 -60 120 120" aria-hidden="true">
						<g transform="rotate(-12) scale(0.82 1)">
							<circle class="hub-ring" r="27" pathLength="100" />
							<g class="hub-dots">
								<circle class="hub-dots-ring" r="41" pathLength="100" />
							</g>
						</g>
					</svg>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.odyssey {
		--cyan: #45e3ee;
		--ink: #000;
		--paper: #f2f6f8;
		--muted: #8b949c;
		/* the render covers the screen: as wide as the viewport, or as wide as 16:9 needs */
		--scene-w: max(100vw, 177.78svh);
		--focus-x: 0.5;

		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--ink);
		color: var(--paper);
		font-family: 'Pilat Extended', sans-serif;
		font-weight: 300;
	}

	/* soft-edged left-to-right reveal, driven by --wipe (0 → 1) */
	.wipe {
		--wipe: 1;
		-webkit-mask-image: linear-gradient(
			90deg,
			#000 calc(var(--wipe) * 130% - 30%),
			transparent calc(var(--wipe) * 130%)
		);
		mask-image: linear-gradient(
			90deg,
			#000 calc(var(--wipe) * 130% - 30%),
			transparent calc(var(--wipe) * 130%)
		);
	}

	/* ---------- scene ---------- */
	.scene {
		position: absolute;
		left: calc(50vw - var(--scene-w) * var(--focus-x));
		top: calc(50svh - var(--scene-w) * 0.28125);
		width: var(--scene-w);
		aspect-ratio: 16 / 9;
	}

	.track {
		position: absolute;
		inset: 0;
	}

	.bike {
		display: block;
		width: 100%;
		height: 100%;
		user-select: none;
		pointer-events: none;
		/* the render's edge would show as a hard seam while it slides */
		-webkit-mask-image: linear-gradient(90deg, #000 93%, transparent);
		mask-image: linear-gradient(90deg, #000 93%, transparent);
	}

	/* ---------- hotspots ---------- */
	.spot {
		position: absolute;
		width: 0;
		height: 0;
		z-index: 2;
	}

	.spot-btn {
		position: absolute;
		left: -1.6rem;
		top: -1.6rem;
		width: 3.2rem;
		height: 3.2rem;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	.spot-btn:focus-visible {
		outline: none;
	}

	.diamond {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 1.15rem;
		height: 1.15rem;
		transform: rotate(45deg);
		background: rgba(69, 227, 238, 0.42);
		box-shadow: 0 0 14px rgba(69, 227, 238, 0.3);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;
	}

	.chev {
		--d: 1.15rem;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0.32rem;
		height: 0.32rem;
		border-top: 1.5px solid var(--cyan);
		border-left: 1.5px solid var(--cyan);
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.chev-u {
		--r: 45deg;
		--x: 0;
		--y: -1;
	}
	.chev-r {
		--r: 135deg;
		--x: 1;
		--y: 0;
	}
	.chev-d {
		--r: 225deg;
		--x: 0;
		--y: 1;
	}
	.chev-l {
		--r: 315deg;
		--x: -1;
		--y: 0;
	}

	.chev {
		transform: translate(-50%, -50%) translate(calc(var(--x) * var(--d)), calc(var(--y) * var(--d)))
			rotate(var(--r));
	}

	/* hover: the diamond goes solid and the chevrons step outward */
	.spot.is-open .diamond,
	.spot-btn:focus-visible .diamond {
		background: var(--cyan);
		box-shadow: 0 0 18px rgba(69, 227, 238, 0.55);
	}

	.spot.is-open .chev,
	.spot-btn:focus-visible .chev {
		--d: 1.4rem;
	}

	/* a dark see-through plate beside the diamond, wiped on left to right */
	.tip {
		position: absolute;
		left: 2.1rem;
		top: 0;
		display: grid;
		gap: 0.35rem;
		min-width: max-content;
		padding: 0.6rem 1rem 0.65rem;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(6px);
		pointer-events: none;
		opacity: 0;
		clip-path: inset(0 100% 0 0);
		transform: translateY(-50%);
		transition:
			opacity 0.2s,
			clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.spot.is-open .tip {
		opacity: 1;
		clip-path: inset(0);
	}

	.tip-label {
		font-size: 0.66rem;
		color: var(--muted);
	}

	.tip-value {
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	/* ---------- masthead ---------- */
	.masthead {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: clamp(1.25rem, 2.6vw, 2.5rem) clamp(1.25rem, 7.3vw, 8.8rem);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		color: var(--paper);
		text-decoration: none;
	}

	.brand-mark {
		position: relative;
		width: 2rem;
		aspect-ratio: 50 / 47;
	}

	.brand-mark img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transition: opacity 0.3s;
	}

	.brand-hover,
	.brand:hover .brand-mark img:first-child,
	.brand:focus-visible .brand-mark img:first-child {
		opacity: 0;
	}

	.brand:hover .brand-hover,
	.brand:focus-visible .brand-hover {
		opacity: 1;
	}

	.brand-name {
		display: grid;
		font-size: 1.05rem;
		font-weight: 400;
		line-height: 1;
	}

	.brand-name small {
		margin-top: 0.25rem;
		font-size: 0.42rem;
		font-weight: 600;
		letter-spacing: 0.62em;
		color: var(--cyan);
	}

	nav {
		display: flex;
		gap: clamp(1.5rem, 3.4vw, 4rem);
	}

	/*
	  Text roll: the white word slides up out of its line while a cyan copy slides up from
	  below; leaving plays it back down.
	*/
	nav a {
		display: block;
		overflow: hidden;
		font-size: 0.6rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: 0.14em;
		color: var(--paper);
		text-decoration: none;
	}

	nav a span {
		position: relative;
		display: block;
		transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
	}

	nav a span::after {
		content: attr(data-label);
		position: absolute;
		left: 0;
		top: 100%;
		color: var(--cyan);
	}

	nav a:hover span,
	nav a:focus-visible span {
		transform: translateY(-100%);
	}

	nav a:focus-visible {
		outline: 1px solid var(--cyan);
		outline-offset: 4px;
	}

	/* ---------- home ---------- */
	.home {
		position: absolute;
		left: clamp(1.25rem, 7.3vw, 8.8rem);
		top: 50%;
		z-index: 4;
		width: min(26rem, 32vw);
		transform: translateY(-38%);
	}

	h1,
	h2 {
		display: grid;
		margin: 0;
		font-weight: inherit;
	}

	.h-light {
		font-size: clamp(1.9rem, 3.75vw, 4.5rem);
		font-weight: 300;
		line-height: 1.15;
		letter-spacing: -0.01em;
	}

	.h-heavy {
		font-size: clamp(2.6rem, 5vw, 6rem);
		font-weight: 800;
		line-height: 1.05;
		color: var(--cyan);
	}

	.lede {
		margin: clamp(1.25rem, 2.6vw, 2.5rem) 0 0;
		font-size: clamp(0.7rem, 0.78vw, 0.95rem);
		line-height: 1.75;
		color: var(--muted);
	}

	.buy {
		position: relative;
		display: grid;
		place-items: center;
		width: clamp(9.5rem, 10.2vw, 12.5rem);
		aspect-ratio: 196 / 52;
		margin-top: clamp(1.75rem, 3.6vw, 3.5rem);
		color: var(--paper);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.55em;
		text-decoration: none;
		transition: color 0.3s;
	}

	.buy span {
		margin-right: -0.55em;
	}

	.buy:hover,
	.buy:focus-visible {
		color: var(--cyan);
	}

	.buy svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/*
	  Two brackets, half a turn apart. The rect's path starts at the top-left end of the top edge
	  and runs clockwise; with pathLength 100 each bracket runs from the middle of a side (91.18
	  and 41.18) round the corner to 60% of the way along the next edge, 29.4 units long.
	  On hover each dash grows forward until they meet.
	*/
	.buy rect {
		fill: none;
		stroke: var(--cyan);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 29.4 20.6;
		stroke-dashoffset: 8.82;
		transition: stroke-dasharray 0.6s cubic-bezier(0.65, 0, 0.35, 1);
	}

	.buy:hover rect,
	.buy:focus-visible rect {
		stroke-dasharray: 50 0;
	}

	.buy:focus-visible {
		outline: none;
	}

	/* ---------- specs ---------- */
	.specs {
		position: absolute;
		inset: auto 0 clamp(1.5rem, 6.5svh, 5.5rem) 0;
		z-index: 3;
		margin: 0;
		pointer-events: none;
	}

	.spec {
		position: absolute;
		bottom: 0;
		display: grid;
		gap: 0.45rem;
		padding-left: 1.6rem;
	}

	/* aligned under the bike, in scene coordinates */
	.spec:nth-child(1) {
		left: calc(50vw - var(--scene-w) * var(--focus-x) + var(--scene-w) * 0.396);
	}
	.spec:nth-child(2) {
		left: calc(50vw - var(--scene-w) * var(--focus-x) + var(--scene-w) * 0.607);
	}
	.spec:nth-child(3) {
		left: calc(50vw - var(--scene-w) * var(--focus-x) + var(--scene-w) * 0.834);
	}

	.spec-tick {
		position: absolute;
		left: 0;
		top: -0.2rem;
		width: 0.55rem;
		height: calc(100% + 0.4rem);
		transform-origin: top;
	}

	.spec-tick path,
	.tick path {
		fill: none;
		stroke: var(--cyan);
		stroke-width: 1.5;
	}

	.spec dt {
		font-size: 0.6rem;
		color: var(--muted);
	}

	.spec dd {
		margin: 0;
		font-size: clamp(0.75rem, 0.95vw, 1.1rem);
		font-weight: 400;
		letter-spacing: 0.06em;
	}

	/* ---------- back ---------- */
	.back {
		position: absolute;
		z-index: 4;
		left: calc(var(--scene-w) * 0.282);
		top: 21svh;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--paper);
		font: inherit;
		font-size: 0.56rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		cursor: pointer;
		visibility: hidden;
	}

	.is-detail .back {
		visibility: visible;
	}

	.back svg {
		width: 2.1rem;
		height: 2.1rem;
		overflow: visible;
	}

	.back circle {
		fill: none;
		stroke: var(--cyan);
		stroke-width: 1.5;
		stroke-dasharray: 0 100;
		stroke-dashoffset: -62.5;
		transition: stroke-dasharray 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.back path {
		fill: none;
		stroke: var(--paper);
		stroke-width: 1.5;
	}

	.back span {
		opacity: 0;
		transform: translateX(-0.4rem);
		transition:
			opacity 0.3s,
			transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.back:hover circle,
	.back:focus-visible circle {
		stroke-dasharray: 25 75;
	}

	.back:hover span,
	.back:focus-visible span {
		opacity: 1;
		transform: none;
	}

	.back:focus-visible {
		outline: none;
	}

	/* ---------- brakes panel: two stacked sections, swapped by one gesture ---------- */
	.panel {
		position: absolute;
		inset: 0 0 0 calc(var(--scene-w) * 0.365);
		z-index: 3;
		overflow: hidden;
		pointer-events: none;
	}

	.panel:global(.is-live) {
		pointer-events: auto;
	}

	.lead,
	.rear {
		position: absolute;
		inset: 0;
	}

	.lead {
		padding: 19svh clamp(1.25rem, 7.3vw, 8.8rem) 0 0;
	}

	.lead h2 .h-light {
		font-size: clamp(1.6rem, 2.6vw, 3.2rem);
		font-weight: 350;
		line-height: 1.5;
	}

	.lead h2 .h-heavy {
		font-size: clamp(2.6rem, 4.6vw, 5.6rem);
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(1.5rem, 2.2vw, 2.75rem);
		max-width: 52rem;
		margin-top: clamp(1.25rem, 2.6vw, 2.5rem);
	}

	.cols p,
	.rear-copy p {
		margin: 0;
		font-size: clamp(0.68rem, 0.74vw, 0.9rem);
		line-height: 1.8;
		color: var(--muted);
	}

	/* 16:9 — taller than the space left under the copy, so at rest it runs off the bottom */
	.video-card {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		margin: clamp(2rem, 3.5vw, 3.5rem) 0 0;
		background: #030507;
	}

	.video-card img {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: auto;
		transform-origin: 70% 100%;
	}

	.video-meta {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-left: clamp(1rem, 2.2vw, 2.5rem);
		font-size: 0.6rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		line-height: 1.7;
		pointer-events: none;
	}

	.video-meta span {
		max-width: 20rem;
	}

	.play {
		flex: none;
		width: clamp(3rem, 4vw, 4.5rem);
		aspect-ratio: 1;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		pointer-events: auto;
	}

	.play svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* a full ring that fills cyan on hover */
	.play-ring {
		fill: rgba(69, 227, 238, 0);
		stroke: var(--cyan);
		stroke-width: 1.2;
		transition: fill 0.4s;
	}

	.play-icon {
		fill: var(--paper);
		transition: fill 0.3s;
	}

	.play:hover .play-ring,
	.play:focus-visible .play-ring {
		fill: var(--cyan);
	}

	.play:hover .play-icon,
	.play:focus-visible .play-icon {
		fill: var(--ink);
	}

	.play:focus-visible {
		outline: none;
	}

	/* nothing in the rear section is interactive; don't let it cover the play button */
	.rear {
		pointer-events: none;
	}

	/* heading and copy at the top, features down at the bottom */
	.rear-copy {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: min(30rem, 36%);
		padding: 19svh 0 14svh 2.2rem;
	}

	.rear-top,
	.rear-bottom {
		display: grid;
		gap: clamp(1rem, 1.6vw, 1.6rem);
	}

	.rear h3 {
		position: relative;
		margin: 0;
		font-size: clamp(1.6rem, 2.6vw, 3.2rem);
		font-weight: 350;
	}

	.tick {
		position: absolute;
		left: -1.8rem;
		top: -0.3em;
		width: 0.55rem;
		height: 1.8em;
		transform-origin: top;
	}

	.rear h4 {
		margin: 0;
		font-size: clamp(0.9rem, 1.15vw, 1.35rem);
		font-weight: 400;
	}

	.rear ul {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rear li {
		position: relative;
		padding-left: 1.1rem;
		font-size: clamp(0.62rem, 0.68vw, 0.82rem);
		color: var(--muted);
	}

	.rear li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.45em;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--cyan);
	}

	/* sized and placed from the video's resting frame: rear hub at (1365, 715) of 1920×1080 */
	.rear-art {
		position: absolute;
		top: 19.5svh;
		right: calc(var(--scene-w) * 0.032);
		width: calc(var(--scene-w) * 0.427);
		container-type: inline-size;
		perspective: 900px;
	}

	/* sits behind the bike; the handlebar crosses its leg */
	.big-r {
		position: absolute;
		top: 4.5%;
		right: 18%;
		font-size: 22.5cqw;
		font-weight: 900;
		line-height: 0.8;
		color: var(--cyan);
	}

	/*
	  The export is cut flat just below the rear hub. Rather than hide the hub, the HUD is cut
	  with the bike: both are clipped at the image edge, which softens over the last few percent,
	  so the ring reads as a half circle sitting on the cut.
	*/
	.rear-bike {
		position: relative;
		overflow: hidden;
		transform-origin: 50% 100%;
		-webkit-mask-image: linear-gradient(#000 95%, transparent);
		mask-image: linear-gradient(#000 95%, transparent);
	}

	.rear-bike img {
		display: block;
		width: 100%;
	}

	.hub {
		position: absolute;
		left: 39.8%;
		top: 94%;
		width: 19%;
		overflow: visible;
		transform: translate(-50%, -50%);
	}

	.hub-ring,
	.hub-dots-ring {
		fill: none;
		stroke: var(--cyan);
	}

	.hub-ring {
		stroke-width: 2.2;
		stroke-dasharray: 100;
		filter: drop-shadow(0 0 3px rgba(69, 227, 238, 0.6));
	}

	/* 30 round dots that keep circling the hub once it has landed */
	.hub-dots-ring {
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-dasharray: 0 3.3333;
		transform-box: fill-box;
		transform-origin: center;
		animation: hub-scan 16s linear infinite;
	}

	@keyframes hub-scan {
		to {
			transform: rotate(360deg);
		}
	}

	/* ---------- narrow screens: text on top, bike below ---------- */
	@media (max-aspect-ratio: 1 / 1) {
		.odyssey {
			--scene-w: 190vw;
			--focus-x: 0.64;
		}

		.scene {
			top: auto;
			bottom: 12svh;
		}

		/* the render's top edge sits mid-screen here, so fade it in as well */
		.bike {
			-webkit-mask-image:
				linear-gradient(90deg, #000 93%, transparent), linear-gradient(transparent, #000 18%);
			-webkit-mask-composite: source-in;
			mask-image:
				linear-gradient(90deg, #000 93%, transparent), linear-gradient(transparent, #000 18%);
			mask-composite: intersect;
		}

		nav {
			display: none;
		}

		.home {
			top: 13svh;
			width: auto;
			right: 1.25rem;
			transform: none;
		}

		.specs {
			display: flex;
			justify-content: space-between;
			padding: 0 1.25rem;
		}

		.spec {
			position: relative;
			left: auto !important;
		}

		.back {
			left: 1.25rem;
			top: 5.5rem;
		}

		.panel {
			left: 0;
			background: linear-gradient(90deg, rgba(0, 0, 0, 0.55), #000 55%);
		}

		.lead {
			padding: 9rem 1.25rem 0;
		}

		.cols {
			grid-template-columns: 1fr;
		}

		.rear-copy {
			right: 1.25rem;
			width: auto;
			justify-content: flex-start;
			gap: 2rem;
			padding: 8rem 0 0 2.2rem;
		}

		.rear-art {
			top: auto;
			bottom: 16svh;
			right: 1.25rem;
			width: 72vw;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chev,
		.tip,
		nav a span,
		.buy rect,
		.play-ring,
		.back circle,
		.back span {
			transition: none;
		}

		.hub-dots-ring {
			animation: none;
		}
	}
</style>
