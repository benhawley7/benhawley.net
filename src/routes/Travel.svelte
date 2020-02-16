<script>
import TravelChart from "../components/TravelChart.svelte";
import InterrailMap from "../components/InterrailMap.svelte";
import { onMount } from "svelte";
import {fade} from "svelte/transition";
import { chartsReady, mapsReady } from "../stores.js";

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

<div in:fade={300}>
    <h1>Travel</h1>
    <h2>Interrail 2020</h2>
    <p>Planned route for Interail Trip in Spring 2020.</p>
    {#if mapsLoaded}
        <InterrailMap/>
    {:else}
        <p>Loading that map for you...</p>
    {/if}
    <h2>Where have I been?</h2>
    <p>I wanted to mess with the Google Charts and Maps API so made this.</p> 
    {#if chartsLoaded}
        <TravelChart/>
    {:else}
        <p>Loading that map for you...</p>
    {/if}
</div>


