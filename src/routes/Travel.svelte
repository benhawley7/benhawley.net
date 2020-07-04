<script>
    import TravelChart from "../components/TravelChart.svelte";
    import InterrailMap from "../components/InterrailMap.svelte";
    import {onMount} from "svelte";
    import {fade} from "svelte/transition";
    import {chartsReady, mapsReady} from "../stores.js";

    let chartsLoaded = false;
    chartsReady.subscribe(value => {
        if (value) {
            chartsLoaded = true;
        }
    });

    let mapsLoaded = false;
    mapsReady.subscribe(value => {
        if (value) {
            mapsLoaded = true;
        }
    });
</script>

<div class="content" in:fade={300}>
    <section class="content-section">
        <h1>Travel</h1>
        <p>
            Like everyone else, I have a big passion for travelling - this page leverages this Google Maps API to show my planned routes and track where I have been.
        </p>
    </section>
    <section class="content-section">
        <h1>Interrail 2020</h1>
        <p>
            Before Coronavirus came along, I was planning an Interrail trip across Europe. Below is my original planned route, I hope to be able to do the trip very soon!
        </p>
        {#if mapsLoaded}
            <InterrailMap />
        {:else}
            <p>Loading that map for you...</p>
        {/if}
    </section>
    <section class="content-section">
        <h1>Where have I been?</h1>
        {#if chartsLoaded}
            <TravelChart />
        {:else}
            <p>Loading that map for you...</p>
        {/if}
    </section>
</div>
