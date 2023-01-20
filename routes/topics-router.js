const { getTopics } = require("../app/app.controller")
const topicsRouter = require('express').Router()

topicsRouter
.route("/")
.get(getTopics)

module.exports = topicsRouter