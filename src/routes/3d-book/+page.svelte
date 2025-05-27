<div class="grid h-screen place-items-center bg-amber-950 text-center">
	<div class="grid-item">
		<div class="sf-book-cover">
			<a href="#/" class="book-wrapper">
				<div class="cover">
					<i class="fa-regular fa-folder"></i>
					<span class="number">01</span>
					<p>Chapter 1</p>
					<h4>Introduction</h4>
				</div>
				<div class="page page-1"></div>
				<div class="page page-2"></div>
				<div class="page page-3"></div>
			</a>
		</div>
		<p>An overview of the purpose, scope and audience for the documentation</p>
	</div>
</div>

<style>
	.sf-book-cover {
		--sf-book-cover-bg: #212121;
		--sf-book-cover-title: #fff;
		--sf-book-cover-icon: #63d9b3;
		--sf-book-cover-page-1: #efefef;
		--sf-book-cover-page-2: #f5f5f5;
		--sf-book-cover-page-3: #fafafa;
	}

	.sf-book-cover {
		width: 200px;
		margin: 0 auto 30px;
	}

	.sf-book-cover a.book-wrapper {
		display: block;
		position: relative;
		width: 200px;
		height: 280px;
		perspective: 900px;
		transition: all 0.2s ease-in-out;
	}

	.sf-book-cover a.book-wrapper > div {
		display: flex;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 0 5px 5px 0;
		box-shadow: 1px 0 4px -1px rgba(0, 0, 0, 0.08);
		transform-style: preserve-3d;
		transition: all 0.4s ease-in-out;
		will-change: transform;
		transform-origin: 0 50% 0;
	}

	.sf-book-cover a.book-wrapper .cover {
		justify-content: flex-end;
		align-items: flex-start;
		flex-direction: column;
		padding: 30px;
		z-index: 2;
		background-color: var(--sf-book-cover-bg);
		background-image: url('/images/book-cover.png');
		background-repeat: no-repeat;
		background-size: cover;
		color: var(--sf-book-cover-title);
		overflow: hidden;
	}

	.sf-book-cover a.book-wrapper .cover i {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 30;
		top: 30px;
		width: 60px;
		height: 60px;
		border-radius: 10px;
		font-size: 26px;
		color: var(-sf-book-cover-icon);
		border: 2px double var(--sf-book-cover-icon);
	}

	.sf-book-cover a.book-wrapper .cover .number {
		position: absolute;
		right: -15px;
		bottom: 0px;
		z-index: -1;
		font-size: 120px;
		color: #2c2c2c;
	}

	.sf-book-cover a.book-wrapper .cover p {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 5px;
	}

	.sf-book-cover a.book-wrapper .cover h4 {
		font-size: 22px;
		font-weight: 500;
	}

	.sf-book-cover a.book-wrapper .page-1 {
		background-color: var(--sf-book-cover-page-1);
	}

	.sf-book-cover a.book-wrapper .page-2 {
		background-color: var(--sf-book-cover-page-2);
	}

	.sf-book-cover a.book-wrapper .page-3 {
		background-color: var(--sf-book-cover-page-3);
	}

	.sf-book-cover a.book-wrapper:hover {
		transform: rotate(3deg);
	}

	.sf-book-cover a.book-wrapper:hover .page-1 {
		transform: rotateY(0);
	}

	.sf-book-cover a.book-wrapper:hover .page-2 {
		transform: rotateY(-24deg);
	}

	.sf-book-cover a.book-wrapper:hover .page-3 {
		transform: rotateY(-31deg);
	}

	.sf-book-cover a.book-wrapper:hover .cover {
		transform: rotateY(-37deg);
	}
</style>
