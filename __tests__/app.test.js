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
    })
    describe("POST requests", () => {
        describe("POST /api/articles/:article_id/comments", () => {
            test("responds with status code 201 and the posted object in expected format", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({})
                .expect(201)
                .then(({body}) => {
                    expect(body).toHaveProperty("comment")
                    const { comment } = body
                    expect(comment instanceof Object).toBe(true)
                }) 
            })
        })
    })
})