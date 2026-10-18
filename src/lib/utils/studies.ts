// Each study carries its own ease curve, plotted like a drawing on the sheet.
export const CURVES = {
	out: { ease: 'expo.out', d: 'M0,40 C22,2 34,0 60,0' },
	inOut: { ease: 'expo.inOut', d: 'M0,40 C26,40 34,0 60,0' },
	back: { ease: 'back.out', d: 'M0,40 C14,-8 30,-6 60,0' },
	elastic: { ease: 'elastic.out', d: 'M0,40 C8,-12 14,8 22,-5 C30,-14 40,3 60,0' },
	steps: { ease: 'steps(4)', d: 'M0,40 L15,40 L15,27 L30,27 L30,14 L45,14 L45,0 L60,0' },
	linear: { ease: 'none', d: 'M0,40 L60,0' }
} as const;

export type CurveKey = keyof typeof CURVES;

export type Study = {
	slug: string;
	title: string;
	note: string;
	tag: string;
	curve: CurveKey;
	/** Screenshot of the route, when one has been captured. */
	shot?: string;
};

// Card tints, sampled from trading-card stock: pink, cyan, blue, cream, lilac, frost.
export const TINTS = ['#f4b8e4', '#4fe3d2', '#7d8cff', '#f1e4cc', '#c8b6ff', '#e6edf6'];

/** A barcode that is stable per slug, drawn as a repeating gradient. */
export const barcode = (slug: string) => {
	const stops: string[] = [];
	let x = 0;
	for (let i = 0; i < slug.length * 2 && x < 96; i++) {
		const code = slug.charCodeAt(i % slug.length);
		const bar = 1 + (code % 3);
		const gap = 1 + ((code >> 2) % 3);
		stops.push(`currentColor ${x}px ${x + bar}px`, `transparent ${x + bar}px ${x + bar + gap}px`);
		x += bar + gap;
	}
	return `linear-gradient(90deg, ${stops.join(', ')})`;
};
