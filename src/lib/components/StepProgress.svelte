<script lang="ts">

  let { step } = $props()
</script>

<section class="relative flex items-center justify-center gap-2 text-sm text-center">
  <div class="grid place-items-center">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="26" height="26" rx="13" stroke="#333333" stroke-width="2"/>
      <circle cx="14" cy="14" r="4" fill="#333333"/>
    </svg>
    <p>Resolve ENS</p>  
  </div>
  <svg width="210" height="2" viewBox="0 0 210 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0.99707" y1="1" x2="208.997" y2="1" stroke={`${step === 2 ? '#333333' : "#D0D5DD"}`} stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
  </svg>
  <div class="grid place-items-center">
    {#if step === 2}
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
    <line x1="0.99707" y1="1" x2="208.997" y2="1" stroke={`${step === 3 ? '#333333' : "#D0D5DD"}`} stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
  </svg>
  <div class="grid place-items-center">
    {#if step === 3}
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
</section>