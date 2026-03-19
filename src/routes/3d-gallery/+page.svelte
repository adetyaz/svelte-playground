<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { galleryImages } from '$lib/utils/data';

	// https://www.clouarchitects.com/projects/

	const defaultImage =
		'https://plus.unsplash.com/premium_photo-1733493684048-7dbae9f32e38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFsaXxlbnwwfDB8MHx8fDA%3D';

	const defaultTitle = 'Dancing Pillars';
	const defaultSubtitle = 'A mesmerizing dance of light and sound';

	/**
	 * @type {gsap.TweenTarget}
	 */
	let gallery;
	/**
	 * @type {gsap.TweenTarget}
	 */
	let image;
	/**
	 * @type {string | HTMLParagraphElement}
	 */
	let previewTitle;
	/**
	 * @type {string | HTMLParagraphElement}
	 */
	let previewSubtitle;
	/**
	 * @type {string | any[]}
	 */
	let galleryItems = $state([]);
	let clientX = $state(0);
	let clientY = $state(0);

	let previewImageSrc = $state(defaultImage);
	let title = $state(defaultTitle);
	let subtitle = $state(defaultSubtitle);

	const newImages = galleryImages;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.set(gallery, { xPercent: -50, rotateX: 50 });
		gsap.set([previewTitle, previewSubtitle], { y: 100, opacity: 0 });

		const totalItems = galleryItems.length;
		const angleIncrement = 360 / totalItems;

		galleryItems.forEach((item, index) => {
			gsap.set(item, {
				rotationY: 90,
				rotationZ: index * angleIncrement + 2 - 90,
				transformOrigin: '50% 400px'
			});

			gsap.fromTo(
				item,
				{ opacity: 0 },
				{ opacity: 1, duration: 1, delay: index * 0.01, stagger: 0.1 }
			);

			item.addEventListener('mouseover', () => {
				previewImageSrc = galleryImages[index].image;
				title = galleryImages[index].title;
				subtitle = galleryImages[index].subtitle;

				gsap.to([previewTitle, previewSubtitle], {
					y: 0,
					opacity: 1,
					duration: 0.5,
					stagger: 0.1,
					ease: 'power3.out',
					delay: 1
				});
				gsap.to(image, {
					scale: 0.95,
					ease: 'power3.inOut'
				});

				gsap.to(item, {
					y: 10,
					x: 10,
					z: 40,
					ease: 'power1.out',
					duration: 0.3
				});
			});

			item.addEventListener('mouseout', () => {
				previewImageSrc = defaultImage;
				title = defaultTitle;
				subtitle = defaultSubtitle;
				gsap.to([previewTitle, previewSubtitle], {
					y: 100,
					opacity: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: 'power3.out'
				});
				gsap.to(image, {
					scale: 1,
					ease: 'power3.out'
				});

				gsap.to(item, {
					y: 0,
					x: 0,
					z: 0,
					ease: 'power1.out',
					duration: 0.3
				});
			});
		});

		// gallery.style.visibility = 'visible';

		window.addEventListener('mousemove', handleMousemove);
		ScrollTrigger.create({
			trigger: 'body',
			start: 'top top',
			end: 'bottom bottom',
			scrub: 1,
			onUpdate: (self) => {
				const rotationProgress = self.progress * 360 * 1;

				galleryItems.forEach((item, index) => {
					const currentAngle = index * angleIncrement - 90 + rotationProgress;
					gsap.to(item, {
						rotationZ: currentAngle,
						duration: 1,
						ease: 'power3.out',
						overwrite: 'auto'
					});
				});
			}
		});
		return () => window.removeEventListener('mousemove', handleMousemove);
	});

	/**
	 * @param {{ clientX: number; clientY: number; }} e
	 */
	function handleMousemove(e) {
		clientX = e.clientX;
		clientY = e.clientY;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		const percentX = (clientX - centerX) / centerX;
		const percentY = (clientY - centerY) / centerY;

		const rotateX = 50 + percentY * 2;
		const rotateY = percentX * 2;

		if (galleryItems) {
			gsap.to(gallery, {
				rotateX,
				rotateY,
				duration: 0.5,
				overwrite: 'auto',
				opacity: 1
				// visibility: 'visible'
			});
		}
	}
</script>

<main>
	<div class="gallery-container">
		<div class="preview-image">
			<div class="title">
				<h1 bind:this={previewTitle}>{title}</h1>
			</div>
			<div class="subtitle">
				<p bind:this={previewSubtitle}>{subtitle}</p>
			</div>
			<img src={previewImageSrc} alt="Preview" bind:this={image} />
		</div>
		<div class="gallery" bind:this={gallery}>
			{#each newImages as item, index (index)}
				<div class="elements" bind:this={galleryItems[index]}>
					<img src={item.image} alt={item.title} />
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		min-height: 200svh;
	}

	.gallery-container {
		background: red;
		perspective: 1500px;
		position: fixed;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	.preview-image {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.preview-image img {
		width: 250px;
		height: 150px;
		object-fit: cover;
		margin-inline: auto;
	}

	h1,
	p {
		color: white;
		font-family: monospace;
		text-align: center;
	}

	h1 {
		font-size: 1.8rem;
	}

	p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
	}

	.title,
	.subtitle {
		overflow: hidden;
	}

	.gallery {
		position: absolute;
		background: rgb(94, 225, 65);
		top: 18%;
		left: 50%;
		transform-style: preserve-3d;
		/* transform: translateX(-50%) rotateX(-55deg); */
		/* visibility: hidden; */
	}

	.elements {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		/* background: blue; */
		height: 4rem;
		width: 3rem;
		margin: 10px;
		transform-style: preserve-3d;
	}

	.elements img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 600px) {
		.preview-image img {
			width: 200px;
			height: 120px;
		}

		h1 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1rem;
		}
	}

	/* .elements:nth-child(2) {
		transform: rotateY(90deg) translateZ(50px);
	}
	.elements:nth-child(3) {
		transform: rotateY(180deg) translateZ(50px);
	}
	.elements:nth-child(4) {
		transform: rotateY(270deg) translateZ(50px);
	}
	.elements:nth-child(5) {
		transform: rotateY(360deg) translateZ(50px);
	}
	.elements:nth-child(6) {
		transform: rotateY(60deg) translateZ(50px);
	} */

	/* edditing position */
	/* .elements:nth-child(6) {
		transform-origin: 50% 400px;
		background: aqua;
	} */
</style>
