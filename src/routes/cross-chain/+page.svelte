<script lang='ts'>
  let activeTab = $state(false)

</script>

<main class="text-[#333333] text-center grid space-y-4">
  <article class="grid space-y-2">
    <h1 class="text-3xl">Cross-Chain USDC Transfer</h1>
    <h2 class="text-sm text-[#3333338f]">Send USDC from Solana to Ethereum using ENS resolution</h2>
  </article>
  <div class="relative flex">
    <div class="grid place-items-center">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-width="2"/>
        <circle cx="14" cy="14" r="4" fill="#333333"/>
      </svg>
      <p>Resolve ENS</p>  
    </div>
    <svg width="210" height="2" viewBox="0 0 210 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.99707" y1="1" x2="208.997" y2="1" stroke="#D0D5DD" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
    </svg>
    <div class="grid place-items-center">
      {#if activeTab}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-width="2"/>
          <circle cx="14" cy="14" r="4" fill="#333333"/>
        </svg>
      {:else}
        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.49707" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-opacity="0.5" stroke-width="2"/>
          <circle cx="14.4971" cy="14" r="3.5" stroke="#333333" stroke-opacity="0.5" stroke-linecap="round" stroke-dasharray="6 6"/>
        </svg>
      {/if}
      <p>Enter amount</p>  
    </div>
    <svg width="210" height="2" viewBox="0 0 210 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.99707" y1="1" x2="208.997" y2="1" stroke="#D0D5DD" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
    </svg>
    <div class="grid place-items-center">
      {#if activeTab}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-width="2"/>
          <circle cx="14" cy="14" r="4" fill="#333333"/>
        </svg>
      {:else}
        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.49707" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-opacity="0.5" stroke-width="2"/>
          <circle cx="14.4971" cy="14" r="3.5" stroke="#333333" stroke-opacity="0.5" stroke-linecap="round" stroke-dasharray="6 6"/>
        </svg>
      {/if}
      <p>Confirm transfer</p>  
    </div>  
  </div>
  <div class="flex justify-between items-center">
    <select name="from chain" id="">
      <option value="Solana">
        Solana
        <!-- <span class=""></span> -->
        <!-- <p>Solana</p> -->
      </option>
    </select>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#E7EAEE"/>
      <path d="M10.75 16H21.25M21.25 16L16 10.75M21.25 16L16 21.25" stroke="#333333" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <select name="to chain" id="">
      <option value="Ethereum">
        Solana
        <!-- <span class=""></span> -->
        <!-- <p>Solana</p> -->
      </option>
    </select>
  </div>
  <div>
    <h3>Connect Wallet</h3>
    <button class="rounded-lg px-4 py-2">Connect Solana Wallet</button>
  </div>
</main>