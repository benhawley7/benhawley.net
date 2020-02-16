<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import Memes from "./routes/Memes.svelte";
	import Alexa from "./routes/Alexa.svelte";
	import Travel from "./routes/Travel.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
	import { chartsReady, mapsReady } from "./stores.js";


	export let url = "";

	function chartsLoaded() {
		chartsReady.set(true);
	}
	function mapsLoaded() {
		mapsReady.set(true);
	}

</script>

<style>
main {
    margin: 4rem 5rem;
    min-height: 76vh;
}

@media only screen and (max-width: 720px) {
	main {
		margin: 4.5rem 1rem;
		min-height: 78vh;
	}
}
</style>

<svelte:head>
	<script defer async on:load={chartsLoaded} src="https://www.gstatic.com/charts/loader.js">
	</script>
	<script defer async on:load={mapsLoaded}
		src="https://maps.googleapis.com/maps/api/js?key="></script>
</svelte:head>

<Header/>
<main>
	<Router url="{url}">
		<Route path="/" component="{Home}" />
		<Route path="/memes" component="{Memes}" />
		<Route path="/alexa" component="{Alexa}" />
		<Route path="/travel" component="{Travel}" />
	</Router>
</main>
<Footer/>

