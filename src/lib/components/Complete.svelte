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
  <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-20">
    <rect x="0.5" width="100" height="100" rx="50" fill="#E2FBE9"/>
    <path d="M65.6458 65.1667H65.6663M65.6458 65.1667C64.2966 66.5046 61.8515 66.1714 60.1368 66.1714C58.0321 66.1714 57.0185 66.583 55.5164 68.0852C54.2374 69.3644 52.5227 71.6667 50.4997 71.6667C48.4767 71.6667 46.762 69.3644 45.4829 68.0852C43.9808 66.583 42.9672 66.1714 40.8625 66.1714C39.1478 66.1714 36.7027 66.5046 35.3536 65.1667C33.9936 63.8181 34.3283 61.3629 34.3283 59.6371C34.3283 57.4564 33.8514 56.4536 32.2983 54.9006C29.9881 52.5905 28.8331 51.4352 28.833 50C28.833 48.5646 29.9881 47.4095 32.2983 45.0994C33.6846 43.713 34.3283 42.3393 34.3283 40.3628C34.3283 38.6481 33.9951 36.203 35.333 34.8538C36.6816 33.4939 39.1368 33.8286 40.8625 33.8286C42.8389 33.8286 44.2127 33.1849 45.599 31.7986C47.9092 29.4884 49.0643 28.3333 50.4997 28.3333C51.9351 28.3333 53.0901 29.4884 55.4002 31.7986C56.7863 33.1847 58.1599 33.8286 60.1368 33.8286C61.8515 33.8286 64.2968 33.4954 65.646 34.8333C67.0058 36.1819 66.671 38.6371 66.671 40.3628C66.671 42.5436 67.1481 43.5463 68.701 45.0994C71.0113 47.4095 72.1663 48.5646 72.1663 50C72.1663 51.4352 71.0113 52.5905 68.701 54.9006C67.1479 56.4536 66.671 57.4564 66.671 59.6371C66.671 61.3629 67.0058 63.8181 65.6458 65.1667Z" stroke="#5EC26A" stroke-width="3.25"/>
    <path d="M44 51.9346L47.9 55.4167L57 44.5833" stroke="#5EC26A" stroke-width="3.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <h1 class="text-2xl text-black font-bold">Wallet created</h1>
  <p class="text-[#333333] text-center text-sm">Your non-custodial wallet has been successfully created and secured with your seed phrase.</p>
</article> 

<button {onclick} class="w-full text-white bg-[#4D83EE] py-2 rounded-xl text-sm" aria-label="get started">Go to my wallet</button>