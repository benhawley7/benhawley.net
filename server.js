"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const Handlebars = require("handlebars");

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/templates/index.html"));
});

app.get("/memes", async (req, res) => {

    fs.readFile(path.join(__dirname, "templates/main.html"), "utf-8", (err, data) => {
        const sourceString = data.toString();
        const template = Handlebars.compile(sourceString);

        const pageContent = fs.readFileSync(path.join(__dirname, "templates/memes.html"));

        const d = {"pageContent": pageContent};
        const result = template(d);

        res.send(result);
    });

});

// Start the server on port 8437
app.listen(8371, () => {
    // Server start
    console.log("Server Started on Port 8371");
});
