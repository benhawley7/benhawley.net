<script>
import {fade, slide} from 'svelte/transition'
import {onMount} from "svelte";
onMount(() => {
    document.title = "404 / Ben Hawley";
})
</script>
<div in:fade="{{duration: 300}}">
    <h1>Wrong page matey.</h1>
    <p><a href="/">Go home.</a></p>
</div>