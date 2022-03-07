"use strict";

require("./db.js");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

// Constants
const PORT = process.env.port || 80;
const HOST = "0.0.0.0";

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT) || 80;

let ORIGIN = "http://localhost";

if (FRONTEND_PORT !== 80) {
    ORIGIN = `${ORIGIN}:${FRONTEND_PORT}`;
}

// App
const app = express();

const corsOptions = {
    origin: ORIGIN,
};

console.log(`[CORS] accepting connections from ${ORIGIN}`);

app.use(cors(corsOptions));

app.use("/api/v1", routes);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);