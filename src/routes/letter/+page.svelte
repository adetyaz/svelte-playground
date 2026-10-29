<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import GridDistortion from '$lib/components/GridDistortion.svelte';

	type Paragraph = { lead?: string; text: string };
	type Section = { kanji: string; romaji: string; title: string; paragraphs: Paragraph[] };

	/**
	 * Letter content, one entry per panel. Text in [brackets] is still to be filled in and is
	 * highlighted on the page so the gaps are easy to spot.
	 */
	const sections: Section[] = [
		{
			kanji: '序',
			romaji: 'Jo',
			title: 'Opening',
			paragraphs: [
				{
					text: `I'm Adetayo Lasisi, a Frontend Engineer based in Ilorin, Nigeria, and I'm applying for the role of Senior Frontend Engineer at HENNGE. I enjoy building web interfaces with Svelte, and what I care about most is making experiences that are easy to use and still beautiful.`
				}
			]
		},
		{
			kanji: '理念',
			romaji: 'Rinen',
			title: 'Why HENNGE',
			paragraphs: [
				{
					text: `What drew me to HENNGE is where its philosophy came from. Kazuhiro Ogura, HENNGE's President and CEO, has described how some customers found the early product too technical, and how the company began to feel a gap between its engineers and its customers. That gap is why HENNGE set "Liberation of Technology" as its management philosophy.`
				},
				{
					text: `It also means the company has to keep evolving, finding what is new and working out how it will help current and potential customers.`
				}
			]
		},
		{
			kanji: '道',
			romaji: 'Michi',
			title: 'My path',
			paragraphs: [
				{
					text: `I started software development in 2017 without much focus. I tried Angular and Ionic, and I learned Python as far as Django, but I had no community around me and didn't know which path to take. Around 2020 things became clearer. I moved into React and Vue, settled on React, and worked across different industries.`
				},
				{
					text: `In 2022 my blockchain journey started. I've always taken part in competitions and hackathons, and one of them had a job offer attached. That's where I first used Cardano, and it opened up a whole new world for me. I went off on my magic carpet trying different things and joined more hackathons, which introduced me to new people and taught me to learn on the fly. It's also how I met my current employer. We worked on a couple of hackathons together and won two at ETHGlobal in 2024 with MyriadFlow, a launchpad for phygitals.`
				},
				{
					text: `I still take part in buildathons on [Akindo](https://app.akindo.io/users/adetayo4422) to keep my mind sharp, using different blockchain technologies for different ideas. Some take off and some never go anywhere, but they keep me building and trying. HENNGE's name comes from "HENNKA" (change) and "challenge", and looking back, my path has been made of both. I'm someone who tries, and I'll always be open to trying new things.`
				}
			]
		},
		{
			kanji: '作品',
			romaji: 'Sakuhin',
			title: "What I've built",
			paragraphs: [
				{
					lead: 'Svelte',
					text: `I first came across Svelte while working on the first version of NetSepio, a wallet built on the Aptos chain, which someone else had already started. To be honest, I didn't like Svelte at first, mostly because of how props work, coming from React. Over time it grew on me, and when Svelte 5 came out I fell head over heels. I then built the second version of the NetSepio app, which combined a wallet, a VPN and a password safebox in one. I've used Svelte ever since.`
				},
				{
					lead: 'svelte-pasito',
					text: `I built svelte-pasito, a tiny, fully themeable and dependency-free fluid stepper component, out of curiosity after seeing a component library built only with Vue and React in mind. Svelte users don't always get the nice things.`
				},
				{
					lead: 'fastaccs',
					text: `I also built fastaccs, a marketplace for digital assets such as social media accounts. It's a full-stack SvelteKit app on a Neon Postgres database, with payments through Korapay. Trust was the hardest part, so purchases go through escrow, and inventory reservation handles busy days when many users want the same limited stock. Behind it is an admin platform where the owner restocks products, manages inventory, resolves issues such as refunds, and generates referral codes where needed.`
				}
			]
		},
		{
			kanji: '協働',
			romaji: 'Kyōdō',
			title: 'Building with others',
			paragraphs: [
				{
					lead: 'Svelte Bits',
					text: `I also contribute components to Svelte Bits, an open-source collection of animated Svelte components. Working in someone else's codebase taught me to adapt to the conventions already in place, and taught me a lot about structuring a frontend codebase that keeps growing toward hundreds of components.`
				},
				{
					lead: 'CyreneAI',
					text: `I use that at CyreneAI, where I've created design systems that let other developers plug in and build without compromising the overall frontend architecture. I've done this across CyreneAI's main projects and smaller ones like Zeno and Zygo Cash, including React Native mobile apps, where I set up reusable systems.`
				},
				{
					lead: 'Writing',
					text: `Outside of coding, I write tutorials and articles, though not as often as I'd like, because I enjoy teaching and sharing what I know.`
				}
			]
		},
		{
			kanji: '守り',
			romaji: 'Mamori',
			title: 'Tadrill',
			paragraphs: [
				{
					text: `Of HENNGE's products, Tadrill is the one this role is for, so I read up on it. It reminded me of building NetSepio, which was also on the security side, and I like that Tadrill works on the people side of security.`
				},
				{
					lead: 'Japanet',
					text: `One thing I would say summarized the role of the product is: "the operational burden of conducting e-mail drills has been greatly reduced, and the period from planning the drill implementation to tabulation and reporting has been shortened." Before Tadrill, the staff in charge handled everything by hand, from creating and sending training e-mails to tabulating results and alerting employees who had clicked links. Taking that load off people and ensuring ease of use is what "Liberation of Technology" means to me.`
				},
				{
					lead: 'Ogura Corporation',
					text: `Ogura Corporation had outsourced its drills, which ended up costing them time, and to them time is money that employees would rather spend being productive. Tadrill let them run drills in-house and respond quickly and flexibly. Reading both opened my eyes to what the product is for and how it improves its customers' work.`
				}
			]
		},
		{
			kanji: '志',
			romaji: 'Kokorozashi',
			title: 'Goals',
			paragraphs: [
				{
					text: `My goal is to evolve into a design and product engineer who is also strong in cloud and infrastructure, so I can work on a product from the interface down to how it runs. I'm currently reading Designing Data-Intensive Applications. I'd also like to do some forward-deployed engineering, working directly with customers and potential customers, where consultations shape tailor-made experiences that fit their use cases. That puts me right in the gap HENNGE's philosophy was created to close.`
				},
				{
					text: `I'd also welcome a conversation about how the team sees AI and its effects on our industry, and what it has in place so that learning and understanding don't get lost along the way.`
				}
			]
		},
		{
			kanji: '遊び',
			romaji: 'Asobi',
			title: 'For fun',
			paragraphs: [
				{
					text: `For fun, I go to raves (I'm not much of a dancer, but I let the music do its thing) and play video games. I'm currently playing Trepang2, and I finished Titanfall not long ago. I also hang out with my cat, listen to music, and I'm learning to play the guitar.`
				},
				{
					text: `I enjoy documentaries and history across the whole bandwidth, the good and the bad. Lately I've been learning about the Silk Road and how it changed the world, and about religion more broadly, across the world's faiths and pantheons. Someday I'd like to have a pet budgie.`
				}
			]
		},
		{
			kanji: '日本',
			romaji: 'Nihon',
			title: 'Why Japan',
			paragraphs: [
				{
					text: `You might wonder why Japan, given how far it is from where I live. I like to think of myself as a wanderer, not because I'm lost but because of how much the world holds.`
				},
				{
					text: `My oldest memory of Japan is Hi Hi Puffy AmiYumi on Cartoon Network. It's a cliché, but I've always wondered what it's like to just walk around neon-lit Tokyo. The first time I heard of Shibuya was in Frank Ocean's "Chanel", and Ghost of Tsushima brought me its castles and Shinto shrines. That alone could be a whole conversation.`
				}
			]
		},
		{
			kanji: '音楽',
			romaji: 'Ongaku',
			title: 'Music',
			paragraphs: [
				{
					text: `Music is a big part of it. My favorite album by a Japanese artist is Love Songs and Lamentations by Itsuroh Shimoda, released in 1973. My favorite song on it has a recurring word, "sukidakara", and the first time I heard that word was in a song by Umi, who is also half Japanese and has a song with a similar name. Over the years I've also listened to Kei Marimura and Hitomitoi. The one song she had with Stuts sonically feels like what I imagine Japan will feel like.`
				},
				{
					text: `Most of my love for Japan has come from documentaries, movies, music and video games, and from its rich culture and colorful history. I think it's time for me to spread my wings and breathe a new kind of air.`
				}
			]
		},
		{
			kanji: '結び',
			romaji: 'Musubi',
			title: 'Closing',
			paragraphs: [
				{
					text: `Thank you for reading. My work is on GitHub at [github.com/adetyaz](https://github.com/adetyaz). I'd be glad to talk about how I could contribute to HENNGE.`
				}
			]
		}
	];

	/** Each letter lands at a slightly different angle, so the stack looks hand-placed. */
	const tilts = [
		[-1.6, -10],
		[1.4, 14],
		[-0.9, -6],
		[2.1, 18],
		[-1.8, -16],
		[1, 8],
		[-2.2, -12],
		[1.6, 12],
		[-1.2, -8],
		[1.9, 15],
		[-1.4, -11]
	];

	const numerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'];

	/** Returns `ms`, or `0` when the OS asks for reduced motion. */
	const motion = (ms: number) => (prefersReducedMotion.current ? 0 : ms);

	/** `unfolding` plays the origami; `opened` removes the intro and lets the page scroll. */
	let unfolding = $state(false);
	let opened = $state(false);
	let active = $state(0);
	/** Hides the navigation hint once the reader has moved at least once. */
	let navUsed = $state(false);

	/** The one photo behind the intro and every letter, served from `static/letter/`. */
	const BACKGROUND = '/letter/scene-1-fuji.jpg';

	// Washi: kozo (mulberry) paper. Its long fibres show through the sheet, and the hand-made
	// sheet has soft, torn edges. Both are drawn as SVG and seeded, so they never change.

	function seeded(seed: number) {
		return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	}

	const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

	/** Loose curved fibres on a 400px tile: most are faint brown, some catch the light. */
	const fibres = (() => {
		const rand = seeded(11);
		const strands = Array.from({ length: 150 }, () => {
			const [x, y, angle, length, bend] = [rand() * 400, rand() * 400, rand() * Math.PI * 2, 18 + rand() * 70, (rand() - 0.5) * 30];
			const [ex, ey] = [x + Math.cos(angle) * length, y + Math.sin(angle) * length];
			const cx = (x + ex) / 2 + Math.cos(angle + Math.PI / 2) * bend;
			const cy = (y + ey) / 2 + Math.sin(angle + Math.PI / 2) * bend;
			const stroke = rand() < 0.35 ? 'rgba(255,255,255,0.6)' : 'rgba(110,84,52,0.17)';
			const d = [x, y, cx, cy, ex, ey].map((n) => n.toFixed(1));
			return `<path d="M${d[0]} ${d[1]}Q${d[2]} ${d[3]} ${d[4]} ${d[5]}" stroke="${stroke}" stroke-width="${(0.3 + rand() * 0.8).toFixed(2)}"/>`;
		});
		return svgUrl(
			`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="none" stroke-linecap="round">${strands.join('')}</svg>`
		);
	})();

	/**
	 * A mask with torn edges, stretched over the element. `straight` keeps one edge clean, for
	 * the two halves of a folded letter where they meet at the fold.
	 */
	function deckle(straight: 'top' | 'bottom' | 'none') {
		const [y, height] = { none: [12, 976], top: [-20, 1008], bottom: [12, 1008] }[straight];
		return svgUrl(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none"><filter id="d" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter><rect x="12" y="${y}" width="976" height="${height}" fill="#fff" filter="url(#d)"/></svg>`
		);
	}

	/**
	 * The HENNGE logo from `static/letter/logo.svg`. Its mark is a square whose four sides curve
	 * inward, which the origami splits into four flaps meeting at the centre. The full path also
	 * holds the wordmark, shown on its own by cropping the viewBox past the mark.
	 */
	const LOGO_PATH =
		'm34.94.55c.11-.15.08-.37-.07-.48-.12-.09-.29-.09-.41 0-10.1 7.36-23.81 7.36-33.91 0-.15-.12-.37-.08-.48.07-.09.12-.09.29 0 .41 7.37 10.1 7.37 23.79 0 33.89-.11.15-.08.37.07.48.12.09.29.09.41 0 10.1-7.36 23.81-7.36 33.91 0 .15.11.37.08.48-.07.09-.12.09-.29 0-.41-7.37-10.1-7.37-23.79 0-33.89zm23.87 14.83h-10.84v-9.83h-4.17v23.79h4.17v-10.56h10.84v10.56h4.17v-23.79h-4.17zm11.31 3.4h12.01v-3.4h-12.01v-6.23h12.97v-3.6h-17.14v23.79h17.37v-3.6h-13.21v-6.96zm31.13 4.3h-.07l-10.87-17.53h-4.4v23.79h3.97v-17.49h.1l10.84 17.5h4.4v-23.8h-3.97zm22.16 0h-.07l-10.87-17.53h-4.4v23.79h3.97v-17.49h.1l10.84 17.5h4.4v-23.8h-3.97zm36.38 2.67v-6.96h12v-3.4h-12v-6.23h12.97v-3.6h-17.14v23.79h17.37v-3.6h-13.21zm-16.64-5.37h5.98c-.19 1.65-1.02 3.16-2.32 4.2-1.29 1.14-2.95 1.76-4.67 1.76h-.02c-2.04 0-3.97-.8-5.72-2.37-1.86-1.64-2.89-4.01-2.82-6.49-.06-2.37.85-4.67 2.53-6.35 1.64-1.7 3.91-2.63 6.27-2.58 2.76 0 5.14 1.3 7.07 3.86l.11.15 2.83-2.7-.1-.12c-1.28-1.55-2.86-2.83-4.65-3.77-4.84-2.2-10.54-1.19-14.34 2.53-4.91 4.93-4.94 12.89-.07 17.85 2.28 2.38 5.45 3.72 8.75 3.69h.28c3.21 0 6.26-1.39 8.35-3.82.96-1.06 1.69-2.31 2.14-3.67.45-1.57.67-3.2.64-4.83v-.96h-10.25v3.6z';

	/**
	 * The four flaps, in a 35-unit box like the logo's. `outside` follows the mark's inward curve
	 * (control points 7.4 in, as in the logo); `inside` is the straight-edged back of the same
	 * flap, which lies flat against the sheet once it has unfolded.
	 */
	const flaps = [
		{ side: 'top', outside: 'M0 0C10.6 7.4 24.4 7.4 35 0L17.5 17.5Z', inside: 'M0 0H35L17.5 17.5Z' },
		{ side: 'right', outside: 'M35 0C27.6 10.6 27.6 24.4 35 35L17.5 17.5Z', inside: 'M35 0V35L17.5 17.5Z' },
		{ side: 'bottom', outside: 'M0 35C10.6 27.6 24.4 27.6 35 35L17.5 17.5Z', inside: 'M0 35H35L17.5 17.5Z' },
		{ side: 'left', outside: 'M0 0C7.4 10.6 7.4 24.4 0 35L17.5 17.5Z', inside: 'M0 0V35L17.5 17.5Z' }
	];
	const isFirst = $derived(active === 0);
	const isLast = $derived(active === sections.length - 1);
	let page: HTMLDivElement | undefined;

	/** Panels are pinned at multiples of the viewport height, so the scroll offset gives the index. */
	function handleScroll() {
		if (!page) return;
		const next = Math.min(
			sections.length - 1,
			Math.max(0, Math.round(page.scrollTop / page.clientHeight))
		);
		if (next !== active) {
			active = next;
			navUsed = true;
			playStep();
		}
	}

	function goTo(index: number) {
		const target = Math.min(Math.max(index, 0), sections.length - 1);
		page?.scrollTo({
			top: target * page.clientHeight,
			behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!opened) return;
		if (event.key === 'ArrowRight') goTo(active + 1);
		if (event.key === 'ArrowLeft') goTo(active - 1);
	}

	function openLetter() {
		if (unfolding) return;
		unfolding = true;
		playBell();
		// Matches the last origami flap's delay plus its duration in the CSS below.
		setTimeout(() => (opened = true), motion(1900));
	}

	/** Splits text into plain runs, `[label](url)` links and `[placeholder]` gaps. */
	function parts(text: string) {
		return text
			.split(/(\[[^\]]+\](?:\([^)]+\))?)/)
			.filter(Boolean)
			.map((value) => {
				const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
				if (link) return { value: link[1], href: link[2], todo: false };
				return { value, href: undefined, todo: value.startsWith('[') };
			});
	}

	/** Letters whose text runs past the paper, until the reader scrolls to the end. */
	let moreBelow = $state<boolean[]>([]);
	let frames: HTMLElement[] = [];

	function trackOverflow(node: HTMLElement, i: number) {
		const update = () => (moreBelow[i] = node.scrollHeight - node.scrollTop - node.clientHeight > 8);
		const observer = new ResizeObserver(update);
		observer.observe(node);
		for (const child of node.children) observer.observe(child);
		node.addEventListener('scroll', update, { passive: true });
		update();
		return {
			destroy() {
				observer.disconnect();
				node.removeEventListener('scroll', update);
			}
		};
	}

	function scrollFrame(i: number) {
		const frame = frames[i];
		frame?.scrollBy({
			top: frame.clientHeight * 0.7,
			behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
		});
	}

	// Sound: synthesised with Web Audio, so there are no audio files to ship.

	let soundOn = $state(true);
	let audio: { ctx: AudioContext; dry: GainNode; verb: ConvolverNode } | null = null;
	let lastStep = 0;

	function ensureAudio() {
		if (!audio) {
			const ctx = new AudioContext();
			const dry = ctx.createGain();
			dry.gain.value = 0.5;
			dry.connect(ctx.destination);

			// A decaying noise impulse gives the hits a hall-like tail.
			const length = ctx.sampleRate * 2.4;
			const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
			for (let channel = 0; channel < 2; channel++) {
				const data = impulse.getChannelData(channel);
				for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
			}
			const verb = ctx.createConvolver();
			verb.buffer = impulse;
			const wet = ctx.createGain();
			wet.gain.value = 0.3;
			verb.connect(wet).connect(ctx.destination);

			audio = { ctx, dry, verb };
		}
		if (audio.ctx.state === 'suspended') audio.ctx.resume();
		return audio;
	}

	function tone(
		type: OscillatorType,
		from: number,
		to: number,
		peak: number,
		decay: number,
		start = 0
	) {
		const { ctx, dry, verb } = ensureAudio();
		const at = ctx.currentTime + start;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(from, at);
		osc.frequency.exponentialRampToValueAtTime(to, at + Math.min(decay, 0.3));
		gain.gain.setValueAtTime(0.0001, at);
		gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
		gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
		osc.connect(gain);
		gain.connect(dry);
		gain.connect(verb);
		osc.start(at);
		osc.stop(at + decay + 0.05);
	}

	/** A tsuzumi-style "pon", the shoulder drum of Noh theatre, played on each new section. */
	function playStep() {
		if (!soundOn || performance.now() - lastStep < 300) return;
		lastStep = performance.now();
		tone('sine', 420, 170, 0.8, 0.9);
		tone('triangle', 840, 340, 0.18, 0.35);

		const { ctx, dry } = ensureAudio();
		const slap = ctx.createBufferSource();
		const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
		slap.buffer = buffer;
		const band = ctx.createBiquadFilter();
		band.type = 'bandpass';
		band.frequency.value = 1800;
		const gain = ctx.createGain();
		gain.gain.value = 0.35;
		slap.connect(band).connect(gain).connect(dry);
		slap.start();
	}

	/** A low temple-bell strike for opening the letter. */
	function playBell() {
		if (!soundOn) return;
		const partials = [0.5, 1, 1.19, 1.56, 2, 2.66, 3.01];
		partials.forEach((ratio, i) => {
			const f = 110 * ratio;
			tone('sine', f, f * 0.998, 0.4 / (i + 1), 5 / (1 + i * 0.35));
		});
		tone('sine', 110.6, 110.4, 0.2, 4.5);
	}

	// Voice note

	/** Self-introduction voice note, served from `static/letter/intro.m4a`. */
	const VOICE_NOTE = '/letter/intro.m4a';
	let voicePaused = $state(true);
	let voiceTime = $state(0);
	let voiceDuration = $state(0);
	let voiceMissing = $state(false);
	const voiceProgress = $derived(voiceDuration ? voiceTime / voiceDuration : 0);
	const waveBars = Array.from({ length: 36 }, (_, i) => 30 + ((i * 37) % 70));

	function formatTime(seconds: number) {
		if (!Number.isFinite(seconds)) return '0:00';
		return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
	}

</script>

<svelte:head>
	<title>A letter to HENNGE</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div
	class="page"
	class:locked={!opened}
	bind:this={page}
	onscroll={handleScroll}
	style:--fibres={fibres}
	style:--deckle={deckle('none')}
	style:--deckle-fold-top={deckle('bottom')}
	style:--deckle-fold-bottom={deckle('top')}
>
	<!--
		One background for the whole page: the photo, rippling under the cursor (Svelte Bits'
		Grid Distortion), under a dark wash that blends it into the page. It rises out of the dark
		when the page loads.
	-->
	<div class="backdrop" aria-hidden="true">
		<GridDistortion imageSrc={BACKGROUND} grid={15} mouse={0.1} strength={0.15} relaxation={0.9} />
	</div>
	<div class="backdrop-shade" aria-hidden="true"></div>

	<!--
		Pinned letters: each one sticks while the next slides up over it, still folded, and opens
		once it arrives. Earlier letters stay underneath at their own angle.
	-->
	<div class="panels">
		{#each sections as s, i (s.kanji)}
			<section class="panel" style:z-index={i + 1} aria-labelledby="title-{i}">
				<div
					class="letter"
					class:open={opened && i <= active}
					class:behind={opened && i < active}
					style:--tilt="{tilts[i][0]}deg"
					style:--shift={tilts[i][1]}
				>
					<div class="frame" bind:this={frames[i]} use:trackOverflow={i}>
						<header class="frame-head">
							<span>{numerals[i]} · {s.romaji}</span>
						</header>

						<div class="frame-grid">
							<div class="body">
								<h2 id="title-{i}">{s.title}</h2>

								{#if i === 0}
									<p>October 29, 2026</p>
									<p>Dear HENNGE Recruitment Team,</p>

									<div class="voice">
										<audio
											src={VOICE_NOTE}
											preload="metadata"
											bind:paused={voicePaused}
											bind:currentTime={voiceTime}
											bind:duration={voiceDuration}
											onerror={() => (voiceMissing = true)}
										></audio>
										<button
											class="voice-play"
											onclick={() => (voicePaused = !voicePaused)}
											disabled={voiceMissing}
											aria-label={voicePaused ? 'Play voice note' : 'Pause voice note'}
										>
											{#if voicePaused}
												<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
											{:else}
												<svg viewBox="0 0 16 16" aria-hidden="true"
													><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg
												>
											{/if}
										</button>
										<div class="voice-body">
											<span class="voice-label">声 Koe · A short hello from me</span>
											<div class="voice-wave" aria-hidden="true">
												{#each waveBars as height, k (k)}
													<span
														style:height="{height}%"
														class:played={(k + 0.5) / waveBars.length <= voiceProgress}
													></span>
												{/each}
											</div>
										</div>
										<span class="voice-time">
											{voiceMissing
												? 'Coming soon'
												: `${formatTime(voiceTime)} / ${formatTime(voiceDuration)}`}
										</span>
									</div>
								{/if}

								{#each s.paragraphs as paragraph, k (k)}
									<p style:--i={k + 1}>
										{#if paragraph.lead}<span class="lead">{paragraph.lead}</span>{/if}
										{#each parts(paragraph.text) as part, j (j)}{#if part.href}<a href={part.href} target="_blank" rel="noreferrer">{part.value}</a>{:else if part.todo}<mark>{part.value}</mark>{:else}{part.value}{/if}{/each}
									</p>
								{/each}

								{#if i === sections.length - 1}
									<div class="signoff">
										<p>Best regards,<br />Adetayo Lasisi</p>
										<span class="hanko" aria-hidden="true">AL</span>
									</div>
									<p class="ps">
										P.S. I think the Tadrill case study pages could be improved visually, for example the intro section
										<a href="https://hennge.com/global/service/tadrill/ogura/" target="_blank" rel="noreferrer">Ogura Corporation page</a>.
									</p>
									<button class="again" onclick={() => goTo(0)}>Back to the beginning ↑</button>
								{/if}
							</div>
							<span class="title-v" aria-hidden="true">{s.kanji}</span>
						</div>

					</div>

					{#if opened && i === active && moreBelow[i]}
						<button class="more" onclick={() => scrollFrame(i)} transition:fade={{ duration: motion(250) }}>
							続 · Scroll for more <span aria-hidden="true">↓</span>
						</button>
					{/if}

					<!-- The outside of the folded letter: two halves that swing open, held by a paper band. -->
					<div class="fold fold-top" aria-hidden="true">
						<span class="fold-num">{numerals[i]}</span>
						<span class="fold-kanji">{s.kanji}</span>
					</div>
					<div class="fold fold-bottom" aria-hidden="true">
						<span class="fold-title">{s.title}</span>
						<span class="fold-from">From Adetayo Lasisi</span>
					</div>
					<div class="band" aria-hidden="true"><span>封</span></div>
				</div>
			</section>
		{/each}
	</div>

	{#if opened}
		<nav class="rail" aria-label="Letter sections">
			{#each sections as s, i (s.kanji)}
				<button onclick={() => goTo(i)} aria-current={i === active ? 'step' : undefined} aria-label={s.title}>
					<span class="rail-kanji">{s.kanji}</span>
				</button>
			{/each}
		</nav>

		<button class="sound" onclick={() => (soundOn = !soundOn)} aria-pressed={soundOn}>
			音 {soundOn ? 'Sound on' : 'Sound off'}
		</button>

		<!-- An alternative to scrolling, with a hint until the reader has moved once. -->
		<div class="pager-wrap">
			{#if !navUsed}
				<p class="pager-hint" out:fade={{ duration: motion(300) }}>Scroll, or press 次 to open the next letter</p>
			{/if}
			<nav class="pager" aria-label="Letter navigation">
				<button onclick={() => goTo(active - 1)} disabled={isFirst} aria-label="Previous letter">
					<span class="pager-kanji">前</span><span class="pager-text">Back</span>
				</button>
				<span class="pager-count">{numerals[active]} <small>/ {numerals[sections.length - 1]}</small></span>
				<button
					class="next"
					class:nudge={!navUsed}
					onclick={() => goTo(active + 1)}
					disabled={isLast}
					aria-label="Next letter"
				>
					<span class="pager-text">Next</span><span class="pager-kanji">次</span>
				</button>
			</nav>
		</div>
	{/if}

	{#if !opened}
		<!--
			Opening titles: the background rises out of the dark like a film's opening card, then the
			folded letter with the HENNGE logo appears. Pressing it unfolds the paper.
		-->
		<div class="intro" out:fade={{ duration: motion(1200) }}>
			<div class="intro-shade"></div>
			<div class="intro-content">
				<p class="intro-sub">手紙 · A letter from Adetayo Lasisi</p>

				<!--
					The HENNGE mark folded from paper. Each flap has two faces: the curved outside that
					makes the mark, and the straight inside that shows once the flap unfolds.
				-->
				<button class="origami" onclick={openLetter} disabled={unfolding} aria-label="Open the letter">
					<span class="paper" class:open={unfolding}>
						<span class="base">
							<svg viewBox="0 0 35 35" aria-hidden="true">
								<path class="base-mark" d="M0 0C10.6 7.4 24.4 7.4 35 0C27.6 10.6 27.6 24.4 35 35C24.4 27.6 10.6 27.6 0 35C7.4 24.4 7.4 10.6 0 0Z" />
								<rect class="base-sheet" width="35" height="35" />
							</svg>
							<span class="base-text">拝啓</span>
						</span>
						{#each flaps as flap (flap.side)}
							<span class="flap {flap.side}">
								<svg class="face" viewBox="0 0 35 35" aria-hidden="true"><path d={flap.outside} /></svg>
								<svg class="face inside" viewBox="0 0 35 35" aria-hidden="true"><path d={flap.inside} /></svg>
							</span>
						{/each}
					</span>
				</button>
				<svg class="wordmark" class:gone={unfolding} viewBox="44 4 129 27" role="img" aria-label="HENNGE">
					<path d={LOGO_PATH} fill-rule="evenodd" />
				</svg>

				<p class="intro-hint" class:gone={unfolding}>Press the letter to open it</p>
			</div>
			<div class="intro-grain"></div>
		</div>
	{/if}
</div>

<style>
	.page {
		--ink: #1f1a17;
		--ink-soft: rgba(31, 26, 23, 0.55);
		--line: rgba(31, 26, 23, 0.12);
		--washi: rgba(246, 239, 224, 0.94);
		--cream: #f6efe2;
		--beni: #b5402a;
		--indigo: #1f3a5f;
		--noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .28 0 0 0 .1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

		position: fixed;
		inset: 0;
		overflow-y: auto;
		color: var(--ink);
		background-color: #050506;
		font-family: 'Zen Kaku Gothic New', system-ui, sans-serif;
	}

	.page.locked {
		overflow: hidden;
	}

	/* Background */

	.backdrop,
	.backdrop-shade {
		position: fixed;
		inset: 0;
	}

	/* The gradient shows until the photo has loaded. */
	.backdrop {
		background: radial-gradient(circle at 50% 60%, #3a2a26, #14101a 55%, #050506);
		filter: brightness(0.1) saturate(0.6);
		transform: scale(1.08);
		animation: dawn 3s 0.3s cubic-bezier(0.3, 0, 0.2, 1) forwards;
	}

	.backdrop-shade {
		background:
			radial-gradient(ellipse at 50% 40%, rgba(5, 5, 6, 0.35), rgba(5, 5, 6, 0.8)),
			rgba(5, 5, 6, 0.3);
		pointer-events: none;
	}

	/* Panels */

	/* Hidden behind the intro until the origami is opened, then faded in. */
	.panels {
		position: relative;
		transition: opacity 0.8s ease;
	}

	.page.locked .panels {
		opacity: 0;
		visibility: hidden;
	}

	/*
		Sizes scale with the viewport between a phone minimum and a desktop maximum. The bottom
		padding keeps the letter clear of the Back / Next bar; the right leaves room for the rail.
	*/
	.panel {
		--pad-top: clamp(56px, 8dvh, 72px);
		--pad-bottom: clamp(92px, 14dvh, 120px);
		position: sticky;
		top: 0;
		display: grid;
		place-items: center;
		height: 100vh;
		height: 100dvh;
		padding: var(--pad-top) clamp(14px, 7vw, 88px) var(--pad-bottom) clamp(14px, 3vw, 24px);
	}

	/*
		The letter being read sits straight. Once the reader moves on, it settles into the stack
		at its own angle. `--shift` is unitless: about 1px per 10px of viewport, up to 1px.
	*/
	.letter {
		--offset: calc(var(--shift) * clamp(0.3px, 0.1vw, 1px));
		position: relative;
		width: 100%;
		max-width: 720px;
		filter: drop-shadow(0 26px 34px rgba(0, 0, 0, 0.55));
		transform-style: preserve-3d;
		transition:
			transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1),
			filter 0.7s ease;
	}

	.letter.behind {
		transform: translateX(var(--offset)) rotate(var(--tilt)) scale(0.97);
		filter: brightness(0.9) drop-shadow(0 26px 34px rgba(0, 0, 0, 0.55));
	}

	/* Unbleached kozo washi: fibres, fine grain and an uneven warm tone, with torn edges. */
	.frame {
		max-height: calc(100dvh - var(--pad-top) - var(--pad-bottom));
		overflow-y: auto;
		padding: clamp(22px, 4vw, 38px) clamp(20px, 4.5vw, 46px) clamp(22px, 3.5vw, 34px);
		background:
			var(--fibres),
			var(--noise),
			radial-gradient(ellipse at 20% 15%, rgba(255, 252, 244, 0.7), transparent 55%),
			radial-gradient(ellipse at 85% 90%, rgba(196, 170, 128, 0.18), transparent 60%),
			#efe5d1;
		mask: var(--deckle) 0 0 / 100% 100% no-repeat;
		scrollbar-width: thin;
		scrollbar-color: rgba(31, 26, 23, 0.25) transparent;
	}

	/* The folded outside of each letter. Both halves swing away once the letter is open. */

	.fold {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		background-color: #e7dbc3;
		backface-visibility: hidden;
		transition: transform 0.8s cubic-bezier(0.6, 0.05, 0.3, 1);
	}

	/* The outside of the sheet, a shade darker, with the same fibres; torn except at the fold. */
	.fold-top {
		top: 0;
		height: 50%;
		background-image:
			var(--fibres), var(--noise), linear-gradient(to bottom, transparent 60%, rgba(31, 26, 23, 0.1));
		mask: var(--deckle-fold-top) 0 0 / 100% 100% no-repeat;
		transform-origin: 50% 0;
		transition-delay: 0.3s;
	}

	.fold-bottom {
		bottom: 0;
		height: 50%;
		background-image:
			var(--fibres), var(--noise), linear-gradient(to top, transparent 60%, rgba(31, 26, 23, 0.1));
		mask: var(--deckle-fold-bottom) 0 0 / 100% 100% no-repeat;
		transform-origin: 50% 100%;
		transition-delay: 0.5s;
	}

	.open .fold-top {
		transform: perspective(1600px) rotateX(180deg);
	}

	.open .fold-bottom {
		transform: perspective(1600px) rotateX(-180deg);
	}

	.letter:not(.open) .fold {
		transition-delay: 0s;
	}

	.fold-num {
		color: var(--ink-soft);
		font-family: 'Shippori Mincho', serif;
		font-size: 14px;
		letter-spacing: 0.3em;
	}

	.fold-kanji {
		color: var(--ink);
		font-family: 'Shippori Mincho', serif;
		font-size: clamp(30px, 4.5vw, 46px);
		font-weight: 800;
		letter-spacing: 0.1em;
	}

	.fold-title {
		color: var(--ink);
		font-family: 'Shippori Mincho', serif;
		font-size: clamp(15px, 1.8vw, 20px);
		font-weight: 600;
	}

	.fold-from {
		color: var(--ink-soft);
		font-size: 11px;
		letter-spacing: 0.25em;
		text-transform: uppercase;
	}

	.band {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 64px;
		height: 120px;
		margin: -60px 0 0 -32px;
		background: var(--noise), #f8f2e6;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
		transform: translateZ(2px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.band span {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border: 2px solid var(--beni);
		border-radius: 50%;
		color: var(--beni);
		font-family: 'Shippori Mincho', serif;
		font-size: 20px;
		font-weight: 800;
	}

	.open .band {
		opacity: 0;
		transform: translateZ(2px) scale(0.8);
		pointer-events: none;
	}

	.letter:not(.open) .band {
		transition-delay: 0.6s;
	}

	.frame-head {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 20px;
		color: var(--beni);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.frame-grid {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: clamp(8px, 3.5vw, 40px);
	}

	.body > * {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
		transition-delay: calc(var(--i, 0) * 110ms + 900ms);
	}

	.letter:not(.open) .body > * {
		transition-delay: 0s;
	}

	.open .body > * {
		opacity: 1;
		transform: none;
	}

	h2 {
		margin-bottom: 16px;
		font-family: 'Shippori Mincho', serif;
		font-size: clamp(20px, 0.9rem + 1.2vw, 28px);
		font-weight: 600;
		line-height: 1.2;
	}

	.body p {
		max-width: 62ch;
		margin-bottom: 16px;
		font-family: 'Shippori Mincho', serif;
		font-size: clamp(12.5px, 0.72rem + 0.15vw, 13.5px);
		line-height: 1.75;
	}

	.lead {
		display: block;
		margin-bottom: 2px;
		color: var(--indigo);
		font-family: 'Zen Kaku Gothic New', system-ui, sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	mark {
		padding: 0 3px;
		border-bottom: 1px dashed currentColor;
		border-radius: 2px;
		background: rgba(181, 64, 42, 0.1);
		color: var(--beni);
	}

	.title-v {
		writing-mode: vertical-rl;
		color: var(--beni);
		font-family: 'Shippori Mincho', serif;
		font-size: clamp(30px, 4vw, 50px);
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.08em;
	}

	.signoff {
		display: flex;
		align-items: flex-end;
		gap: 20px;
		margin-top: 8px;
	}

	/* Links open in a new tab; the arrow says so. */
	.body a {
		color: var(--indigo);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		transition: color 0.2s ease;
	}

	.body a::after {
		content: ' ↗';
		font-size: 0.85em;
	}

	.body a:hover {
		color: var(--beni);
	}

	/* Shown while a letter's text runs past the paper; clicking scrolls the paper down. */
	.more {
		position: absolute;
		left: 50%;
		bottom: clamp(12px, 2.5vw, 20px);
		z-index: 2;
		transform: translateX(-50%);
		padding: 6px 14px;
		border: 1px solid rgba(31, 26, 23, 0.15);
		border-radius: 999px;
		background: rgba(239, 229, 209, 0.94);
		box-shadow: 0 4px 14px rgba(31, 26, 23, 0.18);
		color: var(--ink);
		font-family: 'Zen Kaku Gothic New', system-ui, sans-serif;
		font-size: 11px;
		letter-spacing: 0.08em;
		white-space: nowrap;
		cursor: pointer;
		animation: bob 2.4s ease-in-out infinite;
	}

	.more:hover {
		color: var(--beni);
	}

	@keyframes bob {
		0%,
		100% {
			transform: translate(-50%, 0);
		}
		50% {
			transform: translate(-50%, 3px);
		}
	}

	.hanko {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 16px;
		border: 2px solid var(--beni);
		border-radius: 6px;
		color: var(--beni);
		font-family: 'Shippori Mincho', serif;
		font-size: 18px;
		font-weight: 800;
		transform: rotate(-4deg);
		opacity: 0.85;
	}

	.again {
		margin-top: 8px;
		padding: 10px 18px;
		border: 1px solid rgba(31, 26, 23, 0.2);
		border-radius: 999px;
		background: none;
		color: var(--ink);
		font: 500 14px 'Zen Kaku Gothic New', system-ui, sans-serif;
		cursor: pointer;
	}

	.again:hover {
		border-color: var(--ink);
	}

	/* Voice note */

	.voice {
		display: flex;
		align-items: center;
		gap: 14px;
		max-width: 460px;
		margin: 4px 0 24px;
		padding: 10px 16px 10px 10px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background-color: rgba(255, 255, 255, 0.4);
	}

	.voice-play {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 50%;
		background: var(--beni);
		color: #fbeee0;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.voice-play svg {
		width: 14px;
		height: 14px;
		fill: currentColor;
	}

	.voice-play:active:not(:disabled) {
		transform: scale(0.94);
	}

	.voice-play:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.voice-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.voice-label {
		color: var(--ink-soft);
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.voice-wave {
		display: flex;
		align-items: center;
		gap: 2px;
		height: 22px;
	}

	.voice-wave span {
		flex: 1;
		max-width: 3px;
		border-radius: 2px;
		background-color: rgba(31, 26, 23, 0.2);
		transition: background-color 0.2s;
	}

	.voice-wave span.played {
		background-color: var(--beni);
	}

	.voice-time {
		flex-shrink: 0;
		color: var(--ink-soft);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
	}

	/* Fixed controls */

	.rail {
		position: fixed;
		top: 50%;
		right: 20px;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px 6px;
		border-radius: 999px;
		background: rgba(14, 12, 10, 0.35);
		backdrop-filter: blur(8px);
		transform: translateY(-50%);
	}

	.rail button {
		position: relative;
		padding: 8px 6px;
		border: none;
		border-radius: 999px;
		background: none;
		color: rgba(246, 239, 226, 0.55);
		cursor: pointer;
		transition: color 0.2s;
	}

	.rail button:hover {
		color: var(--cream);
	}

	.rail button[aria-current='step'] {
		color: #ffb59c;
	}

	.rail-kanji {
		writing-mode: vertical-rl;
		font-family: 'Shippori Mincho', serif;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.sound {
		position: fixed;
		top: clamp(12px, 2.5vw, 20px);
		left: clamp(12px, 2.5vw, 20px);
		z-index: 20;
		padding: 8px 14px;
		border-radius: 999px;
		background: rgba(14, 12, 10, 0.38);
		color: var(--cream);
		font-size: 12px;
		letter-spacing: 0.12em;
		backdrop-filter: blur(8px);
		border: none;
		font-family: inherit;
		cursor: pointer;
	}

	.rail button:focus-visible,
	.sound:focus-visible,
	.again:focus-visible,
	.voice-play:focus-visible,
	.pager button:focus-visible,
	.origami:focus-visible {
		outline: 2px solid #ffb59c;
		outline-offset: 2px;
	}

	/* Intro */

	.intro {
		position: fixed;
		inset: 0;
		z-index: 30;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: transparent;
	}

	.intro::before,
	.intro::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		z-index: 2;
		height: 9vh;
		background: #000;
		pointer-events: none;
	}

	.intro::before {
		top: 0;
	}

	.intro::after {
		bottom: 0;
	}

	.intro-shade {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.7));
		pointer-events: none;
	}

	.intro-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(20px, 6dvh, 48px);
		padding: 16px;
		text-align: center;
		pointer-events: none;
	}

	.intro-content .origami {
		pointer-events: auto;
	}

	.intro-sub,
	.intro-hint {
		color: rgba(246, 239, 226, 0.8);
		font-family: 'Shippori Mincho', serif;
		font-size: 15px;
		letter-spacing: 0.25em;
		opacity: 0;
		animation: appear 1s 2.6s ease forwards;
	}

	.intro-hint {
		font-family: 'Zen Kaku Gothic New', system-ui, sans-serif;
		font-size: 13px;
		letter-spacing: 0.15em;
		animation-delay: 3.3s;
		transition: opacity 0.3s;
	}

	.intro-hint.gone {
		visibility: hidden;
	}

	/*
		Origami: the HENNGE mark folded from washi. Its four flaps fold out over their outer edges
		into a flat sheet on its point, with 拝啓 in the middle.
	*/

	.origami {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		opacity: 0;
		transform: scale(0.55);
		perspective: 1400px;
		/* Same timing and curve as the background's `dawn`, so the two move as one. */
		animation: emerge 3s 0.3s cubic-bezier(0.3, 0, 0.2, 1) forwards;
	}

	.origami:disabled {
		cursor: default;
	}

	.paper {
		--s: clamp(130px, 38vmin, 220px);
		position: relative;
		display: block;
		width: var(--s);
		height: var(--s);
		transform-style: preserve-3d;
		transition: transform 1.2s cubic-bezier(0.6, 0.05, 0.25, 1);
	}

	.origami:hover:not(:disabled) .paper {
		transform: scale(1.04);
	}

	/* The open sheet is twice as wide, so it shrinks to stay in view. */
	.paper.open {
		transform: scale(0.62);
	}

	.base {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}

	.base svg,
	.face {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.base svg {
		filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.55));
	}

	.base-mark,
	.base-sheet {
		fill: #f4ecdb;
	}

	/* Fills the strips between the mark's curved sides and the unfolded flaps. */
	.base-sheet {
		opacity: 0;
		transition: opacity 0.3s 0.6s;
	}

	.open .base-sheet {
		opacity: 1;
	}

	.base-text {
		position: relative;
		color: var(--ink);
		font-family: 'Shippori Mincho', serif;
		font-size: calc(var(--s) * 0.2);
		font-weight: 800;
		writing-mode: vertical-rl;
		opacity: 0;
		transition: opacity 0.6s 1.3s;
	}

	.open .base-text {
		opacity: 1;
	}

	.flap {
		position: absolute;
		inset: 0;
		transform: translateZ(1px);
		transform-style: preserve-3d;
		transition: transform 0.9s cubic-bezier(0.65, 0.05, 0.3, 1);
	}

	.face {
		backface-visibility: hidden;
	}

	/* The back face is mirrored across the flap's own axis, so it lands where the front was. */
	.top .inside,
	.bottom .inside {
		transform: rotateY(180deg);
	}

	.left .inside,
	.right .inside {
		transform: rotateX(180deg);
	}

	.inside path {
		fill: #e8dcc4;
	}

	/* Each flap takes a different tone, as if lit from the top left, so the folds read. */
	.flap.top {
		transform-origin: 50% 0;
		transition-delay: 0.25s;
	}

	.flap.top .face:not(.inside) path {
		fill: #f8f2e5;
	}

	.flap.right {
		transform-origin: 100% 50%;
		transition-delay: 0.45s;
	}

	.flap.right .face:not(.inside) path {
		fill: #e4d8c0;
	}

	.flap.bottom {
		transform-origin: 50% 100%;
		transition-delay: 0.65s;
	}

	.flap.bottom .face:not(.inside) path {
		fill: #dacdb3;
	}

	.flap.left {
		transform-origin: 0 50%;
		transition-delay: 0.85s;
	}

	.flap.left .face:not(.inside) path {
		fill: #efe6d3;
	}

	.open .flap.top {
		transform: translateZ(1px) rotateX(180deg);
	}

	.open .flap.right {
		transform: translateZ(1px) rotateY(180deg);
	}

	.open .flap.bottom {
		transform: translateZ(1px) rotateX(-180deg);
	}

	.open .flap.left {
		transform: translateZ(1px) rotateY(-180deg);
	}

	/* The rest of the logo, under the folded mark. */
	.wordmark {
		width: clamp(100px, 22vmin, 160px);
		fill: rgba(246, 239, 226, 0.9);
		opacity: 0;
		animation: appear 1s 2.6s ease forwards;
	}

	.wordmark.gone {
		visibility: hidden;
	}

	/* Back / Next */

	.pager-wrap {
		position: fixed;
		bottom: clamp(12px, 2.5vw, 20px);
		left: 50%;
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		transform: translateX(-50%);
	}

	.pager-hint {
		padding: 6px 12px;
		border-radius: 999px;
		background: rgba(14, 12, 10, 0.55);
		color: var(--cream);
		font-size: 12px;
		letter-spacing: 0.1em;
		white-space: nowrap;
		backdrop-filter: blur(8px);
	}

	.pager {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px;
		border: 1px solid rgba(246, 239, 226, 0.18);
		border-radius: 999px;
		background: rgba(14, 12, 10, 0.6);
		backdrop-filter: blur(10px);
	}

	.pager button {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 8px 16px 8px 8px;
		border: none;
		border-radius: 999px;
		background: none;
		color: var(--cream);
		font: 500 13px 'Zen Kaku Gothic New', system-ui, sans-serif;
		letter-spacing: 0.12em;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.pager button.next {
		padding: 8px 8px 8px 16px;
	}

	.pager button:hover:not(:disabled) {
		background: rgba(246, 239, 226, 0.1);
	}

	.pager button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.pager-kanji {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1.5px solid currentColor;
		border-radius: 50%;
		font-family: 'Shippori Mincho', serif;
		font-size: 16px;
		font-weight: 800;
	}

	.next .pager-kanji {
		border-color: var(--beni);
		background: var(--beni);
	}

	.next.nudge .pager-kanji {
		animation: invite 2.2s ease-in-out infinite;
	}

	.pager-count {
		min-width: 64px;
		color: #ffb59c;
		font-family: 'Shippori Mincho', serif;
		font-size: 16px;
		text-align: center;
	}

	.pager-count small {
		color: rgba(246, 239, 226, 0.5);
		font-size: 12px;
	}

	@keyframes invite {
		50% {
			box-shadow: 0 0 0 8px rgba(181, 64, 42, 0.3);
		}
	}

	.intro-grain {
		position: absolute;
		inset: -20%;
		z-index: 3;
		background: var(--noise);
		opacity: 0.5;
		pointer-events: none;
		animation: grain 0.6s steps(3) infinite;
	}

	@keyframes dawn {
		to {
			filter: brightness(0.85) saturate(1);
			transform: scale(1);
		}
	}

	@keyframes emerge {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes appear {
		to {
			opacity: 1;
		}
	}

	@keyframes grain {
		33% {
			transform: translate(-3%, 2%);
		}
		66% {
			transform: translate(2%, -3%);
		}
	}

	/* Small screens */

	/* Small screens: sizes are already fluid, so this only changes the layout. */

	@media (max-width: 720px) {
		.pager-text {
			display: none;
		}

		.pager button,
		.pager button.next {
			padding: 6px;
		}

		.frame-grid {
			grid-template-columns: 1fr;
		}

		.title-v {
			order: -1;
			writing-mode: horizontal-tb;
		}

		.rail {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.next.nudge .pager-kanji,
		.intro-grain {
			animation: none;
		}

		.backdrop,
		.intro-sub,
		.intro-hint,
		.origami,
		.wordmark {
			animation-duration: 0.01s;
			animation-delay: 0s;
		}

		.body > *,
		.letter,
		.fold,
		.band,
		.paper,
		.flap,
		.base-sheet,
		.base-text {
			transition: none;
		}
	}
</style>
