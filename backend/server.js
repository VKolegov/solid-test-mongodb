"use strict";

const express = require("express");
const db = require("./db.js");

// Constants
const PORT = process.env.port || 80;
const HOST = "0.0.0.0";


// App
const app = express();
app.get("/", (req, res) => {
    const connected = db.connection.readyState === 1;

    res.send(`Hello World!<br>MongoDB connected: ${connected ? "yes" : "no"}`);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);