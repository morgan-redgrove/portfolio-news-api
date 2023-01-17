const db = require("../db/connection")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

const selectArticleCommentsById = (article_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    `,
    [article_id])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({status: 404, msg: "not found"})
        }
        return result.rows
    })
}

module.exports = { selectTopics, selectArticleCommentsById }