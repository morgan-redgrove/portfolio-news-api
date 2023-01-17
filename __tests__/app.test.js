const request = require("supertest")
const assert = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const expectedTopics = require("../db/data/test-data/topics")

beforeEach(() => {
    return seed(data)
})
  
afterAll(() => {
    return db.end()
})

describe("news-api", () => {
    describe("GET requests", () => {
        describe("GET /api/topics", () => {
            test("responds with status code 200", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
            })
            test("responds with an object with a key of 'topics'", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("topics")
                })  
            })    
            test("the value of 'topics' is an array of objects", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    expect(topics instanceof Array).toBe(true)
                    topics.forEach((element) => {
                        expect(element instanceof Object).toBe(true)
                    })
                })
            })  
            test("each object in the 'topics' array has a key of 'slug' and 'description'", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug")
                        expect(topic).toHaveProperty("description")
                    })
                })
            })     
            test("the values for 'slug' and 'description' are retreived from the 'nc_news_test' database", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((topic, index) => {
                        expect(topic).toEqual(expectedTopics[index])
                    })
                })
            })       
        })
        describe("GET /api/articles/:article_id", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("article")
                    const { article } = body
                    expect(article instanceof Object).toBe(true)
                })
            })
            test("the 'article' object has the correct keys and value types", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({body}) => {
                    const { article } = body
                    expect(article.author).toEqual(expect.any(String))
                    expect(article.title).toEqual(expect.any(String))
                    expect(article.article_id).toEqual(expect.any(Number))
                    expect(article.body).toEqual(expect.any(String))
                    expect(article.topic).toEqual(expect.any(String))
                    expect(article.created_at).toEqual(expect.any(String))
                    expect(article.votes).toEqual(expect.any(Number))
                    expect(article.article_img_url).toEqual(expect.any(String))
                })
            })
            test("responds with status code 404 'not found' when no article found with article_id", () => {
                return request(app)
                .get("/api/articles/9999")
                .expect(404)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("not found")
                })
            })
        })
    })
})
