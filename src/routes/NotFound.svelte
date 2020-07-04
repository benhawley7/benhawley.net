<script>
    import {fade, slide} from "svelte/transition";
    import {onMount} from "svelte";
    onMount(() => {
        document.title = "404 / Ben Hawley";
    });
</script>

<div class="content" in:fade={{duration: 300}}>
    <section class="content-section">
        <h1>Wrong page matey.</h1>
        <p>
            <a href="/">Go home.</a>
        </p>
    </section>
</div>
