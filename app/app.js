const { getTopics, postComment } = require("./app.controller")
const express = require("express")
const app = express()

app.get("/api/topics", getTopics)

app.post("/api/articles/:article_id/comments", postComment)

module.exports = app