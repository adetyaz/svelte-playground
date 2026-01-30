<script>
	import { Tween, Spring } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const size = new Tween(50, {
		delay: 200,
		duration: 800,
		easing: cubicOut
	});

	const spring = new Spring(50, {
		stiffness: 0.1,
		damping: 0.25,
		precision: 0.1
	});

	async function onMouseDown() {
		size.target = 150;
	}

	async function onMouseUp() {
		size.target = 50;
	}
</script>

<div class="align-center flex justify-between">
	<svg width="400" height="400" viewBox="0 0 400 400">
		<circle
			role="button"
			tabindex="0"
			onmousedown={onMouseDown}
			onmouseup={onMouseUp}
			cx="200"
			cy="200"
			r={size.current}
			fill="orangered"
		/>
	</svg>
	<svg width="400" height="400" viewBox="0 0 400 400">
		<circle
			role="button"
			tabindex="0"
			onmousedown={() => (spring.target = 150)}
			onmouseup={() => (spring.target = 50)}
			cx="200"
			cy="200"
			r={spring.current}
			fill="orangered"
		/>
	</svg>
</div>
