const quotes = require("../models/quote");
const apiController = require("../controllers/api-controller");

module.exports = new apiController(quotes);