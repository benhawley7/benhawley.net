import { h, Component } from "preact";
import { Router } from "preact-router";

// Components
import Header from "./header/header.js";
import Footer from "./footer/footer.js";

// Routes
import Home from "../routes/home/home.js";
import Alexa from "../routes/alexa/alexa.js";
import Memes from "../routes/memes/memes.js";
import NotFound from "../routes/not-found/not-found";


export default class App extends Component {
    constructor() {
        super();
        this.handleRoute = this.handleRoute.bind(this);
    }

    /** Gets fired when the route changes.
     *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
    *	@param {string} event.url	The newly routed URL
    */
    handleRoute(e) {
        this.setState({
            currentUrl: e.url
        });
    }

    render() {
        return (
            <div>
                <Header selectedRoute={this.state.currentUrl} />
                <div class="body-content">
                    <Router onChange={this.handleRoute}>
                        <Home path="/" />
                        <Alexa path="/alexa" />
                        <Memes path="/memes" />
                        <NotFound default />
                    </Router>
                </div>
                <Footer />
            </div>
        );
    }
}
