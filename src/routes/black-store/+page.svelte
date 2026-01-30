<script lang="ts">
	import imageOne from '$lib/assets/images/image-1.png';
	import imageTwo from '$lib/assets/images/image-2.png';
	import imageThree from '$lib/assets/images/image-3.png';
	import imageFour from '$lib/assets/images/image-4.png';
	import imageFive from '$lib/assets/images/image-5.png';
	import imageSix from '$lib/assets/images/image-6.png';
	import imageSeven from '$lib/assets/images/image-7.png';
	import imageEight from '$lib/assets/images/image-8.png';
	import imageNine from '$lib/assets/images/image-9.png';


  const data = [
		{
			id: 1,
			src: imageOne,
			alt: 'Image 1',
			title: 'Mnml Chair',
			subtitle: '46cm Brunnies'
		},
		{
			id: 2,
			src: imageTwo,
			alt: 'Image 2',
			title: 'Mnml Watch',
			subtitle: '32cm - Cronograph'
		},
		{
			id: 3,
			src: imageThree,
			alt: 'Image 3',
			title: 'Mnml Jug',
			subtitle: '18cm - Yellow'
		},
		{
			id: 4,
			src: imageFour,
			alt: 'Image 4',
			title: 'Mnml Triangle',
			subtitle: '60cm - Standing'
		},
		{
			id: 5,
			src: imageFive,
			alt: 'Image 5',
			title: 'Mnml Player',
			subtitle: '120cm - Oak'
		},
		{
			id: 6,
			src: imageSix,
			alt: 'Image 6',
			title: 'Mnml Bag',
			subtitle: '45cm - Length'
		},
		{
			id: 7,
			src: imageSeven,
			alt: 'Image 7',
			title: 'Mnml Jug',
			subtitle: '200cm - Grey'
		},
		{
			id: 8,
			src: imageEight,
			alt: 'Image 8',
			title: 'Mnml Spring',
			subtitle: '180cm - Steel'
		},
		{
			id: 9,
			src: imageNine,
			alt: 'Image 9',
			title: 'Mnml Basket',
			subtitle: '150cm - Wool'
		}

		// Add more as needed
	];

	const rows = [
		data.slice(0, 2), // IDs 1-2
		data.slice(2, 5), // IDs 3-5
		data.slice(5, 9) // IDs 6-9
	];

  function removeImage(datum){
    console.log('removing', datum);
    const index = data.findIndex(item => item.id === datum.id);
    data.splice(index, 1);
    console.log(data.splice(index, 1));
  }
</script>

<main class="min-h-screen bg-gray-950">
	<div class="max-w-6xl py-8 grid grid-cols-3 gap-6 mx-auto">
	  <!-- {#each rows as row} -->
	  	<div class="grid gap-6">
	  		{#each data as item}
	  			<figure
	  				class="group relative h-fit cursor-pointer overflow-hidden rounded-[12px] border-orange-600 bg-black transition-all hover:border-2"
	  			  onclick={() => removeImage(item)}
          >
            <!-- <button class="rounded absolute top-2 right-2 py-1 px-4 bg-purple-800 text-white" >Delete</button> -->
	  				<img src={item.src} alt={item.alt} class="transition-transform group-hover:scale-105" />
	  				<div
	  					class="absolute inset-0 bg-linear-to-b from-white/20 to-black opacity-0 transition-opacity duration-300 hover:opacity-60"
	  				></div>
	  				<figcaption
	  					class="absolute bottom-0 translate-y-20 p-4 transition-transform group-hover:translate-y-0"
	  				>
	  					<h1 class="text-xl font-bold text-white">{item.title}</h1>
	  					<p class="text-gray-300">{item.subtitle}</p>
	  				</figcaption>
	  			</figure>
	  		{/each}
	  	</div>
	  <!-- {/each} -->
	</div>
</main>
