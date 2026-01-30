<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut, quadOut } from 'svelte/easing';
	import type { TransitionConfig } from 'svelte/transition';
	import { animate } from 'motion';
	import ArchivePost from '$lib/components/ArchivePost.svelte';
	import Tween from '$lib/components/Tween.svelte';
	import Box from '$lib/components/Box.svelte';
	import Attachment from '$lib/components/Attachment.svelte';

	let visible = $state(false);

	let animation: any = $state();

	const chars = '!@#$%&*1234567890-=_+[]{}|;:,.<>/?';

	function getRandomChar() {
		return chars[Math.floor(Math.random() * chars.length)];
	}

	function customRage(
		node: HTMLElement,
		options: { duration?: number; delay?: number; easing?: (t: number) => number } = {}
	) {
		const { duration = 3000, delay = 0, easing = quadOut } = options;

		return {
			duration,
			delay,
			easing,
			css: (t: number, u: number) => `
        transform: scale(${t}) rotate(${t * 200});
        color: hsl(${4 * t}, ${u * 40}%, 80%)
      `
		};
	}

	function customMotion(node: HTMLElement, params: { duration?: number } = {}): TransitionConfig {
		const { duration = 100 } = params;

		return {
			duration,
			tick: (t: number) => {
				const eased = cubicInOut(t);

				// console.log(node);

				animate(
					node,
					{
						y: 50,
						rotate: `${eased * 360}deg`,
						color: `hsl(${eased * 360}, 80%, 70%)`
					},
					{ duration }
				);
			}
		};
	}

	function scrambleText(node: HTMLElement, options?: { duration?: number }) {
		const { duration = 4000 } = options || {};
		const originalText = node.textContent;
		const length = originalText.length;

		return {
			duration,
			tick: (t: number) => {
				let output = '';
				for (let i = 0; i < length; i++) {
					if (t > i / length) {
						output += originalText[i];
					} else {
						output += getRandomChar();
					}
				}

				node.textContent = output;
			}
		};
	}
</script>

<div class="font-2xl min-h-screen bg-black text-white">
	<button class="m-10 border border-white px-9 py-2" onclick={() => (visible = !visible)}>
		take a look
	</button>
	<!-- <Attachment /> -->
	<!-- <Box
		bind:tween={animation}
		vars={{ rotation: 90, x: 500, duration: 4, backgroundColor: 'blue', borderRadius: '1rem' }}
	>
		<button class="size-32 rounded-e-2xl bg-green-500" onclick={() => animation.restart()}>
			Run it
		</button>
	</Box> -->

	<!-- <h2 in:customRage>Against the machine</h2> -->

	<h3 transition:customMotion class="font-3xl text-green-500">With motion</h3>

	<!-- {#key visible}
		<h3 class="text-4xl text-amber-300" in:scrambleText>Espionage</h3>
	{/key} -->
	<div>
		<ArchivePost />
	</div>
	<div>
		<Tween />
	</div>
</div>
