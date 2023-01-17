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
        return result.rows
    })
}

module.exports = { selectTopics, selectArticleCommentsById }