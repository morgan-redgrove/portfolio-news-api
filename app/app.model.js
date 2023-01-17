const db = require("../db/connection")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

const insertComment = (username, body, article_id) => {
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
    .then((result) => {
        console.log(result.rows[0])
        return result.rows[0]
    })
}

module.exports = { selectTopics, insertComment }