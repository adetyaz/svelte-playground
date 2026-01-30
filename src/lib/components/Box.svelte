<script lang="ts">
import {gsap} from 'gsap';


let { tween = $bindable(), vars, children} = $props()
let target: HTMLDivElement;


$effect(() => {
  tween = gsap.to(target, vars)

  return () => tween.kill()
})

</script>


<div>

<div class="size-80 bg-fuchsia-600 rounded-2xl" bind:this={target}>
  {@render children()}
</div>

</div>