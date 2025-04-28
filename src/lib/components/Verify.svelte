<script lang="ts">
	import { animate,easeOut,stagger } from "motion";

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
    animate(".intro > *, .form-items > *, .buttons > button", {
      opacity: [0, 1],
      y: [50, 0],
    }, {delay: stagger(.2), duration: .25, ease: easeOut})
  })

</script>

<div class="grid place-items-center space-y-8 text-[#333333]">
  <div class="grid space-y-2 text-center intro">
    <h1 class="text-2xl font-bold">Verify Seed Phrase</h1>
    <p class="text-[#3333338f] text-sm font-medium">Select the correct words in the right order to verify you've saved your seed phrase.</p>
  </div>

  <form class="flex items-center text-sm text-center gap-8 w-full form-items">
    <div>
      <label for="wordOne" class="text-[#3333338f]">Word #3</label>
      <input type="text" bind:value={formState.wordOne} class="rounded-xl bg-[#EAECF0] border border-transparent w-full py-3 px-8 flex justify-center" />
    </div>
    <div>
      <label for="wordTwo" class="text-[#3333338f]">Word #12</label>
      <input type="text" bind:value={formState.wordTwo} class="rounded-xl bg-[#EAECF0] w-full py-3 px-8 flex justify-center" />
    </div>
    <div>
      <label for="wordThree" class="text-[#3333338f]">Word #7</label>
      <input type="text" bind:value={formState.wordThree} class="rounded-xl bg-[#EAECF0] w-full py-3 px-8 flex justify-center" />
    </div>
  </form>
  <div class="flex items-center gap-8 w-full form-items">
    {#each PHRASES as word}
      <div class="flex justify-center py-3 w-full rounded-xl border border-[#EAECF0]">
        <p class="text-sm font-semibold">{word}</p>
      </div>
    {/each}
  </div>
  <div class="flex items-center gap-4 w-full buttons">
    <button onclick={prevStep} class="py-2 rounded-xl bg-white border border-[#EAECF0] w-full text-sm cursor-pointer" aria-label="back">
      Back
    </button>
    <button {onclick} class='py-2 rounded-xl text-white bg-[#4D83EE] w-full text-sm cursor-pointer' aria-label="verify">
      Verify
    </button>
  </div>
</div>