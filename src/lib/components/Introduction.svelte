<script lang="ts">
  import {animate, stagger} from "motion"
  let {onclick, prevStep} = $props()

  $effect(() => {
    animate(".intro > *, .intro-cards > *, .buttons > button", {
      opacity: [0, 1],
      y: [50, 0],
    }, {delay: stagger(.3), duration: .3})
  })
</script>

<div class="grid place-items-center space-y-4 intro">
  <div class="grid space-y-2 intro">
    <h1 class="text-2xl font-bold">Seed Phrase: Your wallet’s key</h1>
    <p class="text-[#3333338f] text-center text-sm">A seed phrase is a series of words that stores all the information <br />needed to recover your wallet.</p>
  </div>
  <div class="grid space-y-4 intro-cards">
    <div class="border border-[#EAECF0] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75282 7.785C6.94285 7.785 6.53785 8.37 6.44785 8.73C6.35785 9.09 6.35785 10.395 6.41185 10.935C6.59185 11.61 7.04185 11.889 7.48285 11.979C7.88782 12.015 9.59782 12.0015 10.0928 12.0015C10.8128 12.015 11.3528 11.745 11.5778 10.935C11.6228 10.665 11.6678 9.18 11.5553 8.73C11.3168 8.01 10.7228 7.785 10.2728 7.785H7.75282Z" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M7.6875 7.46891C7.6875 7.42391 7.69365 7.16484 7.6947 6.83891C7.69567 6.54109 7.6695 6.25391 7.8117 5.99111C8.3445 4.93091 9.8745 5.03891 10.2525 6.11891C10.318 6.29672 10.322 6.5786 10.32 6.83891C10.3175 7.17152 10.3245 7.46891 10.3245 7.46891" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15.75 8.38748V6.21022C15.75 4.98022 15.75 4.36521 15.4469 3.96397C15.1438 3.56272 14.4586 3.36792 13.088 2.97833C12.1517 2.71215 11.3262 2.39147 10.6667 2.09872C9.76755 1.69957 9.318 1.5 9 1.5C8.682 1.5 8.23245 1.69957 7.33328 2.09872C6.67379 2.39147 5.84838 2.71214 4.912 2.97833C3.54145 3.36792 2.85616 3.56272 2.55308 3.96397C2.25 4.36521 2.25 4.98022 2.25 6.21022V8.38748C2.25 12.6064 6.04708 15.1376 7.9455 16.1395C8.40082 16.3798 8.62845 16.5 9 16.5C9.37155 16.5 9.59918 16.3798 10.0545 16.1395C11.9529 15.1376 15.75 12.6064 15.75 8.38748Z" stroke="#4D83EE" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
       <div class="grid space-y-2">
         <h2 class="font-medium">Your security</h2>
         <p class="text-[#3333338f]">Your seed phrase is the master key to your funds. Never share it with anyone.</p>
       </div>
      </div>
      
    </div>
    <div class="border border-[#EAECF0] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.25 6.75V11.25H6.75V6.75H11.25Z" stroke="#4D83EE" stroke-width="1.125" stroke-linejoin="round"/>
          <path d="M11.25 11.25H13.5C14.7427 11.25 15.75 12.2573 15.75 13.5C15.75 14.7427 14.7427 15.75 13.5 15.75C12.2573 15.75 11.25 14.7427 11.25 13.5V11.25Z" stroke="#4D83EE" stroke-width="1.125" stroke-linejoin="round"/>
          <path d="M6.75 11.2515H4.5C3.25736 11.2515 2.25 12.2589 2.25 13.5015C2.25 14.7441 3.25736 15.7515 4.5 15.7515C5.74264 15.7515 6.75 14.7441 6.75 13.5015V11.2515Z" stroke="#4D83EE" stroke-width="1.125" stroke-linejoin="round"/>
          <path d="M11.25 6.75V4.5C11.25 3.25736 12.2573 2.25 13.5 2.25C14.7427 2.25 15.75 3.25736 15.75 4.5C15.75 5.74264 14.7427 6.75 13.5 6.75H11.25Z" stroke="#4D83EE" stroke-width="1.125" stroke-linejoin="round"/>
          <path d="M6.75 6.75V4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75H6.75Z" stroke="#4D83EE" stroke-width="1.125" stroke-linejoin="round"/>
          </svg>
       <div class="grid space-y-2">
         <h2 class="font-medium">Your responsibility</h2>
         <p class="text-[#3333338f]">If you lose your seed phrase, you'll permanently lose access to your wallet.</p>
        </div>
      </div>
    </div>
    <div class="border border-[#D69554] p-2 rounded-xl grid space-y-2 text-sm text-[#333333]">
      <div class="flex gap-2 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.99129 7.2622C5.80155 4.05899 6.70667 2.45738 7.94873 2.04511C8.63198 1.8183 9.36803 1.8183 10.0513 2.04511C11.2934 2.45738 12.1985 4.05899 14.0087 7.2622C15.819 10.4654 16.7241 12.067 16.4526 13.372C16.3032 14.09 15.9352 14.7411 15.4013 15.2323C14.4308 16.125 12.6206 16.125 9 16.125C5.37949 16.125 3.56923 16.125 2.59872 15.2323C2.06481 14.7411 1.6968 14.09 1.54742 13.372C1.2759 12.067 2.18103 10.4654 3.99129 7.2622Z" stroke="#D69554" stroke-width="1.125"/>
          <path d="M9.18164 12.75V9.75C9.18164 9.39645 9.18164 9.21968 9.07177 9.1098C8.96197 9 8.78519 9 8.43164 9" stroke="#D69554" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.9939 6.75H9.00065" stroke="#D69554" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
       <div class="grid space-y-2">
         <h2 class="font-medium text-[#A85823]">Important warning</h2>
         <p class="text-[#cc7a2ee8]">We will never ask for your seed phrase. Anyone who asks for it is trying to scam you.</p>
       </div>
      </div>
    </div>
  </div>
  <div class="flex items-center gap-4 w-full buttons">
    <button onclick={prevStep} class="text-black py-2 rounded-xl bg-white border border-[#EAECF0] w-full text-sm" aria-label="back">
      Back
    </button>
    <button {onclick} class="py-2 rounded-xl text-white bg-[#4D83EE] w-full text-sm" aria-label="continue">
      Continue
    </button>
  </div>
</div>