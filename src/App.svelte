<script>
	import Router from "svelte-spa-router";
	import {link, push, pop, replace, location, querystring} from "svelte-spa-router";
	import Home from "./routes/Home.svelte";
	import Memes from "./routes/Memes.svelte";
	import Alexa from "./routes/Alexa.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	const routes = {
		"/": Home,
		"/memes": Memes,
		"/alexa": Alexa,
		"*": NotFound
	};

	// Handles the "routeLoaded" event dispatched by the router after a route has been successfully loaded
	function routeLoaded(event) {
		// eslint-disable-next-line no-console
		console.info('Caught event routeLoaded', event.detail)
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

<Header/>
<main>
	<Router {routes} on:routeLoaded={routeLoaded}/>
</main>
<Footer/>

