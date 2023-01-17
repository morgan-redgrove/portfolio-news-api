const { getTopics, getArticleCommentsById } = require("./app.controller")
const express = require("express")
const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id/comments", getArticleCommentsById)

module.exports = app