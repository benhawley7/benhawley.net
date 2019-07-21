import { Component, h } from "preact";
import ImageCard from "../../components/image-card/image-card";
import Grid from "../../components/grid/grid";
import Card from "../../components/card/card";
import Me from "../../assets/me-compressed.jpg";

export default class Home extends Component {
    componentDidMount() {
        document.title = "Home - Ben Hawley";
    }

    render() {
        const imageAlt = "Picture of me in Spain.";
        const imageCardData = [
            {
                title: "Who r u?",
                content: <div>
                    <p>There is me in Spain 🌞</p>
                    <p>I am a graduate of Computer Science from the University of Liverpool.</p>
                    <p>Currently working as a Software Developer at <a href="https://digitaldesignlabs.com">Digital Design Labs Ltd.</a></p>
                </div>,
                background: "standard"
            },
            {
                title: "Thingys",
                content: <div>
                    <p>Here are some links for me to flog at you:</p>
                    <ul>
                        <li><a href="https://github.com/benhawley7">GitHub</a></li>
                        <li><a href="https://www.instagram.com/benhawley/">Instagram</a></li>
                        <li><a href="https://www.linkedin.com/in/ben-hawley-5b0235121/">LinkedIn</a></li>
                    </ul>
                </div>,
                background: "highlight"
            }
        ];

        const pacman = {
            title: "University Final Year Project - Web Pacman",
            content: [
                <div>
                    <p>For my final year project at the University of Liverpool, I built the classic
                    game, Pacman, using a HTML5 Game Engine named Phaser 3.</p>
                    <p>I expanded upon the original scope of the game by implementing an original new game mode
                    which features procedurally generated Mazes and Maze Solving Algorithms.</p>
                    <p>You can play it here: <a href="https://pacman.benhawley.net">pacman.benhawley.net</a></p>
                    <p><strong>Note:</strong> The projects focus was on the analysis of the implemented algorithms,
                    so I did not have time to optimise for mobile, so please play on PC (Sorry x).</p>
                </div>
            ]
        };

        const alexa = {
            title: "Alexa Skills",
            content: [
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

            ]
        };
        return (
            <div class="page-content">
                <h1>Home</h1>
                <h2>About Me</h2>
                <ImageCard imageAlt={imageAlt} imageURL={Me} textContainerData={imageCardData} />
                <h2>Some of my Projects</h2>
                <Grid>
                    <Card title={pacman.title} content={pacman.content} />
                    <Card title={alexa.title} content={alexa.content} />
                </Grid>
            </div>
        );
    }
}