const db = require("../db/connection")
const format = require("pg-format")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

const checkIfExists = (table, column, value) => {
    const queryString = format(`
        SELECT * FROM %I
        WHERE %I = $1
    `, table, column)

    return db.query(queryString, [value])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({ status: 404, msg: 'not found' })
        }
    })
}

const insertComment = (username, body, article_id) => {
    return checkIfExists("articles", "article_id", article_id)
    .then(() => {
        return db.query(`
            INSERT INTO comments (
                author,
                body,
                article_id,
                votes,
                created_at
    
            )
            VALUES (
                $1,
                $2,
                $3,
                DEFAULT,
                DEFAULT
            )
            RETURNING *
        `,
        [username, body, article_id])
    })
    .then((result) => {
        return result.rows[0]
    })
}

module.exports = { selectTopics, insertComment }