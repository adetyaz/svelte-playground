<script>
	import '@fontsource/space-mono';
	import logo from '$lib/assets/images/logo.svg';
	import dollarSign from '$lib/assets/images/icon-dollar.svg';
	import personSign from '$lib/assets/images/icon-person.svg';

	let tipAmount = $state(0);
	let total = $state(0);
	let percentages = $state([5, 10, 15, 25, 50]);
	let bill = $state(0);
	let people = $state(0);
	let customTip = $state(0);
	let showCustomTip = $state(false);
	let selectedPercentage = $state(0);
  let warning = $state(false);

	$inspect(selectedPercentage);
	$inspect(bill);
	$inspect(customTip);
  $inspect(people);


  function checkPeople() {
    if (people <= 0) {
      warning = true;
    } 
  }

  function reset(){
    tipAmount = 0
    total = 0
    bill = 0
    people = 0
    if(selectedPercentage){
      selectedPercentage = 0
      
    }
    if (showCustomTip){
      customTip = 0
      showCustomTip = false
    }
  }

	$effect(() =>{
	  if (showCustomTip && people > 0 && customTip > 0){
	    tipAmount = parseFloat(((bill * (customTip / 100)) / people).toFixed(2))
	    total = parseFloat(((bill / people) + tipAmount).toFixed(2))
	  } else if (selectedPercentage && people > 0 && !showCustomTip) {
	    tipAmount = parseFloat(((bill * (selectedPercentage / 100)) / people).toFixed(2))
	    total = parseFloat(((bill / people) + tipAmount).toFixed(2))
	  }
	})
</script>

<main
	class="splitter grid min-h-screen items-center justify-center space-y-12 bg-[#26c0abff] pt-8 md:space-y-0 md:py-8"
>
	<img src={logo} alt="logo" class="justify-self-center" />
	<section
		class="grid-cols-2 space-y-8 rounded-t-2xl bg-white p-8 md:grid md:gap-x-10 md:rounded-2xl"
	>
		<div class="w-full space-y-6">
			<div class="relative">
				<label for="bill" class="mb-4 text-sm font-bold text-[#5e7a7dff]">Bill</label>
				<input
					id="bill"
					bind:value={bill}
					type="number"
					placeholder="0"
					class="w-full rounded-sm bg-[#f4fafaff] py-3 text-right text-2xl font-bold text-[#00494dff] placeholder:text-[#7f9c9fff] focus:outline-none"
				/>
				<img src={dollarSign} alt="dollar sign" class="absolute top-1/2 left-2" />
			</div>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
				{#each percentages as percentage (percentage)}
					<button
						class={`cursor-pointer rounded-sm py-3 text-xl font-bold ${selectedPercentage === percentage ? 'bg-[#26c0abff] text-[#00494dff]' : 'bg-[#00494dff] text-white'}`}
						onclick={() => (selectedPercentage = percentage)}
					>
						{percentage}%
					</button>
				{/each}
				{#if !showCustomTip}
					<button
						class="cursor-pointer rounded-sm bg-[#f4fafaff] py-3 text-xl font-bold text-[#5e7a7dff]"
						onclick={() => (showCustomTip = true, selectedPercentage = 0)}>Custom</button
					>
				{:else}
					<input
						type="number"
						bind:value={customTip}
						placeholder="0"
						class="w-36 rounded-sm bg-[#f4fafaff] py-3 text-center text-xl font-bold text-[#00494dff] placeholder:text-[#7f9c9fff] focus:outline-none"
					/>
				{/if}
			</div>
			<div class="relative">
				<label for="people" class="mb-4 text-sm font-bold text-[#5e7a7dff]">Number of People</label>
				<input
					id="people"
					bind:value={people}
					type="number"
					placeholder="0"
					onblur={checkPeople}
					class={`w-full rounded-sm bg-[#f4fafaff] py-3 text-right text-2xl font-bold text-[#00494dff] placeholder:text-[#7f9c9fff] focus:outline-none ${warning ? 'border-2 border-red-500' : null}`}
				/>
				<img src={personSign} alt="person sign" class="absolute top-1/2 left-2" />
			</div>
		</div>
		<div class="flex flex-col justify-center space-y-18 rounded-2xl bg-[#00494dff] p-8">
			<div class="flex flex-col items-center gap-10">
				<div class="flex w-full items-center justify-between">
					<h3 class="text-sm text-white">
						Tip Amount <br /> <span class="text-xs text-[#7f9c9fff]"> / person </span>
					</h3>
					<h2 class="text-4xl font-bold text-[#26c0abff]">${tipAmount}</h2>
				</div>

				<div class="flex w-full items-center justify-between">
					<h3 class="text-sm text-white">
						Total <br /> <span class="text-xs text-[#7f9c9fff]"> / person </span>
					</h3>
					<h2 class="text-4xl font-bold text-[#26c0abff]">${total}</h2>
				</div>
			</div>
			<button
				class="w-full cursor-pointer rounded-sm bg-[#26c0abff] py-3 text-xl font-bold text-[#00494dff] uppercase"
        onclick={reset}
				>reset</button
			>
		</div>
	</section>
</main>

<style>
	.splitter {
		font-family: 'Space Mono', monospace;
		font-weight: 400;
	}
</style>
