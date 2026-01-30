<script>
	import { gsap } from 'gsap';
	// import Lenis from 'lenis';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import cardImageOne from '$lib/assets/images/row-1-column-1.png';
	import cardImageTwo from '$lib/assets/images/row-1-column-2.png';
	import cardImageThree from '$lib/assets/images/row-1-column-3.png';
	import Lenis from 'lenis';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	let cardContainer = $state();
	let stickyHeader = $state();
	let stickySection = $state();
	let cardOne = $state();
	let cardTwo = $state();
	let cardThree = $state();

	let isGapAnimationCompleted = $state(false);
	let isFlipAnimationCompleted = $state(false);
	let resizeTimer = $state();

	function initAnimation() {
		console.log('initAnimation');
		// kill all scroll triggers instances
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

		const mm = gsap.matchMedia();

		mm.add('(max-width: 999px)', () => {
			// Clear any GSAP-applied styles on mobile to prevent conflicts with CSS
			if (stickyHeader) gsap.set(stickyHeader, { clearProps: 'all' });
		});

		mm.add('(min-width: 1000px)', () => {
			ScrollTrigger.create({
				trigger: stickySection,
				start: 'top top',
				end: `+=${window.innerHeight * 4}px`,
				pin: true,
				pinSpacing: true,
				scrub: 1,
				onUpdate: (self) => {
					const progress = self.progress;
					if (progress >= 0.1 && progress <= 0.25) {
						// Map raw progress (0.1 to 0.25) to a clean 0 to 1 range
						const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
						const yValue = gsap.utils.mapRange(0, 1, 80, 0, headerProgress);
						const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

						gsap.set(stickyHeader, {
							y: yValue, // Slides smoothly from 40 to 0
							opacity: opacityValue // Fades smoothly from 0 to 1
						});
					} else if (progress < 0.1) {
						gsap.set(stickyHeader, { y: 80, opacity: 0 });
					} else if (progress > 0.25) {
						gsap.set(stickyHeader, { y: 0, opacity: 1 });
					}

					if (progress <= 0.25) {
						const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
						gsap.set(cardContainer, { width: `${widthPercentage}%` });
					} else {
						gsap.set(cardContainer, { width: '60%' });
					}

					if (progress >= 0.35 && !isGapAnimationCompleted) {
						gsap.to(cardContainer, {
							gap: '20px',
							duration: 0.5,
							ease: 'power3.out'
						});

						gsap.to([cardOne, cardTwo, cardThree], {
							borderRadius: '20px',
							duration: 0.5,
							ease: 'power3.out'
						});

						isGapAnimationCompleted = true;
					} else if (progress < 0.35 && isGapAnimationCompleted) {
						gsap.to(cardContainer, {
							gap: '0px',
							duration: 0.5,
							ease: 'power3.out'
						});

						gsap.to(cardOne, {
							borderRadius: '20px 0px 0px 20px',
							duration: 0.5,
							ease: 'power3.out'
						});

						gsap.to(cardTwo, {
							borderRadius: '0px',
							duration: 0.5,
							ease: 'power3.out'
						});

						gsap.to(cardThree, {
							borderRadius: '0px 20px 20px 0px',
							duration: 0.5,
							ease: 'power3.out'
						});

						isGapAnimationCompleted = false;
					}

					if (progress >= 0.7 && !isFlipAnimationCompleted) {
						gsap.to([cardOne, cardTwo, cardThree], {
							rotationY: 180,
							duration: 0.5,
							ease: 'power3.inOut',
							stagger: 0.3
						});

						gsap.to([cardOne, cardThree], {
							y: 30,
							rotateZ: (i) => [-15, 15][i],
							duration: 0.5,
							ease: 'power3.inOut'
						});

						isFlipAnimationCompleted = true;
					} else if (progress < 0.7 && isFlipAnimationCompleted) {
						gsap.to([cardOne, cardTwo, cardThree], {
							rotationY: 0,
							duration: 0.5,
							ease: 'power3.inOut',
							stagger: -0.3
						});

						gsap.to([cardOne, cardThree], {
							y: 0,
							rotateZ: 0,
							duration: 0.5,
							ease: 'power3.inOut'
						});

						isFlipAnimationCompleted = false;
					}
				}
			});
		});
	}

	onMount(() => {
		initAnimation();
	});

	$effect(() => {
		// scroll trigger and lenis both rely on screen dimensions to calciulate distances and scroll ranges
		// so we need to update them when the screen size changes
		const handleResize = () => {
			console.log('resize');
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				initAnimation();
			}, 250);
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		const lenis = new Lenis();
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);
	});
</script>

<main>
	<section class="intro">
		<h1>Every Idea begins as a single image</h1>
	</section>
	<section class="sticky" bind:this={stickySection}>
		<div class="sticky-header">
			<h1 bind:this={stickyHeader}>Three pillars with one purpose</h1>
		</div>
		<div class="card-container" bind:this={cardContainer}>
			<div class="card" id="card-1" bind:this={cardOne}>
				<div class="card-front">
					<img src={cardImageOne} alt="card 1" />
				</div>
				<div class="card-back">
					<span>(01)</span>
					<p>Interactive Web Experience</p>
				</div>
			</div>
			<div class="card" id="card-2" bind:this={cardTwo}>
				<div class="card-front">
					<img src={cardImageTwo} alt="card 2" />
				</div>
				<div class="card-back">
					<span>(02)</span>
					<p>Interactive Web Experience</p>
				</div>
			</div>
			<div class="card" id="card-3" bind:this={cardThree}>
				<div class="card-front">
					<img src={cardImageThree} alt="card 3" />
				</div>
				<div class="card-back">
					<span>(03)</span>
					<p>Interactive Web Experience</p>
				</div>
			</div>
		</div>
	</section>
	<section class="outro">
		<h1>Every transition leaves a trace</h1>
	</section>
</main>

<style>
	:root {
		--bg: #0f0f0f;
		--fg: #fff;
		--card-1: #b2b2b2;
		--card-2: #ce2017;
		--card-3: #2f2f2f;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	h1 {
		font-size: 4rem;
		font-weight: 500;
		line-height: 1;
	}

	p {
		font-size: 2rem;
		font-weight: 500;
		line-height: 1;
	}

	section {
		position: relative;
		width: 100%;
		height: 100svh;
		background-color: var(--bg);
		color: var(--fg);
	}

	.intro,
	.outro {
		text-align: center;
		align-content: center;
	}

	.sticky {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sticky-header {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.sticky-header h1 {
		position: relative;
		text-align: center;
		will-change: transform, opacity;
		transform: translateY(40px);
		opacity: 0;
	}

	.card-container {
		position: relative;
		width: 75%;
		display: flex;
		perspective: 1000px;
		transform: translateY(40px);
		will-change: width;
	}

	.card {
		position: relative;
		flex: 1;
		aspect-ratio: 5/7;
		transform-style: preserve-3d;
		transform-origin: top;
	}

	#card-1 {
		border-radius: 20px 0 0 20px;
	}

	#card-3 {
		border-radius: 0 20px 20px 0;
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: inherit;
		overflow: hidden;
	}

	.card-back {
		justify-content: center;
		align-items: center;
		text-align: center;
		transform: rotateY(180deg);
		padding: 2rem;
	}

	.card-back span {
		position: absolute;
		top: 2rem;
		left: 2rem;
		opacity: 0.4;
	}

	#card-1 .card-back {
		background-color: var(--card-1);
	}

	#card-2 .card-back {
		background-color: var(--card-2);
	}

	#card-3 .card-back {
		background-color: var(--card-3);
	}

	@media (max-width: 1000px) {
		h1 {
			font-size: 3rem;
		}

		.intro h1,
		.outro h1 {
			width: 100%;
		}

		.sticky {
			height: max-content;
			padding: 4rem 2rem;
			flex-direction: column;
		}

		.sticky-header {
			position: relative;
			top: 0;
			left: 0;
			transform: none;
			margin-bottom: 4rem;
		}

		.sticky-header h1 {
			width: 100%;
			flex-direction: column;
			gap: 2rem;
		}

		.card-container {
			width: 100%;
			flex-direction: column;
			gap: 2rem;
		}

		.card {
			width: 100%;
			max-width: 400px;
			margin: 0 auto;
			border-radius: 20px !important;
		}

		#card-1,
		#card-2,
		#card-3 {
			transform: none;
		}
	}
</style>
