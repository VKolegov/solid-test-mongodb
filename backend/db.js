const mongoose = require("mongoose");

const MONGO_USERNAME = process.env.MONGO_USERNAME || "test";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "test";
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || "mongodb";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_DB = process.env.MONGO_DB || "solid";

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_DB}`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;