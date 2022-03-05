const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Quote = new Schema({
    ticker: {type: String, required: true},
    date: {type: Date, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model("Quote", Quote);