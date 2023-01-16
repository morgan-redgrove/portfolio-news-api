const getTopics = (request, response) => {
    response.status(200).send({topics: [{}]})
}

module.exports = { getTopics }