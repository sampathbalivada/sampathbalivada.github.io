<script>
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
	import Ikigai from "./components/Ikigai.svelte";
	import Blog from "./components/Blog.svelte";
</script>

<main>
	<Header />
	<span>
		<div>
			<Ikigai />
		</div>
		<div>
			<Blog />
		</div>
	</span>
	<Footer />
</main>

<style>
	span {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	span > * {
		flex: 1 1 0;
	}

	main {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	main > * {
		flex: 1 1 0;
	}
	
</style>
