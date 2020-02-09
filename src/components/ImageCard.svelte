<script>
export let imageLeft;
export let imageAlt; 
export let imageURL;
export let url;
export let imageCardData;
export let responsive = true;

</script>
<div class="image-card" left={imageLeft} {responsive}>
    <div class="image-card__img-container">
        <a href={url}>
            <img  alt={imageAlt} src={imageURL}/>
        </a>
    </div>
    <div class="image-card__text-container">
        {#each imageCardData as data}
           <div class="image-card__text-container__sub-container" highlight={data.background === "highlight"}>
                <h3>{data.title}</h3>
                {@html data.content}
            </div>    
        {/each}
    </div>
</div>


<style>
.image-card {
    display: flex;
    background-color: var(--background-color);
    border: 2px solid var(--highlight-color);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
}

.image-card[left=true] {
    flex-direction: row-reverse;
}

.image-card[responsive=false] {
    flex-direction: column;
}

.image-card__img-container {
    flex: 1;
    background-color: var(--highlight-color);
    width: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.image-card[responsive=false] .image-card__img-container{
    flex: unset;
}

.image-card__img-container a {
    height: 100%;
}

.image-card__img-container img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    transition: 300ms cubic-bezier(0.37, 0.81, 1, 1);
}

.image-card__img-container img:hover {
    transform: scale(1.05);
    opacity: 0.85;
}

.image-card__text-container {
    flex: 2;
    display: flex;
}

.image-card__text-container__sub-container {
    padding: 1rem;
    flex: 1;
    /* border-left: 2px solid var(--highlight-color); */
}

/* .image-card__text-container__sub-container[highlight] {
    background-color: var(--highlight-color);
} */

@media only screen and (max-width: 500px) {
    .image-card {
        flex-direction: column;
    }
    .image-card[left] {
        flex-direction: column;
    }

    .image-card__img-container {
        width: 100%;
    }
    .image-card__img-container img {
        height: 20rem;
    }
}

@media only screen and (max-width: 400px) {
    .image-card__text-container {
        flex-direction: column;
    }
}
</style>