const { getTopics, postComment } = require("./app.controller")
const express = require("express")
const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.post("/api/articles/:article_id/comments", postComment)

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
    } else {
        next(err)
    }
})

module.exports = app