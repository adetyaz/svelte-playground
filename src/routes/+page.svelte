<script>
	import Derived from '$lib/components/Derived.svelte';
	import Effects from '$lib/components/Effects.svelte';
	import HoldButton from '$lib/components/HoldButton.svelte';
	import States from '$lib/components/States.svelte';
	import Flip from '$lib/components/Flip.svelte';
</script>

<!-- <script lang="ts">
	import Header from "$lib/components/Header.svelte";

  let name = $state('Scottish');
  let status: 'OPEN' | 'CLOSED' = $state('OPEN')

  let fullName = $derived(name + ' ' + 'Tolinski')


  function onclick() {
    status = status === 'OPEN' ? 'CLOSED' : 'OPEN';
  }
  // function toggle() {
  //   status = status === 'OPEN' ? 'CLOSED' : 'OPEN';
  // }


</script>


<h1>Welcome {fullName}</h1>
<Header {name} fakeName='turn' />


<input type="text" bind:value={name} placeholder="Enter your name" class="border border-amber-400" />

<p>The store is now {status}</p>
<!-- <button onclick={toggle} class="p-4 bg-indigo-500 text-white">Toggle Status</button> -->
<!-- <button {onclick} class="p-4 bg-indigo-500 text-white">Toggle Status</button> -->
<!-- <button onclick={() => status = status === 'OPEN' ? 'CLOSED' : 'OPEN'} class="p-4 bg-indigo-500 text-white">Toggle Status</button> -->

<div class="flex h-screen items-center justify-center">
	<!-- <HoldButton /> -->
   <!-- <Effects /> -->
    <Flip />
</div>
