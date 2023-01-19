const db = require("../db/connection")
const format = require ("pg-format")
const { response } = require("./app")

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

const selectArticles = (query) => {
    const topic = query.topic
    const sort_by = query.sort_by ?? "created_at"
    const order = query.order ?? "DESC"

    const sortByGreenList = ["title", "topic", "author", "body", "created_at", "article_img_url"]
    const orderGreenList = ["ASC", "DESC"]

    const greenLight = sortByGreenList.includes(sort_by) && orderGreenList.includes(order)

    let queryString = format(`
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN
    comments
    ON articles.article_id = comments.article_id
    `)
    
    if (topic) {
        return checkIfExists("articles", "topic", topic)
        .then(() => {
            queryString += `WHERE topic = $1\nGROUP BY articles.article_id\n`
            if (greenLight) {
                queryString += `ORDER BY ${sort_by} ${order}`
            } else {
                return Promise.reject({status: 400, msg: "bad request"})
            }
            return db.query(queryString, [topic])
            .then((result) => {
                return result.rows
            })
        })
    } else {
        queryString += `GROUP BY articles.article_id\n`
        if (greenLight) {
            queryString += `ORDER BY ${sort_by} ${order}`
        } else {
            return Promise.reject({status: 400, msg: "bad request"})
        }
        return db.query(queryString)
        .then((result) => {
            return result.rows
        })
    }
}

const selectArticleByID = (article_id) => {
    return db.query(`
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN
    comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
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

const selectUsers = () => {
    return db.query(`
        SELECT * FROM users
    `)
    .then((result) => {
        return result.rows
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
    .then(() => {
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

const removeComment = (comment_id) => {
    return checkIfExists("comments", "comment_id", comment_id)
    .then(() => {
        return db.query(`
            DELETE FROM comments
            WHERE comment_id = $1
        `, [comment_id])
    })
}

module.exports = { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, insertComment, updateArticlebyID, selectUsers, removeComment }