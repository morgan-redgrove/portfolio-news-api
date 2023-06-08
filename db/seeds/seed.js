const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
  hash,
} = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS passwords;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      const topicsTablePromise = db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        password VARCHAR(60) NOT NULL,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR NOT NULL,
        permission BOOL DEFAULT true
      );`);

      return Promise.all([topicsTablePromise, usersTablePromise]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
        vote_history TEXT[] DEFAULT '{}'
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        vote_history TEXT[] DEFAULT '{}'
      );`);
    })
    .then(() => {
      const insertTopicsQueryStr = format(
        "INSERT INTO topics (slug, description) VALUES %L;",
        topicData.map(({ slug, description }) => [slug, description])
      );

      return db.query(insertTopicsQueryStr);
    })
    .then(() => {
      return Promise.all(
        userData.map(({ username, password, name, avatar_url }) => {
          return hash(password).then((hash) => {
            return [username, hash, name, avatar_url];
          });
        })
      );
    })
    .then((formattedUserData) => {
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, password, name, avatar_url) VALUES %L;",
        formattedUserData
      );

      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const formattedArticleData = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
        formattedArticleData.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes = 0,
            article_img_url,
          }) => [title, topic, author, body, created_at, votes, article_img_url]
        )
      );

      return db.query(insertArticlesQueryStr);
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, "title", "article_id");
      const formattedCommentData = formatComments(commentData, articleIdLookup);

      const insertCommentsQueryStr = format(
        "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
        formattedCommentData.map(
          ({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
          ]
        )
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;
