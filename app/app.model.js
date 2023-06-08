const db = require("../db/connection");
const format = require("pg-format");

const selectTopics = () => {
  return db
    .query(
      `
        SELECT * FROM topics
    `
    )
    .then((result) => {
      return result.rows;
    });
};

const checkIfExists = (table, column, value) => {
  const queryString = format(
    `
        SELECT * FROM %I
        WHERE %I = $1
    `,
    table,
    column
  );

  return db.query(queryString, [value]).then((result) => {
    return !!result.rows.length;
  });
};

// const checkIfHashExists = (table, column, value) => {
//   const queryString = format(
//     `
//     SELECT * from %I
//     WHERE %I = crypt($1, %I)
//     `,
//     table,
//     column,
//     column
//   );

//   return db.query(queryString, [value]).then((result) => {
//     return !!result.rows.length;
//   });
// };

const selectArticles = (query) => {
  const topic = query.topic;
  const sort_by = query.sort_by ?? "created_at";
  const order = query.order ?? "DESC";

  const sortByGreenList = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
  ];
  const orderGreenList = ["ASC", "DESC"];

  const greenLight =
    sortByGreenList.includes(sort_by) && orderGreenList.includes(order);

  let queryString = format(`
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN
    comments
    ON articles.article_id = comments.article_id
    `);

  if (topic) {
    return checkIfExists("articles", "topic", topic)
      .then((exists) => {
        if (!exists) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      })
      .then(() => {
        queryString += `WHERE topic = $1\nGROUP BY articles.article_id\n`;
        if (greenLight) {
          queryString += `ORDER BY ${sort_by} ${order}`;
        } else {
          return Promise.reject({ status: 400, msg: "bad request" });
        }
        return db.query(queryString, [topic]).then((result) => {
          return result.rows;
        });
      });
  } else {
    queryString += `GROUP BY articles.article_id\n`;
    if (greenLight) {
      queryString += `ORDER BY ${sort_by} ${order}`;
    } else {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    return db.query(queryString).then((result) => {
      return result.rows;
    });
  }
};

const selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN
    comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `,
      [article_id]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return result.rows[0];
    });
};

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return result.rows;
    });
};

const selectUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users
    `
    )
    .then((result) => {
      return result.rows;
    });
};

const selectUserById = (username) => {
  return checkIfExists("users", "username", username).then((exists) => {
    if (!exists) {
      return Promise.reject({ status: 404, msg: "not found" });
    }

    return db
      .query(
        `SELECT username, name, avatar_url, permission FROM users WHERE username = $1`,
        [username]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const selectCommentById = (comment_id) => {
  return checkIfExists("comments", "comment_id", comment_id).then((exists) => {
    if (!exists) {
      return Promise.reject({ status: 404, msg: "not found" });
    }

    return db
      .query(
        `
            SELECT * FROM comments
            WHERE comment_id = $1
        `,
        [comment_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const insertComment = (username, body, article_id) => {
  return checkIfExists("articles", "article_id", article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return db.query(
        `
            INSERT INTO comments (
                author,
                body,
                article_id  
            )
            VALUES (
                $1,
                $2,
                $3
            )
            RETURNING *
        `,
        [username, body, article_id]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

const insertUserById = (username, password, name, avatar_url) => {
  return checkIfExists("users", "username", username).then((exists) => {
    if (exists) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }

    return db
      .query(
        `
      INSERT INTO users (
          username,
          password,
          name,
          avatar_url  
      )
      VALUES (
          $1,
          crypt($2, gen_salt('bf', 5)),
          $3,
          $4
      )
      RETURNING *
    `,
        [username, password, name, avatar_url]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const updateArticlebyId = (inc_votes, username, article_id) => {
  return checkIfExists("articles", "article_id", article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else if (!inc_votes || !username) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }

      return db.query(
        `
          UPDATE articles
          SET
          votes = votes + $1,
          vote_history = array_append(vote_history, $2)
          WHERE article_id = $3
          RETURNING *
        `,
        [inc_votes, username, article_id]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

const updateCommentById = (inc_votes, username, comment_id) => {
  return checkIfExists("comments", "comment_id", comment_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else if (!inc_votes || !username) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }

      return db.query(
        `
          UPDATE comments
          SET
          votes = votes + $1,
          vote_history = array_append(vote_history, $2)
          WHERE comment_id = $3
          RETURNING *
      `,
        [inc_votes, username, comment_id]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

const updateUserById = (username, password, name, avatar_url, permission) => {
  return checkIfExists("users", "username", username).then((exists) => {
    if (!exists) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else if (!password && !name && !avatar_url && !permission) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }

    return db
      .query(
        `
            UPDATE users
            SET
            password = COALESCE(crypt($2, gen_salt('bf', 5)), password),
            name = COALESCE($3, name),
            avatar_url = COALESCE($4, avatar_url),
            permission = COALESCE($5, permission)
            WHERE username = $1
            RETURNING *
          `,
        [username, password, name, avatar_url, permission]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const validateLogin = (username, password) => {
  return checkIfExists("users", "username", username).then((exists) => {
    if (!exists) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else if (!password) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }

    return db
      .query(
        `SELECT (password = crypt($2, password)) AS match  FROM users WHERE username = $1`,
        [username, password]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const removeComment = (comment_id) => {
  return checkIfExists("comments", "comment_id", comment_id).then((exists) => {
    if (!exists) {
      return Promise.reject({ status: 404, msg: "not found" });
    }

    return db.query(
      `
            DELETE FROM comments
            WHERE comment_id = $1
        `,
      [comment_id]
    );
  });
};

module.exports = {
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
  validateLogin,
  updateUserById,
  removeComment,
};
