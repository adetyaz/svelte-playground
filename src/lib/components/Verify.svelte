<script lang="ts">
	import { animate, easeOut, stagger } from 'motion';

	let { onclick, prevStep } = $props();

	let formState: Record<string, string> = $state({
		wordOne: '',
		wordTwo: '',
		wordThree: ''
	});

	const WORDS = ['Red', 'Ultra', 'Sonic'];

	const PHRASES = ['Metal', 'Hand', 'See'];

	$effect(() => {
		animate(
			'.intro > *, .form-items > *, .buttons > button',
			{
				opacity: [0, 1],
				y: [50, 0]
			},
			{ delay: stagger(0.2), duration: 0.25, ease: easeOut }
		);
	});
</script>

<div class="place-items-center space-y-8 text-[#333333] sm:grid">
	<div class="intro grid space-y-2 text-center">
		<h1 class="text-2xl font-bold">Verify Seed Phrase</h1>
		<p class="text-sm font-medium text-[#3333338f]">
			Select the correct words in the right order to verify you've saved your seed phrase.
		</p>
	</div>

	<form class="form-items flex w-full items-center gap-8 text-center text-sm">
		<div>
			<label for="wordOne" class="text-[#3333338f]">Word #3</label>
			<input
				type="text"
				bind:value={formState.wordOne}
				class="flex w-full justify-center rounded-xl border border-transparent bg-[#EAECF0] px-8 py-3"
			/>
		</div>
		<div>
			<label for="wordTwo" class="text-[#3333338f]">Word #12</label>
			<input
				type="text"
				bind:value={formState.wordTwo}
				class="flex w-full justify-center rounded-xl bg-[#EAECF0] px-8 py-3"
			/>
		</div>
		<div>
			<label for="wordThree" class="text-[#3333338f]">Word #7</label>
			<input
				type="text"
				bind:value={formState.wordThree}
				class="flex w-full justify-center rounded-xl bg-[#EAECF0] px-8 py-3"
			/>
		</div>
	</form>
	<div class="form-items flex w-full items-center gap-8">
		{#each PHRASES as word}
			<div class="flex w-full justify-center rounded-xl border border-[#EAECF0] py-3">
				<p class="text-sm font-semibold">{word}</p>
			</div>
		{/each}
	</div>
	<div class="buttons flex w-full items-center gap-4">
		<button
			onclick={prevStep}
			class="w-full cursor-pointer rounded-xl border border-[#EAECF0] bg-white py-2 text-sm"
			aria-label="back"
		>
			Back
		</button>
		<button
			{onclick}
			class="w-full cursor-pointer rounded-xl bg-[#4D83EE] py-2 text-sm text-white"
			aria-label="verify"
		>
			Verify
		</button>
	</div>
</div>
