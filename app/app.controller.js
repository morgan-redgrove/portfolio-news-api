const { selectTopics } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })

}

const postComment = (request, response) => {
    response.status(201).send({comment: {}})
}

module.exports = { getTopics, postComment }