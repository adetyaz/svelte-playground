interface Options {
	duration?: number;
}

export function flip(
	node: HTMLElement,
	{ from, to }: { from: DOMRect; to: DOMRect },
	options: Options = {}
) {
	const { duration = 2000 } = options;
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const dsx = from.width / to.width;
	const dsy = from.height / to.height;

	console.table({ dx, dy, dsx, dsy });

  return {
    duration,
    css: (t: number, u:number) => {
      const x = dx * u
      const y = dy * u
      const sx = dsx + (1 - dsx) * t
      const sy = dsy + (1 - dsy) * t

      return `transform: translate(${x}px, ${y}px scale(${sx}, ${sy}))`
    }
  }
}
