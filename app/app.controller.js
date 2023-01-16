const getArticles = (request, response) => {
    response.status(200).send({articles: ""})
}

module.exports = { getArticles }