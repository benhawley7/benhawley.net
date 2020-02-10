<script>
import { createEventDispatcher, onMount } from 'svelte';
export let options;
export let name;
export let selected = [];
export let multiple;
const dispatch = createEventDispatcher();
</script>

<div class="radio-selector">
    {#each options as option}
        {#if multiple}
            <input type="checkbox" id={option} bind:group={selected} name={option} value={option} on:change={() => dispatch("change")}>
        {:else}
            <input type="radio" id={option} name={name} bind:group={selected} value={option} on:change={() => dispatch("change")}>
        {/if}
        <label class="radio-selector__button" for={option}>{option}</label>
    {/each}
</div>

<style>

.radio-selector {
    display: flex;
    margin: 0.5rem 1.5rem 1.5rem 1.5rem;
}

input {
    display: none;
}

.radio-selector__button {
    flex: 1;
    color: black;
    background-color: white;
    border: 1px solid var(--highlight-color);
    padding: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 300ms linear;
}

input[type=radio]:checked + label {
    background-color: var(--highlight-color);
    color: white;
}

input[type=checkbox]:checked + label {
    background-color: var(--highlight-color);
    color: white;
}
</style>