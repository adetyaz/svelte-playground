<script lang='ts'>
	import SelectChain from "$lib/components/SelectChain.svelte";
import StepProgress from "$lib/components/StepProgress.svelte";

  
  let step = $state(2)
  let showAddress = $state(false)

</script>

<main class="text-[#333333]  my-auto px-4 w-screen overflow-x-hidden">
  <article class="grid space-y-2 my-8  text-center">
    <h1 class="text-3xl font-bold">Cross-Chain USDC Transfer</h1>
    <h2 class="text-xs sm:text-sm text-[#3333338f]">Send USDC from Solana to Ethereum using ENS resolution</h2>
  </article>
  <StepProgress {step} />
  <SelectChain />

  <div class="text-sm my-6">
    <h3>Connect Wallet</h3>
    <button class="rounded-lg border  px-4 py-2">Connect Solana Wallet</button>
  </div>
  <section class="text-sm">
    <div class="rounded-lg bg-[#33333321] p-1 flex items-center justify-between w-full">
      <button class="rounded-lg bg-white w-full py-2 basis-1/2">ENS Name</button>
      <p>Ethereum Address</p>
    </div>
    <div class="flex items-start bg-indigo-500 space-between my-8 w-[90%]">
      <div class="grid grid-cols-2">
        <form>
          <label for="ens name">ENS Name</label>
          <input type="text" class="text-sm rounded-lg w-fit px-4 py-2 border border-[#3333338f]" />
        </form>
        <button class="bg-[#4D83EE] text-white px-4">Resolve</button>
      </div>
      <form class="relative basis-1/2">
        <label for="amount">Amount (USDC)</label>
        <input type="text" class="text-sm rounded-xl px-4 py-2 border border-[#3333338f]" />
        <p class="absolute top-1/2 translate-y-1/2 right-4">USDC</p>
      </form>
    </div>
    {#if showAddress}
      <div class="p-2 bg-[#3333338f] rounded-xl">
        <p>Resolved address</p>
        <p class="flex gap-2">
          <span>0x0815b7be1a4acef8706f0b46f97057cb3461c0a1</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10C6 8.1144 6 7.1716 6.58579 6.58579C7.1716 6 8.1144 6 10 6H10.6667C12.5523 6 13.4951 6 14.0809 6.58579C14.6667 7.1716 14.6667 8.1144 14.6667 10V10.6667C14.6667 12.5523 14.6667 13.4951 14.0809 14.0809C13.4951 14.6667 12.5523 14.6667 10.6667 14.6667H10C8.1144 14.6667 7.1716 14.6667 6.58579 14.0809C6 13.4951 6 12.5523 6 10.6667V10Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.3334 6.00004C11.3318 4.02865 11.302 3.00751 10.7282 2.30833C10.6174 2.1733 10.4936 2.04949 10.3586 1.93868C9.62096 1.33337 8.52516 1.33337 6.3335 1.33337C4.14184 1.33337 3.04602 1.33337 2.30845 1.93868C2.17342 2.04949 2.04962 2.1733 1.9388 2.30833C1.3335 3.04589 1.3335 4.14172 1.3335 6.33337C1.3335 8.52504 1.3335 9.62084 1.9388 10.3584C2.04961 10.4934 2.17342 10.6172 2.30845 10.728C3.00764 11.3019 4.02877 11.3317 6.00016 11.3333" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </p>
      </div>
    {/if}
  </section>
  <button class="bg-[#4D83EE] text-white py-2 text-sm rounded-xl">Send USDC</button>
</main>