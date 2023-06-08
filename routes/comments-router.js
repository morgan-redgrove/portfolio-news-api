const {
  deleteComment,
  patchCommentById,
  getCommentById,
} = require("../app/app.controller");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteComment);

module.exports = commentsRouter;
