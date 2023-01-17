const { selectTopics, selectArticleCommentsById } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticleCommentsById = (request, response) => {
    const { article_id } = request.params
    selectArticleCommentsById(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })   
}

module.exports = { getTopics, getArticleCommentsById }