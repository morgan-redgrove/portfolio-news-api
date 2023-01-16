const request = require("supertest")
const assert = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

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
        })
    })
})