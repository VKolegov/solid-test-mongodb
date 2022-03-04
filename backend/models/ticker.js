const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ticker = new Schema({
    ticker: {type: String, required: true},
    name: {type: String, required: true},
    currency: {type: String, required: true},
});

module.exports = mongoose.model("Ticker", Ticker);