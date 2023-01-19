
const { removeComments } = require("@babel/types")
const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleId, insertComment, updateArticlebyID, selectUsers, removeComment } = require("./app.model")

const getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticles = (request, response, next) => {
    const { query } = request
    selectArticles(query)
    .then((articles) => {
        response.status(200).send({articles}) 
    })
    .catch((err) => {
        next(err)
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

const deleteComment= (request,response, next) => {
    const { comment_id } = request.params
    removeComment(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticleById, getUsers, deleteComment }