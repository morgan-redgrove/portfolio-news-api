const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, updateArticlebyID } = require("./app.model")


const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticles = (request, response) => {
    selectArticles()
    .then((articles) => {
        response.status(200).send({articles}) 
    })
}

const getArticleById = (request, response, next) => {
    const { article_id } = request.params
    selectArticleByID(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })   
}

const patchArticleById = (request, response) => {
    const { newVote }  = request.body
    const { article_id } = request.params
    updateArticlebyID(newVote, article_id)
    .then((article) => {
        response.status(201).send({article})
    })
}

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, patchArticleById }
