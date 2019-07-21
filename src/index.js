/**
 * benhawley.net
 * Personal Portfolio Website
 *
 */

"use strict";

/**
 * index.js
 * Main Browser JavaScript
 *
 * @author Ben Hawley
 */

// Import the root styles
import "./style";

import {render, h} from "preact";

// Main Application
import App from "./components/app";

// Register the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {
            console.log("Service Worker Registered");
        }).catch(e => {
            console.log(e);
        });
}

// Render the Application to the Document Body
render((<App />), document.body);
