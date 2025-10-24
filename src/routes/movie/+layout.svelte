<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { gsap } from 'gsap';
	import { Flip } from 'gsap/Flip';

	gsap.registerPlugin(Flip);

	let state: Flip.FlipState | null;

	beforeNavigate(() => {
		console.log('BEFORE NAVIGATE');
		state = Flip.getState('.cover, .title');
		console.log('BEFORE NAVIGATE', state);
	});

	afterNavigate(() => {
		console.log('AFTER NAVIGATE', state)
		Flip.from(state!, { 
      
      targets: '.cover, .title',
      duration: 0.5, ease: 'power1.inOut', scale: true})

	});

	let { children } = $props();
</script>

<h1 class="bg-blue-950 py-8">Movie Layout</h1>

{@render children()}

<style>
	h1 {
		color: hsl(357 92% 47%);
		text-transform: uppercase;
		margin-bottom: 3rem;
	}
</style>
