const db = require("../db/connection")

const selectArticles = () => {
    return db.query(`
        SELECT articles.*, 
        COALESCE (comment_count.count :: INT, 0) AS comment_count
        FROM articles
        LEFT OUTER JOIN
        (
        SELECT article_id, COUNT(*)
        FROM comments
        GROUP BY article_id
        ) comment_count
        ON articles.article_id = comment_count.article_id
        ORDER BY articles.created_at DESC
    `)
    .then((result) => {
        return result.rows
    })
}

module.exports = { selectArticles }