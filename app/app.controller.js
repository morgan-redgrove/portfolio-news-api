const getArticles = (request, response) => {
    response.status(200).send({articles: [{
        author: "",
        title: "",
        article_id: "",
        topic: "",
        created_at: "",
        votes: "",
        article_img_url: "",
        comment_count: ""
    }]})
}

module.exports = { getArticles }