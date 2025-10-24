<script lang="ts">
	import { gsap } from 'gsap';
	import { Flip } from 'gsap/Flip';
	import { tick } from 'svelte';

	gsap.registerPlugin(Flip);

	let items = $state([...Array(10).keys()]);

	function shuffle() {
		items = items.toSorted(() => Math.random() - 0.5);
	}

	$effect.pre(() => {
		items;
		const state = Flip.getState('.item');
		// queueMicrotask(() => {
		//   console.log('FLIP!')
		//   Flip.from(state, {duration: 1, stagger: 0.05, ease: 'power1.inOut'})
		// })
		tick().then(() => {
			console.log('TICK!');
			Flip.from(state, { duration: 1, stagger: 0.01, ease: 'power1.inOut' });
		});
	});
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-black/87 p-12">
	<div class="grid grid-cols-5 gap-2">
		{#each items as item (item)}
			<div
				class="item h-52 w-40 rounded-lg bg-indigo-950 p-2 shadow transition-all hover:shadow-white/14"
			>
				<div
					class="flex size-full flex-col items-center justify-center rounded border border-amber-600"
				>
					<div class="bg-orange-700 p-6 text-2xl font-bold text-white">{item}</div>
				</div>
			</div>
		{/each}
	</div>

	<button class="bg-orange-700 px-6 py-3 text-xl text-white" onclick={shuffle}> Shuffle </button>
</main>
