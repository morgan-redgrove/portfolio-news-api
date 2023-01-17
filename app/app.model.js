const db = require("../db/connection")

const selectArticles = () => {
    return db.query(`
        SELECT articles.*,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN
        comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
        `)
    .then((result) => {
        return result.rows
    })
}

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

module.exports = { selectTopics, selectArticles }
