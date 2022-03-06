const quotes = require("../models/quote");
const apiController = require("../controllers/api-controller");

const controller = new apiController(quotes);

controller.setFilteringFields(
    [
        {
            field: "date",
            type: "date_range"
        },
        {
            field: "ticker",
            type: "match"
        }
    ]
);

module.exports = controller;