<script lang="ts">
import { getAbortSignal } from 'svelte';

let pokemon = $state('charizard')
let image = $state('')


async function getPokemon() {
  const baseURL = 'https://pokeapi.co/api/v2/pokemon'
  const response = await fetch(`${baseURL}/${pokemon}`, {
    signal: getAbortSignal()
  })
  if (!response.ok) throw new Error('Not Working')
  return response.json()
}

$effect(() => {
  (async () => {
    const data = await getPokemon()
    image = data.sprites.front_default
  })()
})

</script>



<main class='h-screen bg-black text-white flex justify-center items-center gap-8 flex-col p-8'>
  <input 
    name="search" 
    type="search" 
    placeholder="Enter Pokemon name"
    class="rounded-3xl border border-amber-500 hover:border-amber-100 py-2 px-4 placeholder:text-white/50 placeholder:text-sm" 
    oninput={ e => pokemon = (e.target as HTMLInputElement)?.value || '' } 
  />

  <img src={image} alt={pokemon} class="size-40" />
</main>