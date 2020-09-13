<script>
    export let title;
    export let alignCenter;
    export let maxWidth;

    let classList = "";
    if (alignCenter) {
        classList += "content-box--center ";
    }
    if (maxWidth) {
        classList += "content-box--max-width";
    }
</script>

<div class="content-box {classList}">
    <div class="content-box__title">
        <h2>{title}</h2>
    </div>
    <div class="content-box__content">
        <slot />
    </div>
</div>

<style>
    .content-box {
        display: flex;
        flex-direction: column;
        box-shadow: 0px 5px 24px 0px rgba(0, 0, 0, 0.35);
        border-radius: 0.1rem;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        /* background: var(--highlight-color-alt);
    background: linear-gradient(90deg, var(--highlight-color-alt) 0%, var(--highlight-color-dark) 100%); */
        overflow: hidden;
        max-width: 50rem;
    }

    .content-box--max-width {
        max-width: 30rem;
        align-self: center;
    }

    .content-box__title {
        /* background: var(--highlight-color-alt); */
        color: #eeeeee;
        font-weight: bold;
        font-size: 1rem;
        position: relative;
        height: 1.5rem;
        display: flex;
        align-items: center;
        position: relative;
        padding: 1rem;
        background-image: linear-gradient(
            to bottom,
            var(--highlight-color) -10rem,
            rgba(255, 255, 255, 0) 10rem
        );
    }

    .content-box__content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        background: var(--background-color);
    }

    .content-box__content__row {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 0.5rem;
    }
</style>
