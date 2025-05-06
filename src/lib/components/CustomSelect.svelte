<script lang="ts">
  let {onSelect, selected, options} = $props()

  let open = $state(false)

  function handleSelect(option: any){
    selected = option
    open = false
    onSelect(option)
}
</script>

<div class="relative inline-block w-48">
  <button
    class="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left"
    onclick={() => (open = !open)}
  >
    {#if selected}
      <span class="flex items-center gap-2">{selected.label}</span>
    {:else}
      <span>Select...</span>
    {/if}
  </button>

  {#if open}
    <ul class="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow dropdown-enter-active">
      {#each options as option}
        <button
          type="button"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          onclick={() => handleSelect(option)}
        >
          {option.icon && option.icon}
          {option.label}
        </button>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown-enter {
    opacity: 0;
    transform: translateY(-10px);
  }

  .dropdown-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.2s ease;
  }

  .dropdown-leave {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown-leave-active {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease;
  }
</style>