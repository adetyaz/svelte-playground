<script lang="ts">
	import type { Snippet } from "svelte";
  import { createState, State } from "../../routes/state.svelte";

  let {name, fakeName = null, 
  // children, secondChild
  }: {name: string, fakeName?: string | null, 
  // children: Snippet, secondChild: Snippet
  } = $props()


  const myState = createState()

  const myClassState = new State()

</script>

<header>
  <h1 class="text-2xl text-blue-300">Yellow header {name}</h1>
  <!-- <h2>Otherwise {name.replace('t', 'Y')}</h2>
  <h3>{fakeName}</h3> -->
  <div class="flex items-center gap-4">
    <button onclick={myState.up} class="bg-blue-400 border-none rounded px-4 py-2 text-white ">{myState.value}</button>
    <button onclick={() => myState.value = 10} class="bg-blue-400 border-none rounded px-4 py-2 text-white ">{myState.value}</button>  
    <button onclick={() => myClassState.up()} class="bg-blue-400 border-none rounded px-4 py-2 text-white ">{myClassState.value}</button>  
  </div>
  <!-- {@render children()}
  {@render secondChild('scott')} -->
</header>