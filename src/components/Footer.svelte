<script>
    import SocialMedia from "./SocialMedia.svelte";
</script>

<footer>
    <div class="footer__so-me">
        <SocialMedia small={true} text={false} />
    </div>
    <div class="footer__content">
        <p>
            I built this site to learn Svelte. You can see the
            <a href="https://github.com/benhawley7/benhawley.net">
                source code
            </a>
            .
        </p>
    </div>
</footer>

<style>
    footer {
        width: 100%;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .footer__so-me {
        flex: 1;
        height: inherit;
        width: 20rem;
    }

    .footer__content {
        flex: 1;
        font-size: 1rem;
        padding: 1rem;
        text-align: center;
    }
</style>
