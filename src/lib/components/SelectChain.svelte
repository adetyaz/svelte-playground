<script>
// import CustomSelect from "./CustomSelect.svelte";

let openSelect = $state(false)
let openSelectTwo = $state(false)

let chainOne = $state({
  name: '',
  type: '',
  color: ''
})
let chainTwo = $state({
  name: '',
  type: '',
  color: ''
})

 const chains =[
  { name: "Ethereum", type: "evm", color: "#627EEA" },
  { name: "Polygon", type: "evm", color: "#8247E5" },
  { name: "Binance Smart Chain", type: "evm", color: "#F3BA2F" },
  { name: "Avalanche", type: "evm", color: "#E84142" },
  { name: "Arbitrum", type: "evm", color: "#28A0F0" },
  { name: "Optimism", type: "evm", color: "#FF0420" },
 
]
</script>

<div class="flex justify-between items-end gap-4 py-6 border-b border-[#EAECF0]">
  <div class="relative w-full">
    <p class="font-medium">From chain</p>
    <button class="px-4 py-2 border border-[#EAECF0] rounded-lg flex items-center gap-2 w-full" onclick={() => openSelect = true}>
      {#if chainOne.name !== ''}
        <div class='size-4 rounded-full' style={`background: ${chainOne.color};`}></div>
        <p>{chainOne.name} <span class="uppercase">({chainOne.type})</span></p>
      {:else}
        <span>Select Chain</span>
      {/if}
    </button>
    {#if openSelect}
      <ul class="absolute top-12 border border-[#33333336] bg-white rounded px-2 pt-4 z-10 text-sm ">
        {#each chains as chain (chain.name)}
          <button 
            class="flex items-center gap-2 mb-4" 
            onclick={() => {chainOne = {
              name: chain.name,
              type: chain.type ?? '',
              color: chain.color
            }
            openSelect = false
            }}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { chainTwo = {
              name: chain.name,
              type: chain.type ?? '',
              color: chain.color
            }; openSelect = false; e.preventDefault(); }}}
          >
            <span class='size-4 rounded-full' style={`background: ${chain.color};`}></span>
            <span>{chain.name}</span>
          </button>
        {/each}
      </ul>
    {/if}
  </div>
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-16 h-10">
    <rect width="32" height="32" rx="16" fill="#E7EAEE"/>
    <path d="M10.75 16H21.25M21.25 16L16 10.75M21.25 16L16 21.25" stroke="#333333" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div class="relative w-full">
    <p class="font-medium">To chain</p>
    <button class="px-4 py-2 border border-[#EAECF0] rounded-lg flex items-center gap-2 w-full" onclick={() => openSelectTwo = true}>
      {#if chainTwo.name !== ''}
        <div class='size-4 rounded-full' style={`background: ${chainTwo.color};`}></div>
        <p>{chainTwo.name} <span class="uppercase">({chainTwo.type})</span></p>
      {:else}
        <span>Select Chain</span>
      {/if}
    </button>
    {#if openSelectTwo}
      <ul class="absolute top-12 border border-[#33333336] bg-white rounded px-2 pt-4 z-10 text-sm ">
        {#each chains as chain (chain.name)}
          <button 
            class="flex items-center gap-2 mb-4 cursor-pointer" 
            onclick={() => {chainTwo = {
              name: chain.name,
              type: chain.type ?? '',
              color: chain.color
            }
            openSelectTwo = false
            }}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { chainTwo = {
              name: chain.name,
              type: chain.type ?? '',
              color: chain.color
            }; openSelectTwo = false; e.preventDefault(); }}}
          >
            <span class='size-4 rounded-full' style={`background: ${chain.color};`}></span>
            <span>{chain.name}</span>
          </button>
        {/each}
      </ul>
    {/if}
  </div>
</div>

