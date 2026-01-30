<script lang="ts">
	import { gsap } from 'gsap';

	function tween(vars: gsap.TweenVars, ref?: (tween: gsap.core.Tween) => void) {
		let tween: gsap.core.Tween;

		return (target: Element) => {
			tween = gsap.to(target, vars);
			ref?.(tween);
			return () => tween.kill();
		};
	}

	let animation: gsap.core.Tween | undefined = $state();
</script>

<button
	class="size-40 rounded-4xl bg-blue-700"
	{@attach tween({ rotate: 360, duration: 2 }, (tween) => (animation = tween))}
	onclick={() => animation?.restart()}
>
	Play
</button>
