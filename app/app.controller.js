
const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, insertComment, updateArticlebyID, selectUsers } = require("./app.model")
const endpoints = require("../endpoints.json")

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

const getUsers = (request, response) => {
    selectUsers()
    .then((users) => {
        response.status(200).send({users})        
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

const patchArticleById = (request, response, next) => {
    const { inc_votes }  = request.body
    const { article_id } = request.params
    updateArticlebyID(inc_votes, article_id)
    .then((article) => {
        response.status(201).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const getEndpoints = (request, response, next) => {
    response.status(200).send({endpoints})
}

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticleById, getUsers, getEndpoints }