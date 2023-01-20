const { getUsers } = require("../app/app.controller")
const usersRouter = require('express').Router()

usersRouter
.route("/")
.get(getUsers)

module.exports = usersRouter