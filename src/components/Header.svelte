<script>
    import {link} from "svelte-routing";
    const logo = {
        url: "/header-logo.svg",
        alt: "Supertote Logo"
    };
    const navigation = [
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
    ];

    const external = [
        // {
        //     text: "Blog",
        //     route: "https://medium.com/@benhawley7"
        // },
        {
            text: "Pacman",
            route: "https://pacman.benhawley.net"
        }
    ];
</script>

<header class="header">
    <div class="header__content">
        <a href={'/'} use:link class="header__title">BH</a>
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
        /* background-color: #262626f7; */
        background-color: rgba(38, 38, 38, 0.5);
        /* border-bottom: 2px solid var(--highlight-color); */
        width: 100vw;
        /* box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.35); */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        height: 4rem;
        backdrop-filter: blur(6px);
    }

    .header__content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin: 0 6rem;
        width: 100%;
        height: 100%;
    }

    .header__title {
        display: flex;
        align-items: center;
        background-color: var(--highlight-color);
        color: #eaeaea;
        font-weight: bold;
        font-size: 1.5rem;
        padding: 0.75rem;
        margin: 0.75rem;
        text-decoration: none;
    }

    .header__navigation {
        flex: 1;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: flex-end;
    }

    .header__navigation__item {
        flex: 1;
        height: 100%;
        max-width: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* .header__navigation__item a[active] {
    background: var(--highlight-color);
} */

    .header__navigation__item:hover a {
        background: var(--highlight-color-opacity);
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

    @media only screen and (max-width: 500px) {
        .header__content {
            margin: 0 2rem;
        }
    }
</style>
