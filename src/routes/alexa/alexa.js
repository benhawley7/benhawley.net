import {Component, h} from "preact";
import ImageCard from "../../components/image-card/image-card";
import ChewbaccaChatImage from "../../assets/chewbacca-chat.png";
import TicTacToeImage from "../../assets/tic-tac-toe.jpg";

export default class Alexa extends Component {
    componentDidMount() {
        document.title = "Alexa - Ben Hawley";
    }

    render() {
        const ccLink = "https://www.amazon.co.uk/Ben-Hawley-Chewbacca-Chat/dp/B078NP7B4F/ref=sr_1_1?keywords=chewbacca+chat&qid=1563573777&s=digital-skills&sr=1-1";
        const tttLink = "https://www.amazon.co.uk/Ben-Hawley-Tic-Tac-Toe/dp/B07CQT19P9/ref=sr_1_4?keywords=tic+tac+toe&qid=1563719394&s=digital-skills&sr=1-4";
        const skills = [
            {
                imageURL: ChewbaccaChatImage,
                imageAlt: "Picture of Chewbacca Chat on the Alexa Skills Store.",
                textContainerData: [
                    {
                        title: "Chewbacca Chat",
                        content:
                        <div>
                            <p>
                            Chewbacca Chat allows you to have conversation with the iconic Star Wars Wookiee.
                            </p>
                            <p>
                                Popular demand led me to implement APL Documents for Echo Show Devices,
                                which allows for exciting animations and interactions.
                            </p>
                            <p>
                                <a href={ccLink}>Enable the Chewbacca Chat Skill here!</a>
                            </p>
                        </div>

                    }
                ]
            },
            {
                imageURL: TicTacToeImage,
                imageAlt: "Picture of Tic Tac Toe Board Design in APL.",
                textContainerData: [
                    {
                        title: "Tic Tac Toe",
                        content:
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
                                <a href={tttLink}>Enable the Tic Tac Toe Skill here!</a>
                            </p>
                        </div>
                    }
                ]
            },
        ];

        return (
            <div class="page-content">
                <h1>Alexa</h1>
                <p>I have developed a variety of popular Alexa Skills.</p>

                {skills.map((skill, index) => <ImageCard imageLeft={index%2==0} textContainerData={skill.textContainerData} imageURL={skill.imageURL} />)}

            </div>
        );
    }
}