<script lang="ts">
	import { tick } from 'svelte';
	import { Flip } from 'gsap/Flip';
	import { gsap } from 'gsap';

	type Layout = 'stack' | 'grid';

	let layout: Layout = $state('stack');
	let circleEl: HTMLElement | null = $state(null);
	let swap = $state(false);
  let selected = $state(0)

	gsap.registerPlugin(Flip);


    async function flipGrid(id: number){
      selected = id

      const state = Flip.getState('.grid-item');
      await tick()

      const tl = Flip.from(state, {
        duration: 0.05,
        ease: 'power1.Out',
        absolute: true,
        onStart: () => {
          gsap.to('.title', { opacity: 0, y: '100%', duration: 0.5, ease: 'power1.out' })
        },
      })

      tl.to('.details .title', { y: 0, opacity: 1, duration: 0.5 }, 0)
    }

	async function flip() {

		const first = circleEl?.getBoundingClientRect();
		layout === 'grid' ? (layout = 'stack') : (layout = 'grid');

		const state = Flip.getState('.circle', {
			props: 'borderRadius'
		});

		swap = !swap;
		await tick();
		Flip.from(state, {
			duration: 0.5,
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'power1.inOut'
		});
		// requestAnimationFrame(() => {
		const last = circleEl?.getBoundingClientRect();

		if (first && last) {
			const invert = first.left - last.left;

			console.log('First:', first, 'Last:', last);
			console.log('Invert', invert);

			circleEl?.animate(
				[{ translate: `${invert}px` }, { translate: '0px', background: 'yellow' }],
				{
					duration: 2000,
					fill: 'forwards',
					easing: 'ease-out'
				}
			);
		}
		// });
	}
</script>

<svelte:document onclick={flip} />

<main class="min-h-screen bg-indigo-950 p-12">
	<h1 class="text-center text-2xl text-white">Flip a Coin</h1>
	<div class="flex items-center justify-between py-18">
		<div
			class="flex size-72 items-center justify-center rounded border-2 border-dashed border-white"
		>
			{#if !swap}
				<div
					class="flex size-20 items-center justify-center rounded-full bg-fuchsia-50 text-base text-gray-800"
					bind:this={circleEl}
				>
					first
				</div>
			{/if}
		</div>
		<div
			class="flex size-72 items-center justify-center rounded border-2 border-dashed border-white"
		>
			{#if swap}
				<div
					class="flex size-20 items-center justify-center rounded-full bg-fuchsia-200 text-base text-gray-800"
					bind:this={circleEl}
				>
					second
				</div>
			{/if}
		</div>
	</div>

	<div>
		<div class="container">
			<div data-layout={layout}>
				{#each { length: 10 } as _, id}
					<img class="circle" src="https://picsum.photos/100/100?random={id}" alt="Placeholder" />
				{/each}
			</div>
		</div>
	</div>

  <div class="grid">
	{#each { length: 8 } as _, id}
		{@const details = selected === id}
		{@const number = id + 1}

		<button
			class="grid-item"
			class:details
			onclick={() => flipGrid(id)}
		>
			<div class="title">
				<h1 class="text-red-500">Image {number}</h1>
			</div>

			<img
				src="https://picsum.photos/600/600?random={id}"
				alt="Placeholder"
			/>
		</button>
	{/each}
</div>

</main>

<style>
	h1 {
    z-index: 10;
		position: absolute;
		top: 20%;
		left: 50%;
		translate: -50%;
		text-transform: capitalize;
	}

	.container {
		height: 100vh;
		display: grid;
		place-content: center;
		cursor: pointer;
	}

	.circle {
		width: 100px;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 4px solid hsl(220 10% 10%);
	}


  .grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.grid-item {
		position: relative;
		padding: 0;
		background: none;
		border: none;
		overflow: hidden;
		cursor: pointer;
	}

	h1 {
		color: hsl(0, 0%, 100%);
		font-size: 2rem;
		text-transform: capitalize;
	}

	img {
		width: 100%;
		height: 100%;
		aspect-ratio: 16/9;
		display: block;
		object-fit: cover;
		border-radius: 4px;
	}

	.details {
		grid-row: span 2;
		grid-column: span 2;
	}

	.title {
		position: absolute;
		left: 60px;
		/* bottom: 0px; */
		/* opacity: 0;
		translate: 0% 100%; */
	}

	.details .title {
		opacity: 1;
		translate: 0%;
	}

	[data-layout='stack'] {
		display: flex;
	}

	[data-layout='stack'] .circle:not(:first-child) {
		margin-left: -40px;
	}

	[data-layout='grid'] {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	[data-layout='grid'] .circle {
		border-radius: 20%;
	}
</style>
