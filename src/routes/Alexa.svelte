<script>
    import {link} from "svelte-routing";
    import GridContainer from "../components/GridContainer.svelte";
    import SocialMedia from "../components/SocialMedia.svelte";

    import {fade} from "svelte/transition";
    import {slide} from "svelte/transition";
    import {onMount} from "svelte";
    onMount(() => {
        document.title = "Alexa Skills / Ben Hawley";
    });

    const ccLink =
        "https://www.amazon.co.uk/Ben-Hawley-Chewbacca-Chat/dp/B078NP7B4F/ref=sr_1_1?keywords=chewbacca+chat&qid=1563573777&s=digital-skills&sr=1-1";
    const tttLink =
        "https://www.amazon.co.uk/Ben-Hawley-Tic-Tac-Toe/dp/B07CQT19P9/ref=sr_1_4?keywords=tic+tac+toe&qid=1563719394&s=digital-skills&sr=1-4";
    const fpLink =
        "https://www.amazon.com/Ben-Hawley-Fortnite-Partner/dp/B07GZGLQK2";
</script>

<div class="content" in:fade={{duration: 300}}>
    <section class="content-section">
        <h1>Alexa Skills</h1>
        <p>
            In the past few years, I have been working with the Amazon Alexa
            Skills team to build exciting and fun voice applications. These
            applications include fun games, useful utilities and hilarious
            novelty voice experiences.
        </p>
    </section>
    <section class="content-section">
        <h1>Chewbacca Chat</h1>
        <GridContainer>
            <div>
                <p>
                    Chewbacca Chat allows you to have conversation with the
                    iconic Star Wars Wookiee.
                </p>
                <p>
                    Popular demand led me to implement APL Documents for Echo
                    Show Devices, which allows for exciting animations and
                    interactions.
                </p>
                <p>
                    <a href="${ccLink}">
                        Enable the Chewbacca Chat Skill here!
                    </a>
                </p>
            </div>
            <div class="chewbacca-chat" />
        </GridContainer>

    </section>
    <section class="content-section">
        <h1>Fortnite Partner</h1>
        <p>
            One of the more dynamic skills I have built is Fortnite Partner.
            This skill leverages
            <a href="https://fortniteapi.io">fortniteapi.io</a>
            to output the latest data concerning the hugely popular game.
        </p>
        <p>The skill provides functionality to:</p>
        <ul>
            <li>Pick a drop location using the latest Points of Interest</li>
            <li>Read out the message of the day</li>
            <li>List weekly challenges and current store items</li>
            <li>Verify if the servers are up and running</li>
        </ul>
        <p>
            Fortnite API IO is a fantastic and free API which powers  the data behind
            this skill. To give back to the community behind this API and to
            make it easier for other developers to integrate with it, I
            published my NodeJs API client for accessing the API onto npm for
            others to use:
            <a href="https://www.npmjs.com/package/fortnite-api-io">
                https://www.npmjs.com/package/fortnite-api-io
            </a>
        </p>
        <p>
            In 2020's Coronavirus quarantine, I set myself the goal of starting
            to learn Spanish, I am currently working on the localisation of
            Fortnite Partner to bring it to the Spanish Alexa Skills Store!
        </p>
        <p>
            <a href={fpLink}>Enable the Fortnite Partner Skill here!</a>
        </p>
    </section>
    <section class="content-section">
        <h1>Tic Tac Toe</h1>
        <p>
            In a second year university group project, we built a website
            containing a number of classic games, one of my tasks was
            implementing the Mini-Max Algorithm in JavaScript to be used as the
            AI in a
            <a href="https://fourgames.uk">
                Tic Tac Toe and Connect Four Game.
            </a>
            When I started building Alexa skills, I integrated this algorithm
            into a voice Tic Tac Toe game.
        </p>
        <p>
            Naturally the primary UX focus of this application is to make the
            game accessible to play with your voice, but with the release of the
            Alexa Devices with screens there was the opportunity to enhance the
            experience visually. Using Alexa Presentation Language, I was able
            to create a fully interactive game board to be displayed on Echo
            Show Devices to both supplement the voice experience and offer the
            user the option to play with touch rather than voice.
        </p>
        <p>
            <a href="${tttLink}">Enable the Tic Tac Toe Skill here!</a>
        </p>
    </section>
</div>

<style>
    .chewbacca-chat {
        background-image: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0) 50%,
                var(--highlight-color-opacity) 124%
            ),
            url(/assets/chewbacca-chat.png);
        width: 100%;
        background-position: center;
        background-size: contain;
        min-height: 10rem;
    }
</style>
