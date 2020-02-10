<script>
import { link } from "svelte-routing";
const logo = {
    url: "/header-logo.svg",
    alt: "Supertote Logo"
}
const navigation = [
    {
        text: "Home",
        route: "/"
    },
    {
        text: "Alexa",
        route: "/alexa"
    },
    {
        text: "Memes",
        route: "/memes"
    },
    {
        text: "Travel",
        route: "/travel"
    }
]

const external = [
    // {
    //     text: "Blog",
    //     route: "https://medium.com/@benhawley7"
    // },
    {
        text: "Pacman",
        route: "https://pacman.benhawley.net"
    }
]

</script>

<header class="header">
    <div class="header__content">
        <div class="header__title">BenHawley.net</div>
        <nav class="header__navigation">
            {#each navigation as nav}
                <div class="header__navigation__item">
                    <a href={nav.route} use:link>{nav.text}</a>
                </div>
            {/each}
            {#each external as nav}
                <div class="header__navigation__item">
                    <a href={nav.route}>{nav.text}</a>
                </div>
            {/each}
        </nav>
    </div>
</header>

<style>
.header {
    position: fixed;
    background-color: #262626f7;
    border-bottom: 2px solid var(--highlight-color);
    width: 100vw;
    box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3rem;
    z-index: 1;
}

.header__content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-left: 5rem;
    margin-right: 5rem;
    width: 100%;
    height: 100%;
}

.header__title {
    flex: 1;
    display: flex;
    align-items: center;
    color:#eaeaea;
    font-weight: bold;
    font-size: 1.5rem;
    padding: 0.5rem;
}

.header__navigation {
    flex: 1;
    display: flex;
    height: 100%;
    width: 100%;
}

.header__navigation__item {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* .header__navigation__item a[active] {
    background: var(--highlight-color);
} */

.header__navigation__item:hover a {
    background: #169d79;
}

.header__navigation__item a {
    width: 100%;
    color: #eaeaea;
    text-decoration: none;
    height: 100%;
    padding: 0 0.6rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;

}

@media only screen and (max-width: 600px) {
    .header {
        height: 5rem;
    }
    .header__content {
        flex-direction: column;
        align-items: center;
    }
}

</style>
