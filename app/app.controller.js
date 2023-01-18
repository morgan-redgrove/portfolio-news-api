const { selectTopics, insertComment } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })

}

const postComment = (request, response, next) => {
    const { username, body }  = request.body
    const { article_id } = request.params
    insertComment(username, body, article_id)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, postComment }