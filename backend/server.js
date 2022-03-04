"use strict";

const express = require("express");
const db = require("./db.js");
const routes = require("./routes");

// Constants
const PORT = process.env.port || 80;
const HOST = "0.0.0.0";


// App
const app = express();

app.get("/", async (req, res) => {
    const connected = db.connection.readyState === 1;

    res.send(`Hello World!<br>MongoDB connected: ${connected ? "yes" : "no"}`);
});

app.use("/api/v1", routes);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);