<script>
import {fade, slide} from 'svelte/transition'
import MemeTextGenerator from "../components/MemeTextGenerator.svelte";
import {onMount} from "svelte";
onMount(() => {
    document.title = "Memes / Ben Hawley";
})
</script>
<div in:fade="{{duration: 300}}">
    <h1>Memes</h1>
    <h2>Random Meme Tools</h2>
    <p>Very important page.</p>
    <div class="meme-container">
        <MemeTextGenerator/>
    </div>
</div>
<style>
.meme-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>