/**
 * benhawley.net
 * Personal Portfolio Website
 *
 */

"use strict";

/**
 * server.js
 * Entry point of application to serve assets
 *
 * @author Ben Hawley
 */

// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Create an express app
const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist")));

// On the home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

// Every other route
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

// Start the server on port 8371 (BEN)
app.listen(8371, () => {
    // Server start
    console.log("Server Started on Port 8371");
});
