<script lang="ts">
	import { animate } from "motion";

  let {onclick, prevStep} = $props()

  let formState: Record<string, string > = $state({
    wordOne: '',
    wordTwo: '',
    wordThree: '',
  })

  const WORDS = [
    'Red',
    'Ultra',
    'Sonic'
  ]

  const PHRASES = [
    'Metal',
    'Hand',
    'See'
  ]

  $effect(() => {
    animate('.incorrect', {
      x: [-10, 0, 10, 0],
    }, {
      duration: .8
    })
  })

</script>

<div class="grid place-items-center space-y-4">
  <h1 class="text-2xl text-black font-bold">Verify Seed Phrase</h1>
  <p class="text-[#333333] text-center text-sm">Select the correct words in the right order to verify you've saved your seed phrase.</p>

  <form class="flex items-center gap-8 w-full text-black">
    <div>
      <label for="wordOne" class="text-sm text-[#333333] text-center">Word #3</label>
      <input type="text" bind:value={formState.wordOne} class={`rounded-xl bg-[#EAECF0] border border-transparent w-full py-3 px-8 `} />
    </div>
    <div>
      <label for="wordTwo" class="text-sm text-[#333333] text-center">Word #12</label>
      <input type="text" bind:value={formState.wordTwo} class="rounded-xl bg-[#EAECF0] w-full py-3 px-8" />
    </div>
    <div>
      <label for="wordThree" class="text-sm text-[#333333] text-center">Word #7</label>
      <input type="text" bind:value={formState.wordThree} class="rounded-xl bg-[#EAECF0] w-full py-3 px-8" />
    </div>
  </form>
  <div class="flex items-center gap-8 w-full text-black">
    {#each PHRASES as word}
      <div class="flex justify-center py-3 w-full rounded-xl border border-[#EAECF0]">
        <p class="text-sm font-semibold">{word}</p>
      </div>
    {/each}
  </div>
  <div class="flex items-center gap-4 w-full">
    <button onclick={prevStep} class="text-black py-2 rounded-xl bg-white border border-[#EAECF0] w-full text-sm" aria-label="back">
      Back
    </button>
    <button {onclick} class="py-2 rounded-xl text-white bg-[#4D83EE] w-full text-sm" aria-label="verify">
      Verify
    </button>
  </div>
</div>