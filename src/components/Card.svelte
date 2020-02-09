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
        {title}
    </div>
    <div class="content-box__content">
        <slot/>
    </div>
</div>

<style>
.content-box {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.35);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: 2px solid var(--highlight-color);
    background: var(--highlight-color-alt);
    background: linear-gradient(90deg, var(--highlight-color-alt) 0%, var(--highlight-color-dark) 100%);
    overflow: hidden;
    max-width: 50rem;
}

.content-box--max-width {
    max-width: 30rem;
    align-self: center;
}

.content-box__title {
    padding: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    /* background: var(--highlight-color-alt); */
    color: #eeeeee;
    font-weight: bold;
    font-size: 1rem;
    width: fit-content;
    position: relative;
    height: 1.5rem;
    display: flex;
    align-items: center;
}
/* 
.content-box__title::after {
    content: "";
    position: absolute;
    bottom: -1px;
    width: 1.2rem;
    background: var(--highlight-color-alt);
    height: 3rem;
    right: -1rem;
    clip-path: polygon(0 0, 100% 0%, 40% 100%, 0% 100%);
} */

.content-box__content {
    padding: 1rem;
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
    display: flex;
    flex-direction: column;
    border-top: 2px solid var(--highlight-color);
    align-items: center;
    height: 100%;
    background: var(--background-color);
}

.no-border-radius-right {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.no-border-radius-left {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.content-box__content__row {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0.5rem;
}
</style>