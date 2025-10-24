<script lang="ts">
	import { fade } from 'svelte/transition';
	import { animate } from 'motion';

	let {
		step,
		stepText,
		active,
		currentStep
	}: { step: number; stepText: string; active: boolean; currentStep: number } = $props();

	let hasAnimated = $state(false);

	$effect(() => {
		if (step > currentStep) {
			hasAnimated = true;
		}

		if (step === currentStep && !hasAnimated) {
			console.log(hasAnimated);
			animate(
				'.check-mark',
				{ opacity: [0, 1], scale: [0.5, 1] },
				{ duration: 0.5, delay: currentStep === 6 && !hasAnimated ? 1.5 : 0 }
			);
		}
	});
</script>

<div class="relative flex flex-col items-center justify-center gap-2 overflow-hidden">
	{#if step < currentStep || currentStep === 6}
		<svg
			width="58"
			height="58"
			viewBox="0 0 58 58"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="check-mark size-10"
		>
			<rect x="0.5" y="0.5" width="57" height="57" rx="28.5" fill="#E2FBE9" />
			<rect x="0.5" y="0.5" width="57" height="57" rx="28.5" stroke="#5EC26A" />
			<path
				d="M22 31L25.5 34.5L36 23.5"
				stroke="#5EC26A"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<div
			class={`flex size-10 items-center justify-center rounded-full text-base transition-colors ${active ? 'bg-[#4D83EE] text-white' : 'bg-[#F3F4F6] text-[#c7c7c7]'}`}
			in:fade={{ duration: 1200 }}
		>
			{step}
		</div>
	{/if}

	<p class="text-xs font-medium sm:text-sm">{stepText}</p>
</div>
