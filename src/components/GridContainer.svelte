
<div class="grid">
    <slot/>
</div>

<style>
.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1rem;
}


@media only screen and (max-width: 460px) {
    .grid {
        grid-template-columns: auto;
    }
}

@media only screen and (min-width: 50rem) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
