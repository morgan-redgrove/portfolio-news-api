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
        describe("GET /api/articles/:article_id/comments", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("comments")
                    const { comments } = body
                    expect(comments instanceof Array).toBe(true)
                    comments.forEach((element) => {
                        expect(element instanceof Object).toBe(true)
                    })
                })
            })
            test("each object in the 'comments' array has the expected keys and value types", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    const { comments } = body
                    expect(comments.length).toBeGreaterThan(0)
                    comments.forEach((comment) => {
                        expect(comment.comment_id).toEqual(expect.any(Number))
                        expect(comment.votes).toEqual(expect.any(Number))
                        expect(comment.created_at).toEqual(expect.any(String))
                        expect(comment.author).toEqual(expect.any(String))
                        expect(comment.body).toEqual(expect.any(String))
                        expect(comment.article_id).toEqual(expect.any(Number))
                    })
                })
            })
            test("responds with status code 404 'not found' if there are no comments with a matching article_id", () => {
                return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("not found")
                })
            })
            test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
                return request(app)
                .get("/api/articles/not-a-number/comments")
                .expect(400)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("bad request")
                })
            })
        })  
    })
})