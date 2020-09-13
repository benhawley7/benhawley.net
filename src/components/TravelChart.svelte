<script>
    import {onMount} from "svelte";
    import {fade} from "svelte/transition";

    let container;
    let mapLoaded = false;

    async function loadChart() {
        google.charts.load("current", {
            packages: ["geochart"],
            mapsApiKey: ""
        });
        google.charts.setOnLoadCallback(drawRegionsMap);

        function drawRegionsMap() {
            mapLoaded = true;
            var data = google.visualization.arrayToDataTable([
                ["Country"],
                ["United Kingdom"],
                ["Canada"],
                ["France"],
                ["Spain"],
                ["Greece"],
                ["Italy"],
                ["Turkey"]
            ]);

            var options = {
                colorAxis: {colors: ["#00853f", "black", "#e31b23"]},
                backgroundColor: "#262626",
                datalessRegionColor: "#ffffff",
                defaultColor: "#f26c4f"
            };

            var chart = new google.visualization.GeoChart(container);

            chart.draw(data, options);
        }
    }
    onMount(async () => {
        loadChart();
    });
</script>

{#if !mapLoaded}
    <p class="loading">Loading that Map for you.</p>
{/if}
<div class="map-container" in:fade={300}>
    <div class="map" bind:this={container} />
</div>

<style>
    .map-container {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .map {
        width: 100%;
        max-width: 50rem;
    }

    .loading {
        font-size: 1.5rem;
        margin-top: 3rem;
    }
</style>
