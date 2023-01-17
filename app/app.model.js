const db = require("../db/connection")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

const selectArticleByID = (article_id) => {
    if (/[^\d]/g.test(article_id)) {
        return Promise.reject ({status: 400, msg: "bad request"})
    }
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `,
    [article_id])
    .then((result) => {
        if (!result.rows[0]) {
            return Promise.reject ({status: 404, msg: "not found"})
        }
        return result.rows[0]
    })
}

module.exports = { selectTopics, selectArticleByID }