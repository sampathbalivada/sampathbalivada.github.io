<script>
	import MediaQuery from "./MediaQuery.svelte";

	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
	import Ikigai from "./components/Ikigai.svelte";
	import Blog from "./components/Blog.svelte";
</script>

<!-- for desktop -->
<MediaQuery query="(min-width: 481px)" let:matches>
	{#if matches}
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
	{/if}
</MediaQuery>

<!-- for mobile -->
<MediaQuery query="(max-width: 480px)" let:matches>
	{#if matches}
		<main>
			<Header />
			<Ikigai isMobile={true}/>
			<Blog />
			<Footer />
		</main>
	{/if}
</MediaQuery>

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
