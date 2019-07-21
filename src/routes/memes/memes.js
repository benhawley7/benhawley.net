import {Component, h} from "preact";
import Card from "../../components/card/card";
import "./memes.css";

export default class Memes extends Component {
    constructor() {
        super();

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFlip = this.handleFlip.bind(this);
        this.handleCopy = this.handleCopy.bind(this);

        const startingText = "This is an example";
        const startingUpperCase = true;
        this.setState({
            inputText: startingText,
            memeText: this.getMemeText(startingText),
            upperCase: startingUpperCase
        });
    }

    componentDidMount() {
        document.title = "Memes - Ben Hawley";
    }

    getMemeText(text, upperCase) {
        return ["", ...text].reduce((acc , char) => {
            if (char.match(/[A-Za-z]/)) {
                char = upperCase ? char.toUpperCase() : char.toLowerCase();
                upperCase = !upperCase;
            }
            return acc + char;
        });
    }


    handleKeyPress(e) {
        const text = e.target.value;
        const {upperCase} = this.state;
        this.setState({
            inputText: text,
            memeText: this.getMemeText(text, upperCase),
            upperCase: this.upperCase
        });
    }

    handleFlip() {
        console.log("Flip");
        const {memeText, inputText, upperCase} = this.state;

        this.setState({
            memeText: this.getMemeText(inputText, !upperCase),
            inputText: inputText,
            upperCase: !upperCase
        });
    }

    handleCopy() {
        console.log("Copy");
        this.memeOutput.select();
        document.execCommand("copy");
    }

    render(props, state) {
        const title = "Test String to tEsT sTrInG cOnVeRtEr";
        const memeText = state.memeText || "tHiS iS aN eXaMpLe";

        const content = [
            <input type="text" onKeyUp={this.handleKeyPress} class="meme-text-input"/>,
            <button class="button" onClick={this.handleFlip}>Flip</button>,
            <textarea class="meme-text-output__text" ref={memeOutput => this.memeOutput = memeOutput}>{memeText}</textarea>,
            <button class="button" onClick={this.handleCopy}>Copy</button>
        ];
        return (
            <div class="page-content">
                <h1>Memes</h1>
                <h2>Meme Text Converter</h2>
                <p>Very Important Page.</p>
                <Card title={title} content={content} maxWidth="true" alignCenter="true"/>
            </div>
        );
    }
}