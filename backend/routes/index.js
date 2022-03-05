const express = require("express");
const router = express.Router();

const tickersController = require("../controllers/tickers");

router.get("/tickers", async function(req, res) {
    await tickersController.index(req, res);
});

module.exports = router;
