const { selectTopics } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticleById = (request, response) => {
    response.status(200).send({article: {}})
}

module.exports = { getTopics, getArticleById }