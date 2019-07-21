import {Component, h} from "preact";

import "./image-card.css";
export default class ImageCard extends Component {
    render(props) {
        const {textContainerData, imageURL, imageAlt, imageLeft} = props;
        return (
            <div class="image-card" left={imageLeft}>
                <div class="image-card__img-container">
                    <img alt={imageAlt} src={imageURL}></img>
                </div>
                <div class="image-card__text-container">
                    {textContainerData.map(data =>
                        <div class="image-card__text-container__sub-container" highlight={data.background === "highlight"}>
                            <h3>{data.title}</h3>
                            {data.content}
                        </div>)
                    }
                </div>

            </div>
        );
    }
}