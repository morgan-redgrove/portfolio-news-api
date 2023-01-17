const { selectTopics } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticleCommentsById = (request, response) => {
    response.status(200).send({comments: [{}]})
}

module.exports = { getTopics, getArticleCommentsById }