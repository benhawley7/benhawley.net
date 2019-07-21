import {Component, h} from "preact";
import "./footer.css";
export default class Footer extends Component {
    render(props, state) {
        return (
            <footer>
                <div class="footer-content">
                    I built this site to learn preact. You can see the <a href="https://github.com/benhawley7/benhawley.net">source code</a>.
                </div>
            </footer>
        );
    }
}