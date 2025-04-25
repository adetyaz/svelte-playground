<script lang="ts">
	import Backup from "$lib/components/Backup.svelte";
	import Complete from "$lib/components/Complete.svelte";
	import Generate from "$lib/components/Generate.svelte";
	import Welcome from "$lib/components/Welcome.svelte";
	import Introduction from "$lib/components/Introduction.svelte";
	import StepIndicator from "$lib/components/StepIndicator.svelte";
	import Verify from "$lib/components/Verify.svelte";

  const STEPS  = [
    { step: 1, stepText: 'Welcome' },
    { step: 2, stepText: 'Introduction' },
    { step: 3, stepText: 'Generate' },
    { step: 4, stepText: 'Verify' },
    { step: 5, stepText: 'Backup' },
    { step: 6, stepText: 'Complete' }
  ];


  let currentStep = 1;

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      currentStep += 1;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      currentStep -= 1;
    }
  };

</script>


<main class="h-screen bg-white grid place-items-center px-12 xl:px-0 text-[#333333]">
  <section class="sm:w-1/2 lg:w-1/3 mx-auto grid place-items-center space-y-12">
    <div class="flex items-center gap-4">
      {#each STEPS as {step, stepText} (step)}
        <StepIndicator {step} {stepText} active={step === currentStep} {currentStep} /> 
      {/each}
    </div>

    {#if currentStep === 1}
      <Welcome onclick={nextStep} />
    {:else if currentStep === 2}
      <Introduction onclick={nextStep} {prevStep} />
    {:else if currentStep === 3}
      <Generate onclick={nextStep} {prevStep} />
    {:else if currentStep === 4}
      <Verify onclick={nextStep} {prevStep} />
    {:else if currentStep === 5}
      <Backup onclick={nextStep} {prevStep} />
    {:else if currentStep === 6}
      <Complete onclick={() => currentStep = 1} />
    {/if}
  </section>
</main>