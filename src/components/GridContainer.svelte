
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
</style>
