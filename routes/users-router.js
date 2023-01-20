const { getUsers, getUserbyId } = require("../app/app.controller")
const usersRouter = require('express').Router()

usersRouter
.route("/")
.get(getUsers)

usersRouter
.route("/:username")
.get(getUserbyId)

module.exports = usersRouter