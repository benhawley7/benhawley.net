<script>
import { createEventDispatcher, onMount } from 'svelte';



export let options;
export let name;
export let selected;
let group;

onMount(() => {
    if (selected) {
        group = selected;
    }
})

const dispatch = createEventDispatcher();
function onClick() {
    selected = group;
    dispatch("change");
}
</script>

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

</style>

<div class="radio-selector">
    {#each options as option}
        <input type="radio" id={option} name={name} bind:group={group} value={option} on:change={onClick}>
        <label class="radio-selector__button" for={option}>{option}</label>
    {/each}
</div>