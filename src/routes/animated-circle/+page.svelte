<main>
	<div class="container">
		<div class="circles">
			{#each { length: 12 }, i}
				<div style:--i={i + 1}></div>
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		background: rgb(1, 17, 4);
		min-height: 100vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.container {
		--angle: 0deg;
		--offset: calc(360deg / 24);
		--radius: 25vmin;
		transform: rotateX(45deg) rotateY(0deg);

		position: relative;
		aspect-ratio: 1;
		width: calc(var(--radius) * 2);
		color: #a4b4ff;
		border-radius: 50%;
		border: 2px solid #a4b4ff;
		transform-style: preserve-3d;
	}

	.circles {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		> * {
			--angle-offset: calc(var(--i) * var(--offset));
			--circle-diameter: calc(cos(calc(var(--angle) + var(--angle-offset))) * var(--radius));
			--hsl: calc(180 + (10 * var(--i))) 100% 50%;
			position: absolute;
			inset: 0;
			background: radial-gradient(
				circle at 50%,
				hsl(var(--hsl)) var(--circle-diameter),
				transparent var(--circle-diameter)
			);
			transform: translateZ(calc(var(--i) * 4vmin));
		}
	}
</style>
