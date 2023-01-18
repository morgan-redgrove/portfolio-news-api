const request = require("supertest")
const assert = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const comments = require("../db/data/test-data/comments")

beforeEach(() => {
    return seed(data)
})
  
afterAll(() => {
    return db.end()
})

describe("news-api", () => {
    describe("GET requests", () => {
        describe("GET /api/topics", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((topic) => {
                        expect(topic.slug).toEqual(expect.any(String))
                        expect(topic.description).toEqual(expect.any(String))
                    })
                })
            })     
        })
        describe("GET /api/articles", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article) => {
                        expect(article.author).toEqual(expect.any(String))
                        expect(article.title).toEqual(expect.any(String))
                        expect(article.article_id).toEqual(expect.any(Number))
                        expect(article.topic).toEqual(expect.any(String))
                        expect(article.created_at).toEqual(expect.any(String))
                        expect(article.votes).toEqual(expect.any(Number))
                        expect(article.article_img_url).toEqual(expect.any(String))
                        expect(article.comment_count).toEqual(expect.any(String))
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
                        expect(article.comment_count).toBe(String(expectedCount))
                    })
                })
            })  
            test("the 'articles' array is returned in descending date order", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    expect(articles).toBeSortedBy("created_at", {descending: true})
                })

            }) 
        })
        describe("GET /api/articles/:article_id", () => {
            test("responds with status code 200 and an object in expected format", () => {
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
            test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
                return request(app)
                .get("/api/articles/not-a-number")
                .expect(400)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("bad request")
                })
            })
        })
        describe("GET /api/articles/:article_id/comments", () => {
            test("responds with status code 200 and an object in expected format", () => {
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
            test("the 'comments' array is returned in descending date order", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    const { comments } = body
                    expect(comments.length).toBeGreaterThan(0)
                    expect(comments).toBeSortedBy("created_at", {descending: true})
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
    describe("POST requests", () => {
        describe("POST /api/articles/:article_id/comments", () => {
            test("responds with status code 201 and the posted object in expected format", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({"username": "butter_bridge", "body": "test"})
                .expect(201)
                .then(({body}) => {
                    const { comment } = body
                    expect(comment.comment_id).toEqual(expect.any(Number))
                    expect(comment.votes).toEqual(expect.any(Number))
                    expect(comment.created_at).toEqual(expect.any(String))
                    expect(comment.author).toEqual(expect.any(String))
                    expect(comment.body).toEqual(expect.any(String))
                    expect(comment.article_id).toEqual(expect.any(Number))
                })
            })
            test("posts the new comment to the database", () => {
                const sentObj= {"username": "icellusedkars", "body": "test2"}

                return request(app)
                .post("/api/articles/1/comments")
                .send(sentObj)
                .expect(201)
                .then(() => {
                    return request(app)
                    .get("/api/articles/1/comments")
                    .expect(200)
                    .then(({ body }) => {
                        const { comments } = body
                        const { username: sentUsername, body: sentBody} = sentObj
                        const includesComment = comments.some((comment) => {
                            const { author, body } = comment
                            return author === sentUsername && body === sentBody
                        })
                        expect(includesComment).toBe(true)
                    })
                })
            })
            test("responds with status code 404 'not found' if no article found with article_id", () => {
                return request(app)
                .post("/api/articles/9999/comments")
                .send({"username": "rogersop", "body": "test3"})
                .expect(404)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("not found")
                })
            })
            test("responds with status code 404 'not found' if no user found with username", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({"username": "not-a-user", "body": "test4"})
                .expect(404)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("not found")
                })
            })
            test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
                return request(app)
                .post("/api/articles/not-a-number/comments")
                .send({"username": "lurker", "body": "test5"})
                .expect(400)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("bad request")
                })
            })
            test("responds with status code 400 'bad request' if not provided with keys of 'username' and 'body'", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({"username": "butter_bridge"})
                .expect(400)
                .then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe("bad request")
                })
                .then(() => {
                    return request(app)
                    .post("/api/articles/1/comments")
                    .send({"body": "test6"})
                    .expect(400)
                    .then(({body}) => {
                        const { msg } = body
                        expect(msg).toBe("bad request")
                    })
                })
            })
        })
    })
})
