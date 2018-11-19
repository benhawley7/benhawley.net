"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/templates/index.html"));
});

// Start the server on port 8437
app.listen(8371, () => {
    // Server start
    console.log("Server Started on Port 8371");
});
