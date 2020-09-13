<script>
    // Svelte Router to allow SPA functionalty.
    import {Router, Link, Route} from "svelte-routing";

    // Routes for the site
    import Home from "./routes/Home.svelte";
    import Memes from "./routes/Memes.svelte";
    import Alexa from "./routes/Alexa.svelte";
    import Travel from "./routes/Travel.svelte";
    import NotFound from "./routes/NotFound.svelte";

    // Header and Footer for all routes
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";

    // We set stores when Google Charts and Maps have loaded
    import {chartsReady, mapsReady} from "./stores.js";

    export let url = "";

</script>

<svelte:head>
    <script
        defer
        async
        on:load={() => chartsReady.set(true)}
        src="https://www.gstatic.com/charts/loader.js">

    </script>
    <script
        defer
        async
        on:load={() => mapsReady.set(true)}
        src="https://maps.googleapis.com/maps/api/js?key=">

    </script>
</svelte:head>

<Header />
<main>
    <Router {url}>
        <Route path="/" component={Home} />
        <Route path="/memes" component={Memes} />
        <Route path="/alexa" component={Alexa} />
        <Route path="/travel" component={Travel} />
        <Route path="*" component={NotFound} />
    </Router>
</main>
<Footer />

<style>
    main {
        min-height: 85vh;
    }
</style>
