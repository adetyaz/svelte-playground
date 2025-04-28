<script>
import { animate, easeOut, stagger} from "motion";

let {onclick, prevStep} = $props()
let viewPhrases = $state(false)

const seedPhrase = [
    'apple',
    'bat',
    'cat',
    'dog',
    'elephant',
    'frog',
    'giraffe',
    'hippo',
    'iguana',
    'jellyfish',
    'kangaroo',
    'lion'
  ];

  $effect(() => {
    animate(".intro > *, .phrase-card, .phrase-reveal, .tips > *, .buttons > button", {
      opacity: [0, 1],
      y: [50, 0],
    }, {delay: stagger(.2), duration: .25, ease: easeOut})
  })

</script>

<div class="grid place-items-center space-y-4">
  <div class="grid space-y-2 intro place-items-center">
    <h1 class="text-2xl font-bold">Your Seed Phrase</h1>
    <p class="text-[#333333] text-center text-sm">Below is your unique 12-word seed phrase. Write it down and store it <br class="hidden xl:block"/> in a secure location.</p>
  </div>
  <div class="w-full p-4 border border-[#EAECF0] relative overflow-hidden rounded-xl phrase-card">
    <div class={`bg-[#bcbcbc8a] absolute inset-0 backdrop-blur-[2.5px] transition-opacity ${viewPhrases ? 'opacity-0' : 'opacity-100'}`}></div>
    <ul class="grid grid-cols-3 gap-y-3 text-sm">
      {#each seedPhrase as word, index}
        <li class="basis-1/4"><span class="text-[#3333338f]">{index + 1}</span>. {word}</li>
      {/each}
    </ul>
  </div>
  <div class="flex items-center gap-4 phrase-reveal">
    <button class="p-1.5 rounded-full flex items-center bg-[#EAECF0]" aria-label="hide or view" onclick={() => viewPhrases = !viewPhrases}>
      {#if !viewPhrases}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.9595 10.2926C13.5759 9.68078 14.0518 9.07271 14.3628 8.63665C14.5655 8.35245 14.6668 8.21031 14.6668 7.99998C14.6668 7.78965 14.5655 7.64751 14.3628 7.36331C13.4521 6.08627 11.1263 3.33331 8.00016 3.33331C7.39496 3.33331 6.81976 3.43649 6.27901 3.61216M4.49844 4.49826C3.15428 5.40478 2.1616 6.62842 1.63752 7.36331C1.43484 7.64751 1.3335 7.78965 1.3335 7.99998C1.3335 8.21031 1.43484 8.35245 1.63752 8.63665C2.54823 9.91371 4.87402 12.6666 8.00016 12.6666C9.32736 12.6666 10.5102 12.1704 11.5019 11.5017" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.57191 6.66669C6.21855 7.02002 6 7.50822 6 8.04742C6 9.12582 6.8742 10 7.9526 10C8.4918 10 8.98 9.78149 9.33333 9.42809" stroke="#333333" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M2 2L14 14" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.33325 5.33333C1.33325 5.33333 4.31802 2 7.99992 2C11.6818 2 14.6666 5.33333 14.6666 5.33333" stroke="#333333" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14.3626 8.69669C14.5653 8.98089 14.6666 9.12302 14.6666 9.33335C14.6666 9.54369 14.5653 9.68582 14.3626 9.97002C13.4519 11.2471 11.1261 14 7.99992 14C4.87377 14 2.54799 11.2471 1.63728 9.97002C1.43459 9.68582 1.33325 9.54369 1.33325 9.33335C1.33325 9.12302 1.43459 8.98089 1.63728 8.69669C2.54799 7.41962 4.87377 4.66669 7.99992 4.66669C11.1261 4.66669 13.4519 7.41962 14.3626 8.69669Z" stroke="#333333" stroke-width="1.5"/>
          <path d="M10 9.33331C10 8.22871 9.1046 7.33331 8 7.33331C6.8954 7.33331 6 8.22871 6 9.33331C6 10.4379 6.8954 11.3333 8 11.3333C9.1046 11.3333 10 10.4379 10 9.33331Z" stroke="#333333" stroke-width="1.5"/>
        </svg>
      {/if}
    </button>
    <button class="py-1.5 px-8 rounded-xl bg-white border border-[#EAECF0] w-full text-sm flex items-center gap-2" aria-label="copy to clipboard">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10C6 8.1144 6 7.1716 6.58579 6.58579C7.1716 6 8.1144 6 10 6H10.6667C12.5523 6 13.4951 6 14.0809 6.58579C14.6667 7.1716 14.6667 8.1144 14.6667 10V10.6667C14.6667 12.5523 14.6667 13.4951 14.0809 14.0809C13.4951 14.6667 12.5523 14.6667 10.6667 14.6667H10C8.1144 14.6667 7.1716 14.6667 6.58579 14.0809C6 13.4951 6 12.5523 6 10.6667V10Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.3332 5.99998C11.3316 4.02859 11.3018 3.00745 10.7279 2.30827C10.6171 2.17324 10.4933 2.04943 10.3583 1.93862C9.62072 1.33331 8.52492 1.33331 6.33325 1.33331C4.1416 1.33331 3.04577 1.33331 2.30821 1.93862C2.17318 2.04943 2.04937 2.17324 1.93856 2.30827C1.33325 3.04583 1.33325 4.14166 1.33325 6.33331C1.33325 8.52498 1.33325 9.62078 1.93856 10.3584C2.04937 10.4934 2.17318 10.6172 2.30821 10.728C3.00739 11.3018 4.02853 11.3316 5.99992 11.3332" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Copy to clipboard</span>
    </button>
  </div>
  <div class="tips">
    <h2 class="text-sm">Security Tips</h2>
    <p class="text-[#3333338f] text-sm">Write down your seed phrase on paper and never share it with anyone <br class="hidden xl:block" /> Store it in a secure, private location</p>
  </div>
  <div class="flex items-center gap-4 w-full buttons">
    <button onclick={prevStep} class="py-2 rounded-xl bg-white border border-[#EAECF0] w-full text-sm" aria-label="back">
      Back
    </button>
    <button {onclick} class="py-2 rounded-xl text-white bg-[#4D83EE] w-full text-sm" aria-label="continue after saving phrase">
      I’ve saved my phrase
    </button>
  </div>
 </div>