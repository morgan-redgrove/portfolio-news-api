const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  selectUsers,
  selectUserById,
  selectCommentById,
  insertComment,
  insertUserById,
  updateArticlebyId,
  updateCommentById,
  updateUserById,
  validateLogin,
  removeComment,
} = require("./app.model");
const endpoints = require("../endpoints.json");

const getEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};

const getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  const { query } = request;
  selectArticles(query)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (request, response, next) => {
  const { username } = request.params;
  selectUserById(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  selectCommentById(comment_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;
  insertComment(username, body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const postUserById = (request, response, next) => {
  const { username } = request.params;
  const { password, name, avatar_url } = request.body;
  insertUserById(username, password, name, avatar_url)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (request, response, next) => {
  const { inc_votes, username } = request.body;
  const { article_id } = request.params;
  updateArticlebyId(inc_votes, username, article_id)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchCommentById = (request, response, next) => {
  const { inc_votes, username } = request.body;
  const { comment_id } = request.params;
  updateCommentById(inc_votes, username, comment_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchUserById = (request, response, next) => {
  const { username } = request.params;
  const { password, name, avatar_url, permission } = request.body;

  updateUserById(username, password, name, avatar_url, permission)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const patchLogin = (request, response, next) => {
  const { username, password } = request.body;

  validateLogin(username, password)
    .then((match) => {
      response.status(201).send(match);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getEndpoints,
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  getUsers,
  getUserById,
  getCommentById,
  postComment,
  postUserById,
  patchArticleById,
  patchCommentById,
  patchUserById,
  patchLogin,
  deleteComment,
};
