<script lang="ts">
  let {onclick, prevStep} = $props()
</script>

<div class="grid place-items-center space-y-4">
  <h1 class="text-2xl text-black font-bold">Backup Your Seed Phrase</h1>
  <p class="text-[#333333] text-center text-sm">Choose how you want to back up your seed phrase for extra security.</p>
  <div class="grid space-y-4">
    <div class="border border-[#EAECF0] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.625 14.239V15.375H3.76104C4.68073 15.375 5.14058 15.375 5.55406 15.2037C5.96755 15.0325 6.2927 14.7073 6.94302 14.057L14.341 6.65901C15.0029 5.99709 15.3338 5.66612 15.3704 5.25994C15.3765 5.19279 15.3765 5.12523 15.3704 5.05808C15.3338 4.6519 15.0029 4.32093 14.341 3.65901C13.679 2.99709 13.3481 2.66612 12.9419 2.62954C12.8747 2.62349 12.8072 2.62349 12.74 2.62954C12.3338 2.66612 12.0029 2.99709 11.341 3.65901L3.94302 11.057C3.2927 11.7073 2.96755 12.0325 2.79627 12.446C2.625 12.8594 2.625 13.3193 2.625 14.239Z" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.125 4.875L13.125 7.875" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> 
       <h2 class="font-bold">Paper Backup</h2>
      </div>
      <p>Write down your seed phrase on paper and store it in a secure location.</p>
    </div>
    <div class="border border-[#EAECF0] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.20086 14.1335C3.36952 15.3862 4.4071 16.3676 5.66974 16.4257C6.7322 16.4745 7.81148 16.5 9 16.5C10.1885 16.5 11.2678 16.4745 12.3302 16.4257C13.5929 16.3676 14.6305 15.3862 14.7992 14.1335C14.9093 13.316 15 12.4782 15 11.625C15 10.7718 14.9093 9.93398 14.7992 9.11648C14.6305 7.86375 13.5929 6.88237 12.3302 6.82432C11.2678 6.77548 10.1885 6.75 9 6.75C7.81148 6.75 6.7322 6.77548 5.66974 6.82432C4.4071 6.88237 3.36952 7.86375 3.20086 9.11648C3.09079 9.93398 3 10.7718 3 11.625C3 12.4782 3.09079 13.316 3.20086 14.1335Z" stroke="#4D83EE" stroke-width="1.125"/>
          <path d="M5.625 6.75V4.875C5.625 3.01104 7.13604 1.5 9 1.5C10.864 1.5 12.375 3.01104 12.375 4.875V6.75" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 11.6175V11.625" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 11.6175V11.625" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 11.6175V11.625" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>          
       <h2 class="font-bold">Hardware Wallet</h2>
      </div>
      <p>Store your seed phrase on a hardware wallet for maximum security.</p>
    </div>
    <div class="border border-[#EAECF0] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 12L15 10.5H7.89915C7.34692 9.38873 6.20015 8.625 4.875 8.625C3.01103 8.625 1.5 10.136 1.5 12C1.5 13.8639 3.01103 15.375 4.875 15.375C6.20014 15.375 7.3469 14.6113 7.89915 13.5H12.375L13.3125 12.5305L14.25 13.5H15L16.5 12Z" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.5 12H5.25" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.25 2.625V6.375" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.5 5.25V3.75C4.5 3.12868 5.00368 2.625 5.625 2.625C6.24632 2.625 6.75 3.12868 6.75 3.75V5.25C6.75 5.87132 6.24632 6.375 5.625 6.375C5.00368 6.375 4.5 5.87132 4.5 5.25Z" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 2.625V6.375" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.25 2.625V6.375" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.5 5.25V3.75C13.5 3.12868 14.0037 2.625 14.625 2.625C15.2463 2.625 15.75 3.12868 15.75 3.75V5.25C15.75 5.87132 15.2463 6.375 14.625 6.375C14.0037 6.375 13.5 5.87132 13.5 5.25Z" stroke="#4D83EE" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>    
       <h2 class="font-bold">Encrypted Backup</h2>
      </div>
      <p>Create an encrypted digital backup protected by a strong password.</p>
    </div>
  </div>
  <div class="flex items-center gap-4 w-full">
    <button onclick={prevStep} class="text-black py-2 rounded-xl bg-white border border-[#EAECF0] w-full text-sm" aria-label="back">
      Back
    </button>
    <button {onclick} class="py-2 rounded-xl text-white bg-[#4D83EE] w-full text-sm" aria-label="continue">
      Continue
    </button>
  </div>
</div>