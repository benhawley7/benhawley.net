"use strict";
import {Component, h} from "preact";
import style from "./header.css";

export default class Header extends Component {
    render(props) {
        const {selectedRoute} = props;
        console.log(props);
        return (
            <header class="header">
                <div class="header__content">
                    <div class="header__title">Ben Hawley Portfolio</div>
                    <nav class="header__navigation">
                        <div class="header__navigation__item" selected={selectedRoute === "/"}>
                            <a href="/">Home</a>
                        </div>
                        <div class="header__navigation__item" selected={selectedRoute === "/alexa"}>
                            <a href="/alexa">Alexa</a>
                        </div>
                        <div class="header__navigation__item" selected={selectedRoute === "/memes"}>
                            <a href="/memes">Memes</a>
                        </div>
                        <div class="header__navigation__item" selected={selectedRoute === "/blog"}>
                            <a href="https://medium.com/@benhawley7">Blog</a>
                        </div>
                        <div class="header__navigation__item">
                            <a href="https://pacman.benhawley.net">Pacman</a>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

