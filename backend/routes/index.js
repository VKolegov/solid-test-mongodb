const express = require("express");
const router = express.Router();
const tickers = require("../controllers/tickers");

router.get("/tickers", async function(req, res) {
    await tickers.index(req, res);
});

module.exports = router;
