
<script lang="ts">
  import { animate, easeOut, stagger } from "motion";
  
  let {onclick} = $props()

  $effect(() => {
    animate("article > *", {
      opacity: [0, 1],
      y: [50, 0],
    }, {delay: stagger(.2), duration: .25, ease: easeOut})

    animate("button", {
      opacity: [0, 1],
      y: [50, 0],
    }, {delay: 1, duration: .5, ease: easeOut})
  })

</script>



  <article class="grid space-y-2 place-items-center">
    <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-18">
      <rect x="0.5" width="100" height="100" rx="50" fill="#DEEAFC"/>
      <path d="M54.8333 30.5H35.3333C32.9401 30.5 31 32.4401 31 34.8333C31 37.2266 32.9401 39.1667 35.3333 39.1667H63.5C63.5 37.1517 63.5 36.1443 63.2786 35.3177C62.6775 33.0746 60.9254 31.3225 58.6824 30.7215C57.8558 30.5 56.8483 30.5 54.8333 30.5Z" stroke="#4D83EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31 34.8333V56.5C31 62.6282 31 65.6923 32.9038 67.5962C34.8076 69.5 37.8717 69.5 44 69.5H57C63.1282 69.5 66.1923 69.5 68.0962 67.5962C70 65.6923 70 62.6282 70 56.5V52.1667C70 46.0385 70 42.9743 68.0962 41.0705C66.1923 39.1667 63.1282 39.1667 57 39.1667H39.6667" stroke="#4D83EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 50H65.6666C64.6591 50 64.1554 50 63.7422 50.1107C62.6205 50.4112 61.7445 51.2872 61.444 52.4089C61.3333 52.8221 61.3333 53.3258 61.3333 54.3333C61.3333 55.3408 61.3333 55.8446 61.444 56.2578C61.7445 57.3794 62.6205 58.2554 63.7422 58.556C64.1554 58.6667 64.6591 58.6667 65.6666 58.6667H70" stroke="#4D83EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h1 class="text-2xl font-bold">Create your wallet</h1>
    <p class="text-[#3333338f] text-center text-sm">Welcome to your new non-custodial wallet. You're about to create <br class="hidden xl:block" /> a secure wallet that only you control.</p>
  </article>
  
  <button {onclick} class="cursor-pointer w-full text-white bg-[#4D83EE] py-2 rounded-xl text-sm" aria-label="get started">Get started</button>
  