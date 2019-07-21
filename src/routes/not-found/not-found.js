import {h, Component} from "preact";

export default class NotFound extends Component {
    render() {
        return (
            <div class="page-content">
                <h1>Wrong page matey.</h1>
                <p><a href="/">Go home.</a></p>
            </div>
        );
    }
}