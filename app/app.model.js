const db = require("../db/connection")
const format = require ("pg-format")

const selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
    .then((result) => {
        return result.rows
    })
}

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

const selectArticleByID = (article_id) => {
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

const selectCommentsByArticleId = (article_id) => {
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
                article_id  
            )
            VALUES (
                $1,
                $2,
                $3
            )
            RETURNING *
        `,
        [username, body, article_id])
    })
    .then((result) => {
        return result.rows[0]
    })
}

const updateArticlebyID = (inc_votes, article_id) => {
    return checkIfExists("articles", "article_id", article_id)
    .then (() => {
        return db.query(`
                UPDATE articles
                SET
                votes = votes + $1
                WHERE article_id = $2
                RETURNING *
            `, 
            [inc_votes, article_id])
    })
    .then((result) => {
        return result.rows[0]
    })   
}

module.exports = { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, insertComment,updateArticlebyID }

