
const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, insertComment, selectUsers } = require("./app.model")

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

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, getUsers }