const request = require("supertest")
const assert = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const comments = require("../db/data/test-data/comments")
const expectedArticles = require("../db/data/test-data/articles")

beforeEach(() => {
    return seed(data)
})
  
afterAll(() => {
    return db.end()
})

describe("news-api", () => {
    describe("GET requests", () => {
        describe("GET /api/articles", () => {
            test("responds with status code 200", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
            })
            test("responds with an object with a key of 'articles'", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("articles")
                })
            })
            test("the value of 'articles' is an array of objects", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    expect(articles instanceof Array).toBe(true)
                    articles.forEach((element) => {
                        expect(element instanceof Object).toBe(true)
                    })
                })
            })
            test("each object in the 'articles' array has the expected keys", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article) => {
                        expect(article).toHaveProperty("author")
                        expect(article).toHaveProperty("title")
                        expect(article).toHaveProperty("article_id")
                        expect(article).toHaveProperty("topic")
                        expect(article).toHaveProperty("created_at")
                        expect(article).toHaveProperty("votes")
                        expect(article).toHaveProperty("article_img_url")
                        expect(article).toHaveProperty("comment_count")
                    })
                })
            })  
            test("the value of 'comment_count' is equal the number of comments for a given article", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article) => {
                        const expectedCount = comments.filter((comment) => {
                            return comment.article_id == article.article_id
                        }).length
                        expect(article.comment_count).toBe(expectedCount)
                    })
                })
            })  
            test("the values of 'title', 'topic', 'author', 'body', 'created_at' and 'article_img_url' are retreived from the 'nc_snack_database'", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article, index) => {
                        expect(article.title).toBe(expectedArticles[index].title)
                        expect(article.topic).toBe(expectedArticles[index].topic)
                        expect(article.author).toBe(expectedArticles[index].author)
                        expect(article.body).toBe(expectedArticles[index].body)
                        const time = Date(article.created_at)
                        const expectedTime = Date(expectedArticles[index].created_at)
                        expect(time).toBe(expectedTime)
                        expect(article.article_img_url).toBe(expectedArticles[index].article_img_url)
                    })
                })
            })  
        })
    })
})