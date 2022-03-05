const ticker = require("../models/ticker");
const apiController = require("../controllers/api-controller");

module.exports = new apiController(ticker);