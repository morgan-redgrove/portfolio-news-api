const {
  getEndpoints,
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  getUsers,
  postComment,
  patchArticleById,
  deleteComment,
} = require("./app.controller");
const apiRouter = require("../routes/api-router");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", getEndpoints);

app.use((err, request, response, next) => {
  const { status, msg } = err;
  if (status && msg) {
    response.status(status).send({ msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  const { code } = err;
  if (code === "22P02" || code === "23502") {
    response.status(400).send({ msg: "bad request" });
  } else if (code === "23503") {
    response.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
