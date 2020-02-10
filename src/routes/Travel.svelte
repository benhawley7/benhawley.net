<script>
import Map from "../components/Map.svelte";
import { onMount } from "svelte";
import {fade} from "svelte/transition";
import { chartsReady } from "../stores.js";

onMount(() => {
    console.log("Mounted", new Date().getMilliseconds());
});
let scriptLoaded = false;
chartsReady.subscribe(value => {
    if (value) {
        scriptLoaded = true;
    }
});

</script>

<div in:fade={300}>
    <h1>Travel</h1>
    <p>I wanted to mess around with the Google Maps and Charts API. So here is every country I've been to.</p>
    {#if scriptLoaded}
        <Map/>
    {:else}
        <p>Loading that map for you...</p>
    {/if}
</div>


