const { getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticleById } = require("../app/app.controller")
const articlesRouter = require('express').Router()

articlesRouter
.route("/")
.get(getArticles)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postComment)

module.exports = articlesRouter