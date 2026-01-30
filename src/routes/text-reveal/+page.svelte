<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(SplitText, ScrollTrigger);

	let colorInitial = $state('#dddddd');
	let colorAccent = $state('#abff02');
	let colorFinal = $state('#ffffff');

	let container = $state();
	let splitRefs = $state([]);

	onMount(() => {
		if (!container) return;

		let elements = [];
		if (container.hasAttribute('data-copy-wrapper')) {
			elements = Array.from(container.children);
		} else {
			elements = [container];
		}

		const ctx = gsap.context(() => {
			document.fonts.ready.then(() => {
				elements.forEach((element) => {
					const wordSplit = new SplitText(element, {
						type: 'words',
						wordsClass: 'word'
					});
					const charSplit = new SplitText(wordSplit.words, {
						type: 'chars',
						charsClass: 'char'
					});
					splitRefs.push({ wordSplit, charSplit });
				});

				const allChars = splitRefs.flatMap(({ charSplit }) => charSplit.chars);
				gsap.set(allChars, { color: colorInitial });

				// Internal state for the animation logic
				let lastScrollProgress = 0;
				const settledIndices = new Set();
				const activeTimers = new Map();

				const scheduleFinalTransition = (char, index) => {
					if (activeTimers.has(index)) {
						clearTimeout(activeTimers.get(index));
					}

					const timer = setTimeout(() => {
						if (!settledIndices.has(index)) {
							gsap.to(char, {
								duration: 0.15,
								ease: 'none',
								color: colorFinal,
								onComplete: () => {
									settledIndices.add(index);
								}
							});
						}
						activeTimers.delete(index);
					}, 120);
					activeTimers.set(index, timer);
				};

				ScrollTrigger.create({
					trigger: container,
					start: 'top 85%',
					end: 'bottom 15%',
					scrub: true,
					onUpdate: (self) => {
						const progress = self.progress;
						const totalChars = allChars.length;
						const isScrollingDown = progress >= lastScrollProgress;
						const currentCharIndex = Math.floor(progress * totalChars);

						allChars.forEach((char, index) => {
							// Scrolling up: reset characters ahead of reveal
							if (!isScrollingDown && index > currentCharIndex) {
								if (activeTimers.has(index)) {
									clearTimeout(activeTimers.get(index));
									activeTimers.delete(index);
								}
								settledIndices.delete(index);
								gsap.set(char, { color: colorInitial });
								return;
							}

							if (settledIndices.has(index)) return;

							// Scrolling down: glow then settle
							if (index <= currentCharIndex) {
								gsap.set(char, { color: colorAccent });
								if (!activeTimers.has(index)) {
									scheduleFinalTransition(char, index);
								}
							} else {
								gsap.set(char, { color: colorInitial });
							}
						});

						lastScrollProgress = progress;
					}
				});
			});
		}, container);

		return () => ctx.revert();
	});
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-black px-52 pt-12">
	<h1 class="mb-12 text-6xl text-white capitalize">roster</h1>

	<article class="text-xl" data-copy-wrapper="true" bind:this={container}>
		<p>
			2. The Stacking Order The word "purpose" is actually there, but it is on the second line. You
			can't see it because of the DOM order: In your HTML, .sticky-header comes before the
			.card-container. In CSS, elements that appear later in the code are naturally "higher" in the
			stack. The .card-container is sitting right in the middle of the screen. When your text wraps
			to a second line, that line is being hidden behind the cards. 3. The line-height: 1 Factor
			Because the line-height is set to exactly 1, there is no extra spacing between lines. This
			makes the text "hug" the cards even more tightly, leaving no room for the wrapped word to peek
			out from behind them. Summary of the "Connection": The browser thinks it only has half a
			screen for the text $\rightarrow$ it wraps "purpose" to line 2 $\rightarrow$ line 2 is
			physically covered by the cards because the cards are written after the header in your HTML.
		</p>
	</article>
</main>

<style>
	.page-container {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
	}

	:global(.char) {
		display: inline-block;
		will-change: color;
	}

	:global(.word) {
		display: inline-block;
		white-space: nowrap;
		margin-right: 0.25em;
	}
</style>
