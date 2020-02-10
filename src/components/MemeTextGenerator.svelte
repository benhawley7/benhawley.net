<script>
import MemeText from "../lib/meme-text.js";
import Card from "./Card.svelte";
import RadioSelector from "./RadioSelector.svelte";


import { onMount, tick } from 'svelte';

const types = MemeText.getAvailableTypes();

let selected; 
let name = "meme-text-choice"
let inputText = "Here is some sample text for y'all.";
let insertion = "🤠";
let memeText = "";
let flip = false;

function onFlip() {
    flip = !flip;
    updateMemeText()
}

function onCopy() {
    const memeOutput = document.querySelector(".js-meme-output");
    memeOutput.select();
    document.execCommand("copy");
}

async function updateMemeText() {
    memeText = MemeText.getMemeTextByType(inputText, flip, selected, insertion);
}


updateMemeText();
</script>

<Card title="Lets meme some strings.">
    <p>Choose your style.</p>
    <RadioSelector {name} options={types} bind:selected={selected} on:change={updateMemeText}/>
    <p>Type your text.</p>
    <div class="input-box">
        <input type="text" bind:value={inputText} class="meme-text-input" on:keyup={updateMemeText}/>
        <button class="button" on:click={onFlip}>Flip</button>
    </div>
    {#if selected === "Inserted"}
        <p>Choose your insertion.</p>
        <input type="text" bind:value={insertion} class="meme-text-input meme-text-input--center" on:keyup={updateMemeText}/>
    {/if}

    <p>Copy dem memes.</p>
    <textarea class="meme-text-output__text js-meme-output">{memeText}</textarea>
    <button class="button" on:click={onCopy}>Copy</button>
</Card>

<style>
.input-box {
    display: flex;
    margin-bottom: 1rem;
}
.meme-text-input {
    padding: 0.5rem;
    font-size: 1rem;
    min-width: 16rem;
}

.meme-text-input--center {
    text-align: center;
}

.meme-text-output__text {
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #d8d8d8;
    color: black;
    height: 4rem;
    width: 100%;
    font-size: 1rem;
    min-width: 8rem;
}
</style>