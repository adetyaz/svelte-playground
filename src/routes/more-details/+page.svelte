<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import { fly, fade } from "svelte/transition";

  let formState: Record<string, string | number | Record<string, string | number>> = $state({
    // name: '',
    // birthday: '',
  
    step: 0,
    error: '',
  })

  const nextStep = (id: string) => {
    if(formState[id]) {    
      formState.step = (typeof formState.step === 'number' ? formState.step : 0) + 1
      formState.error = ''
    } else {
      formState.error = 'Please fill out the form input'
    }
  }
  
  
  const QUESTIONS = [{
    question: 'Your Name',
    id: 'name',
    type: 'text'
  }, {
    question: 'Your Birthday',
    id: 'birthday',
    type: 'date'
  },
  {
    question: 'Color',
    id: 'color',
    type: 'color'
  }
  ] 


  $effect(() => {
    console.log('formState', formState)
    return () => {
      console.log('unsubscribed')
    }
  })


  $effect(() => {
    console.log('formState', formState.step)

    return () => {
      console.log('unsubscribed', formState.step)
    }
  })

  $inspect(formState.step)


</script>

{#snippet formStep({question, id, type}: {question: string, id: string, type: string})}
  <article>
    <div class="grid space-y-6">
      <label for={id}>{question}</label>
      <input {type} {id} bind:value={formState[id]} class="rounded border border-cyan-800" />
    </div>
    <button class="rounded bg-blue-950 text-white px-4 py-2 cursor-pointer" onclick={() => nextStep(id)}
    >Next</button>
  </article>
{/snippet}


{
  JSON.stringify(formState)
}

<main>
  <!-- <Header name={formState.name as string}>
    <p>ddddddd</p>
    {#snippet secondChild(name: string)}
      <p>Second child {name}</p>
    {/snippet}
  </Header> -->


  <Header name={formState.name as string}/>
  <p>{+formState.step + 1}</p>
  {#if formState.error}
    <p class="text-red-500">{formState.error}</p>
  {/if}

  {#if typeof formState.step === 'number' && formState.step >= QUESTIONS.length}
    <p class="text-violet-500">Thanks</p>
  {/if}

  <!-- {#each QUESTIONS as question (question.id)} -->
  {#each QUESTIONS as question, index (question.id)}
    {#if formState.step === index}
      <div 
        in:fly={{ x: 200, duration: 500, opacity: 0, delay: 100}}
        out:fade
      >
      {@render formStep(question)}</div>
    {/if}
  {/each}

  
  <!-- {#each QUESTIONS as {id, question, type} (id)}
    {@render formStep({question, id, type})}
  {/each} -->

  
  
  <!-- {#if formState.step === 0}
    <div>
      <label for="name">Your Name</label>
      <input type="text" id="name" bind:value={formState.name} placeholder="Enter your name" class="border border-amber-400" />
    </div>
    <button class="rounded bg-blue-950 text-white px-4 py-2 cursor-pointer" onclick={firstStep}
    >Next</button>
    {:else if formState.step === 1}
    <div>
      <label for="birthday">Your Birthday</label>
      <input type="date" id="birthday" bind:value={formState.birthday} class="border border-amber-400" />
      <button class="rounded bg-blue-950 text-white px-4 py-2 cursor-pointer">Next</button>
    </div>
  {/if} -->
</main>




<style>
  /* :global(h1){
    background: darkblue;
  } */
</style>

<!-- 
  What more to cover:

  All Runes
  All Dereive
  All Effect
  All props - $bindable
  $host
  All $snippets

-->