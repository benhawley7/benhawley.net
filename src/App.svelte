<script>
  	import { Router, Link, Route } from "svelte-routing";
	import {link, push, pop, replace, location, querystring} from "svelte-spa-router";
	import Home from "./routes/Home.svelte";
	import Memes from "./routes/Memes.svelte";
	import Alexa from "./routes/Alexa.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	export let url = "";

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
	<Router url="{url}">
		<Route path="/" component="{Home}" />
		<Route path="/memes" component="{Memes}" />
		<Route path="/alexa" component="{Alexa}" />
	</Router>
</main>
<Footer/>

