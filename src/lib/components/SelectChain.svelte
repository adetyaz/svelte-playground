<script>
	import CustomSelect from "./CustomSelect.svelte";


  let chainOne = $state('')
  let chainTwo = $state('')

  const chains =[{ name: "Ethereum", color: "#627EEA" },
  { name: "Polygon", color: "#8247E5" },
  { name: "Binance Smart Chain", color: "#F3BA2F" },
  { name: "Avalanche", color: "#E84142" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Optimism", color: "#FF0420" },
  { name: "Solana", color: "#00FFBD" },
  { name: "Fantom", color: "#1969FF" },
  { name: "Base", color: "#0052FF" },
  { name: "ZkSync", color: "#8C8DFC" },
  { name: "Linea", color: "#00B8D9" },
  { name: "Celo", color: "#FBCC5C" },
  { name: "Near", color: "#000000" },
  { name: "Moonbeam", color: "#53CBC8" },
  { name: "Harmony", color: "#00ADE8" }]
</script>

<div class="flex justify-between items-center py-4 border-b border-[#33333341]">
  <select name="from chain" id="" class="w-full rounded-lg border border-[#3333338f]">
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
  <!-- <select name="to chain" id="" class="w-full rounded-lg border border-[#3333338f]">
    <option value="Ethereum">
      Solana
      <!-- <span class=""></span> -->
      <!-- <p>Solana</p> -->
    <!-- </option>
  </select> --> 

  <select class="custom-select">
    <option disabled selected>Select an option</option>
    <option>Home</option>
    <option>Settings</option>
    <option>Help</option>
  </select>
</div>

<style>
  .custom-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-color: white;
    border: 1px solid #ccc;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.375rem;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 20 20" fill="black" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    cursor: pointer;
  }
</style>