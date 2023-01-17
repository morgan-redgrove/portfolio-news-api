const db = require("../db/connection")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

const selectCommentsByArticleId = (article_id) => {
    if (/[^\d]/g.test(article_id)) {
        return Promise.reject ({status: 400, msg: "bad request"})
    }
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
    [article_id])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({status: 404, msg: "not found"})
        }
        return result.rows
    })
}

module.exports = { selectTopics, selectCommentsByArticleId }