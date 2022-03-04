const express = require("express");
const ticker = require("../models/ticker");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
exports.index = async function(req, res) {

    try {
        const tickers = await ticker.find({}).lean();
        res.send(
            JSON.stringify(tickers)
        );
    } catch (e) {
        res.status(500).send(
            JSON.stringify(
                {
                    "error": "Error while fetching tickers: " + e,
                }
            )
        );
    }
};