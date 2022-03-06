const mongoose = require("mongoose");
const express = require("express");
const fns = require("date-fns");

module.exports = class ApiController {

    /**
     *
     * @param {mongoose.Model} model
     */
    constructor(model) {
        this.model = model;
        this.filteringFields = [];
    }

    /**
     *
     * @param {[{field: string, type: string}]} fields
     */
    setFilteringFields(fields) {
        this.filteringFields = fields;
    }

    /**
     *
     * @param {express.ParsedQs} query
     * @returns {{limit: Number, page: Number}}
     * @private
     */
    _parseIndexQuery(query) {

        const parsedQuery = {
            limit: 20, page: 1,
        };

        if (query.hasOwnProperty("limit")) {
            const minLimit = 1;
            const maxLimit = 1000;
            const limit = parseInt(query.limit);

            // clamp between [1..1000]
            parsedQuery.limit = Math.min(Math.max(limit, minLimit), maxLimit);
        }

        if (query.hasOwnProperty("page")) {
            const page = parseInt(query.page);

            parsedQuery.page = Math.max(1, page);
        }

        return parsedQuery;
    }

    /**
     *
     * @param {express.ParsedQs} query
     * @returns {Object}
     * @private
     */
    _parseFiltering(query) {

        const filters = {};

        if (!this.filteringFields || this.filteringFields.length === 0) {
            return {};
        }

        for (const filteringField of this.filteringFields) {

            const fieldName = filteringField.field;


            const fieldValue = query[fieldName];

            switch (filteringField.type) {
                case "match":

                    if (!query.hasOwnProperty(filteringField.field)) {
                        continue;
                    }

                    if (Array.isArray(fieldValue)) {
                        filters[fieldName] = {
                            $in: fieldValue
                        };
                    } else {
                        filters[fieldName] = fieldValue;
                    }

                    break;
                case "date_range":

                    const dateRangeFilter = {};

                    const minQueryField = `${fieldName}_min`;
                    const maxQueryField = `${fieldName}_max`;


                    if (query.hasOwnProperty(minQueryField)) {
                        const dateMinQuery = query[minQueryField];

                        dateRangeFilter.$gte = fns.startOfDay(
                            Date.parse(dateMinQuery)
                        );
                    }

                    if (query.hasOwnProperty(maxQueryField)) {
                        const dateMaxQuery = query[maxQueryField];

                        dateRangeFilter.$lte = fns.endOfDay(
                            Date.parse(dateMaxQuery)
                        );
                    }

                    if (Object.keys(dateRangeFilter).length > 0) {
                        filters[fieldName] = dateRangeFilter;
                    }

                    break;
            }

        }

        return filters;
    }

    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     */
    async index(req, res) {

        const {limit, page} = this._parseIndexQuery(req.query);

        const filter = this._parseFiltering(req.query);

        try {

            const total = await this.model.countDocuments(filter);
            const entities = await this.model.find(filter)
                .limit(limit)
                .skip(limit * (page - 1))
                .lean();

            const response = {
                total, page, entities
            };

            res.send(JSON.stringify(response));

        } catch (e) {
            res.status(500).send(JSON.stringify({
                "error": "Error while fetching entities: " + e,
            }));
        }
    }
};