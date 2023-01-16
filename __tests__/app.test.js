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
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug")
                        expect(topic).toHaveProperty("description")
                    })
                })
            })         
        })
    })
})