const { getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment,patchArticleById  } = require("./app.controller")

const express = require("express")
const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

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
    if (code === "22P02" || code === "23502") {
        response.status(400).send({msg: "bad request"})
    } else if (code === "23503") {
        response.status(404).send({msg: "not found"})
    } else {
        next(err)
    }
})

app.use((err,request, response, next) => {
    console.log(err)
    response.status(500).send({ msg: 'Internal Server Error' })
})

module.exports = app