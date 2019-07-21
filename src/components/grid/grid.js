import {Component, h} from "preact";
import "./grid.css";
export default class Grid extends Component {
    render(props) {
        const {children} = props;
        console.log(children);
        return (
            <div class="grid">
                {children.map(child => child)}
            </div>
        );
    }
}