<script>
export let small = false;
export let text = true;
</script>

<div class="social-media {small ? "social-media--small": ""} {text ? "" : "social-media--no-text"}">
    <div class="social-media__item">
        <a href="https://github.com/benhawley7">
            <img class="icon" alt="My GitHub Page" src="/assets/github.svg">
            {#if text}
                <label>GitHub</label>
            {/if}
        </a>
    </div>
    <div class="social-media__item">
        <a href="https://www.instagram.com/benhawley/">
            <img class="icon" alt="My Instagram Page" src="/assets/instagram.svg">
            {#if text}
                <label>Instagram</label>
            {/if}
        </a>
        </div>
    <div class="social-media__item">
        <a href="https://www.linkedin.com/in/ben-hawley-5b0235121/">
            <img class="icon" alt="My LinkedIn Page"src="/assets/linkedin.svg">
            {#if text}
                <label>LinkedIn</label>
            {/if}
        </a>
    </div>
</div>

<style>

.social-media {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: inherit;
    width: 100%;
}

.social-media__item {
    flex: 1;
    height: inherit;
}

.social-media__item a {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: 300ms cubic-bezier(0.37, 0.81, 1, 1);
    height: inherit;
}

.social-media__item a:hover {
    background-color: var(--highlight-color-opacity);
    transform: scale(1.05);
}

.icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 0.5rem;
}

.social-media--small .icon {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0;
}

.social-media--small a {
    justify-content: center;
}
</style>