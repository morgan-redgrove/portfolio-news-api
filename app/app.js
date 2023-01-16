const { getArticles } = require("./app.controller")
const express = require("express")
const app = express()

app.get("/api/articles", getArticles)

module.exports = app