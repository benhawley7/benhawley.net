<script>
    import {link, push, pop, replace, location, querystring} from "svelte-spa-router";
    import ImageCard from "../components/ImageCard.svelte";
    import Card from "../components/Card.svelte";
    import GridContainer from "../components/GridContainer.svelte";
    import {fade} from 'svelte/transition'
    import { slide } from 'svelte/transition';


    // Image Card Data
    const imageURL = "/assets/me-compressed.jpg";
    const imageAlt = "Picture of me in Spain.";
    const imageCardData = [
        {
            title: "Pwy wyt ti?",
            content: `
            <div>
                <p>There I am in Spain! 🌞</p>
                <p>I am a graduate of Computer Science from the University of Liverpool.</p>
                <p>Currently working as a Software Developer at <a href="https://digitaldesignlabs.com">Digital Design Labs Ltd.</a></p>
            </div>`,
            background: "standard"
        },
        {
            title: "Thingys", 
            content: `
            <div>
                <p>Some relevant links:</p>
                <ul>
                    <li><a href="https://github.com/benhawley7">GitHub</a></li>
                    <li><a href="https://www.instagram.com/benhawley/">Instagram</a></li>
                    <li><a href="https://www.linkedin.com/in/ben-hawley-5b0235121/">LinkedIn</a></li>
                </ul>
            </div>`,
            background: "highlight"
        }
    ];

</script>

<div in:fade|slide="{{duration: 300}}">
    <h1>Home</h1>
    <h2>About Me</h2>
    <ImageCard url="https://github.com/benhawley7" {imageAlt} {imageURL} {imageCardData}/>
    <GridContainer>
        <Card title="Web Pacman">
            <div>
                <p>For my final year project at the University of Liverpool, I built the classic
                game, Pacman, using a HTML5 Game Engine named Phaser 3.</p>
                <p>I expanded upon the original scope of the game by implementing an original new game mode
                which features procedurally generated Mazes and Maze Solving Algorithms.</p>
                <p>You can play it here: <a href="https://pacman.benhawley.net">pacman.benhawley.net</a></p>
                <p><strong>Note:</strong> The projects focus was on the analysis of the implemented algorithms,
                so I did not have time to optimise for mobile, so please play on PC (Sorry x).</p>
            </div>
        </Card>
        <Card title="Alexa Skills">
            <div>
                <p>For work, and as a hobby, I develop apps, known as skills, for Amazon Alexa.</p>
                <p>My popular skills include:</p>
                <ul>
                    <li>Chewbacca Chat</li>
                    <li>R2D2 Talk</li>
                    <li>Tic Tac Toe</li>
                </ul>
                <p>You can find out more <a href="/alexa">on my Alexa page.</a></p>
            </div>
        </Card>
    </GridContainer>
</div>





