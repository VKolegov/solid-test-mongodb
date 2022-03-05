const express = require("express");
const router = express.Router();

const tickersController = require("../controllers/tickers");
const quotesController = require("../controllers/quotes");

router.get("/tickers", async function(req, res) {
    await tickersController.index(req, res);
});

router.get("/quotes", async function(req, res) {
    await quotesController.index(req, res);
});

module.exports = router;
