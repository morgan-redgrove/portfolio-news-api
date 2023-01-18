
const { getTopics, getArticles, getArticleById, getCommentsByArticleId, patchArticleById } = require("./app.controller")
const express = require("express")
const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.use((err,request, response, next) => {
    const { status, msg } = err
    if (status && msg) {
       response.status(status).send({msg})   
    } else {
        next(err)
    }
})

app.use((err,request, response, next) => {
    const { code } = err
    if (code === "22P02") {
        response.status(400).send({msg: "bad request"})
    } else if ( code === "23502") {
        response.status(422).send({msg: "unprocessable entity"})
    } else {
        next(err)
    }
})

module.exports = app