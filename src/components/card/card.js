import {Component, h} from "preact";
import "./card.css";

export default class Card extends Component {
    render(props) {
        const {title, content} = props;
        let classList = "content-box ";
        if (props.alignCenter) {
            classList += "content-box--center ";
        }
        if (props.maxWidth) {
            classList += "content-box--max-width";
        }
        return (
            <div class={classList}>
                <div class="content-box__title">
                    <h3>{title}</h3>
                </div>
                <div class="content-box__content">
                    {content.map(c =>  <div class="content-box__content__row">
                        {c}
                    </div>)}
                </div>
            </div>
        );
    }
}