<script>
import ImageCard from "../components/ImageCard.svelte";
import GridContainer from "../components/GridContainer.svelte";

import {fade, slide} from 'svelte/transition'


const ccLink = "https://www.amazon.co.uk/Ben-Hawley-Chewbacca-Chat/dp/B078NP7B4F/ref=sr_1_1?keywords=chewbacca+chat&qid=1563573777&s=digital-skills&sr=1-1";
const tttLink = "https://www.amazon.co.uk/Ben-Hawley-Tic-Tac-Toe/dp/B07CQT19P9/ref=sr_1_4?keywords=tic+tac+toe&qid=1563719394&s=digital-skills&sr=1-4";
const fpLink = "https://www.amazon.com/Ben-Hawley-Fortnite-Partner/dp/B07GZGLQK2";
const skills = [
    {
        left: false,
        url: ccLink,
        imageURL: "/assets/chewbacca-chat.png",
        imageAlt: "Picture of Chewbacca Chat on the Alexa Skills Store.",
        textContainerData: [
            {
                title: "Chewbacca Chat",
                content:`
                <div>
                    <p>
                    Chewbacca Chat allows you to have conversation with the iconic Star Wars Wookiee.
                    </p>
                    <p>
                        Popular demand led me to implement APL Documents for Echo Show Devices,
                        which allows for exciting animations and interactions.
                    </p>
                    <p>
                        <a href=${ccLink}>Enable the Chewbacca Chat Skill here!</a>
                    </p>
                </div>`

            }
        ]
    },
    {
        left: true,
        url: tttLink,
        imageURL: "/assets/tic-tac-toe.jpg",
        imageAlt: "Picture of Tic Tac Toe Board Design in APL.",
        textContainerData: [
            {
                title: "Tic Tac Toe",
                content:`
                <div>
                    <p>
                        In a second year university group project, we built a website containing
                        a number of classic games, one of my tasks was implementing the Mini-Max
                        Algorithm in JavaScript to be used as the AI in a <a href="https://fourgames.uk">
                        Tic Tac Toe and Connect Four Game.</a>
                    </p>
                    <p>
                        When I started building Alexa skills,
                        I integrated this algorithm into a voice Tic Tac Toe game. With the release
                        of Alexa Presentation Language, I created a game board which is completely interactive and
                        animated on Echo Show Devices.
                    </p>
                    <p>
                        <a href=${tttLink}>Enable the Tic Tac Toe Skill here!</a>
                    </p>
                </div>`
            }
        ]
    },
    {
        left: true,
        imageURL: "/assets/fortnite-partner.png",
        url: fpLink,
        imageAlt: "Picture of Fortnite Partner on Alexa Skill Storex",
        textContainerData: [
            {
                title: "Fortnite Partner",
                content:`
                <div>
                    <p>
                        One of the more dynamic skills I have built is Fortnite Partner. This skill leverages an API to output the latest data concerning the popular game.
                    </p>
                    <p>
                        The skill allows you to:
                        <ul>
                            <li>Get the message of the day</li>
                            <li>Get weekly challenges and current items</li>
                            <li>Check if the servers are up</li>
                        </ul>
                    </p>
                    <p>
                        <a href=${fpLink}>Enable the Fortnite Partner Skill here!</a>
                    </p>
                </div>`
            }
        ]
    }
];

</script>

<div in:fade="{{duration: 300}}">
    <h1>Alexa</h1>
    <p>I have developed a variety of popular Alexa Skills.</p>
    <GridContainer>
        {#each skills as skill}
            <ImageCard url={skill.url} responsive="false" imageLeft={skill.left} imageAlt={skill.imageAlt} imageURL={skill.imageURL} imageCardData={skill.textContainerData}/>
        {/each}
    </GridContainer>

</div>

