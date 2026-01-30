<script lang="ts">
	import { crossfade, scale } from 'svelte/transition';
	import {flip} from 'svelte/animate';
	// import { flip } from '$lib/utils/animation';

	const [send, receive] = crossfade({
		delay: 100,
		duration: (d) => Math.sqrt(d * 2000), //d for distance
		fallback(node) {
			return {
				css: (t) => `
				transform: scale(${t * 0.55});
				opacity: ${t * 0.5};
			`
			};
		}
	});

	interface Post {
		id: number;
		title: string;
		description: string;
		published: boolean;
	}

	let posts = $state<Post[]>([
		{
			id: 1,
			title: 'Post',
			description: 'Content',
			published: true
		},
		{
			id: 2,
			title: 'Post',
			description: 'Content',
			published: true
		},
		{
			id: 3,
			title: 'Post',
			description: 'Content',
			published: true
		},
		{
			id: 4,
			title: 'Post',
			description: 'Content',
			published: true
		},
		{
			id: 5,
			title: 'Post',
			description: 'Content',
			published: true
		}
		// ...
	]);

	function togglePublished(post: Post) {
		const index = posts.findIndex((p) => p.id === post.id);
		posts[index].published = !posts[index].published;
	}

	function removePost(post: Post) {
		const index = posts.findIndex((p) => p.id === post.id);
		posts.splice(index, 1);
	}
</script>

<div class="posts">
	<h2>Posts</h2>
	<section>
		{#each posts.filter((posts) => posts.published) as post (post)}
			<article class="border px-2" animate:flip in:receive={{ key: post }} out:send={{ key: post }}>
				<h3>{post.title}</h3>
				<p>{post.description}</p>
				<div>
					<button onclick={() => togglePublished(post)}>💾</button>
					<button onclick={() => removePost(post)}>❌</button>
				</div>
			</article>
		{:else}
			<p>There are no posts.</p>
		{/each}
	</section>
</div>

<div class="archive">
	<h2>Archive</h2>
	<section>
		{#each posts.filter((posts) => !posts.published) as post (post)}
			<article class="border px-2" animate:flip in:receive={{ key: post }} out:send={{ key: post }}>
				<h3>{post.title}</h3>
				<div>
					<button onclick={() => togglePublished(post)}>♻️</button>
				</div>
			</article>
		{:else}
			<p>Archived items go here.</p>
		{/each}
	</section>
</div>

<style>
	.posts {
		display: flex;

		section {
			display: grid;
			grid-template-columns: repeat(2, 240px);
			gap: 2rem;
		}
	}

	.archive {
		/* background-color: firebrick; */
		section {
			display: block;
			width: 200px;
			margin-top: 1rem;

			article:not(:last-child) {
				margin-bottom: 1rem;
			}
		}
	}

	p {
		margin-bottom: 0.5rem;
	}
</style>
