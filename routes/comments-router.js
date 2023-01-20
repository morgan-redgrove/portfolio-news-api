const { deleteComment, patchCommentByID, getCommentById } = require("../app/app.controller")
const commentsRouter = require('express').Router()

commentsRouter
.route("/:comment_id")
.get(getCommentById)
.patch(patchCommentByID)
.delete(deleteComment)

module.exports = commentsRouter