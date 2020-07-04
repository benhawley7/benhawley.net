<script>
    import {link} from "svelte-routing";
    import Card from "../components/Card.svelte";
    import GridContainer from "../components/GridContainer.svelte";
    import SocialMedia from "../components/SocialMedia.svelte";

    import {fade} from "svelte/transition";
    import {slide} from "svelte/transition";
    import {onMount} from "svelte";
    onMount(() => {
        document.title = "Home / Ben Hawley";
    });
</script>

<div class="content" in:fade={{duration: 300}}>
    <section class="overview">
        <div class="overview__title">Ben Hawley</div>
        <div class="overview__subtitle">Full Stack Developer</div>
    </section>

    <section class="content-section">
        <GridContainer>
            <div>
                <h1>About Me</h1>
                <p>
                    There I am in Spain! I am a CompSci Graduate currently
                    working as a full stack developer for Digital Design Labs
                    Ltd and RPGGMedia Ltd.
                </p>
                <p>
                    More recently, I am delving into the world of Data Science
                    by building experimental machine learning models for
                    predicting esports outcomes!
                </p>
                <p>
                    Like basically everybody, I have a passion for travelling
                    and have big trips planned in the near future.
                </p>
            </div>
            <div class="so-me">
                <h2 class="so-me__title">Find me here!</h2>
                <SocialMedia text={true} />
            </div>
        </GridContainer>
    </section>

    <section class="content-section">
        <h1>University</h1>
        <GridContainer>
            <div>
                <p>
                    In 2019, I graduated with a first class honours in Computer
                    Science from the University of Liverpool. During my degree,
                    I also spent a semester abroad studing at the University of
                    Ottawa and completed a Year in Industry placement at Digital
                    Design Labs Ltd.
                </p>
                <p>
                    For my final year project, I implemented the classic game,
                    Pacman, but with a twist: I added a new Maze Escape game
                    mode which allowed me to explore and analyse maze generation
                    and solving algorithms. You can use it here
                    <a href="https://pacman.benhawley.net">
                        https://pacman.benhawley.net
                    </a>
                    (Desktop Only).
                </p>
            </div>
            <div class="graduation-image" alt="My Graduation" />
        </GridContainer>
    </section>

    <section class="content-section">
        <h1>Personal Projects</h1>
        <p>
            I continue to develop in my spare time with numerous personal
            projects, the majority of which are deployed on the Amazon Alexa
            Platform. I have worked with the Amazon Alexa Skills team to build a
            number of popular apps,
            <a href="/alexa" use:link>read more here.</a>
        </p>
    </section>
</div>

<style>
    .content-section {
        padding-top: 1rem;
        padding-bottom: 6rem;
        padding-left: 15rem;
        padding-right: 15rem;
    }

    .content {
        padding-top: 0;
        padding-left: 0;
        padding-right: 0;
        background-image: none;
    }

    .content .content-section:nth-child(even) {
        background: var(--background-color-alt);
    }

    .overview {
        background-image: url("/assets/me.jpg");
        background-image: linear-gradient(
                to top,
                rgba(255, 255, 255, 0) 65%,
                var(--highlight-color)
            ),
            url(/assets/me.jpg);
        background-size: cover;
        background-position: 0 25%;
        margin: 0;
        width: 100vw;
        height: 100vh;
        max-height: 18rem;
        padding-top: 4rem;
        transition: 300ms cubic-bezier(0.37, 0.81, 1, 1);
    }

    .overview__title {
        margin-top: 4rem;
        color: #1d1d1d;
        font-size: 3rem;
        font-weight: bold;
        margin-right: 8rem;
        text-align: right;
    }

    .overview__subtitle {
        background: var(--highlight-color-dark);
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        font-style: italic;
        width: 20rem;
        position: absolute;
        right: 0;
        margin-right: 8rem;
    }

    .graduation-image {
        background-image: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0) 50%,
                var(--highlight-color-opacity) 95%
            ),
            url(/assets/graduation.jpg);
        width: 100%;
        background-position: center;
        background-size: cover;
        min-height: 10rem;
    }

    .so-me {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .so-me__title {
        text-align: center;
        margin-bottom: 2rem;
    }

    @media only screen and (max-width: 1200px) {
        .content-section {
            padding-left: 6rem;
            padding-right: 6rem;
        }
    }

    @media only screen and (max-width: 600px) {
        .content-section {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .overview {
            max-height: 420px;
            background-position: center;
        }

        .overview__title {
            margin-right: 1rem;
        }

        .overview__subtitle {
            margin-right: 1rem;
        }
    }
</style>
