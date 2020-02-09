<script>
import {fade, slide} from 'svelte/transition'
import MemeTextGenerator from "../components/MemeTextGenerator.svelte";
</script>
<div in:fade="{{duration: 300}}">
    <h1>Memes</h1>
    <h2>Random Meme Tools</h2>
    <p>Very important page.</p>
    <MemeTextGenerator/>
</div>