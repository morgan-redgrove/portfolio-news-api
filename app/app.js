const { getTopics, getCommentsByArticleId } = require("./app.controller")
const express = require("express")
const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use((err, request, response, next) => {
    const { status, msg} = err
    response.status(status).send({msg})
})

module.exports = app