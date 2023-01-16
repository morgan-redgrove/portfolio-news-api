const getTopics = (request, response) => {
    response.status(200).send({topics: [{slug: "", description: ""}]})
}

module.exports = { getTopics }