const request = require("supertest");
const assert = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const comments = require("../db/data/test-data/comments");
const expectedEndpoints = require("../endpoints.json");
const { checkHash } = require("../db/seeds/utils");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("news-api", () => {
  describe("GET requests", () => {
    describe("GET /api", () => {
      test("responds with status code 200 and an object in expected format", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            const { endpoints } = body;
            expect(JSON.stringify(endpoints)).toBe(
              JSON.stringify(expectedEndpoints)
            );
          });
      });
    });
    describe("GET /api/topics", () => {
      test("responds with status code 200 and an object in expected format", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const { topics } = body;
            expect(topics.length).toBeGreaterThan(0);
            topics.forEach((topic) => {
              expect(topic.slug).toEqual(expect.any(String));
              expect(topic.description).toEqual(expect.any(String));
            });
          });
      });
    });
    describe("GET /api/articles", () => {
      test("responds with status code 200 and an object in expected format", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
              expect(article.author).toEqual(expect.any(String));
              expect(article.title).toEqual(expect.any(String));
              expect(article.article_id).toEqual(expect.any(Number));
              expect(article.topic).toEqual(expect.any(String));
              expect(article.created_at).toEqual(expect.any(String));
              expect(article.votes).toEqual(expect.any(Number));
              expect(article.article_img_url).toEqual(expect.any(String));
              expect(article.comment_count).toEqual(expect.any(String));
              expect(article.vote_history).toEqual(expect.any(Array));
            });
          });
      });
      test("the value of 'comment_count' is equal to the number of comments for a given article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
              const expectedCount = comments.filter((comment) => {
                return comment.article_id == article.article_id;
              }).length;
              expect(article.comment_count).toBe(String(expectedCount));
            });
          });
      });
      test("the 'articles' array is returned in descending date order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("the 'articles' array is returned in ascending order when query 'order=ASC' is provided", () => {
        return request(app)
          .get("/api/articles?order=ASC")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            expect(articles).toBeSortedBy("created_at");
          });
      });
      test("the 'articles' array is returned in descending order when query 'order=DESC' is provided", () => {
        return request(app)
          .get("/api/articles?order=DESC")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("the 'articles' array is returned ordered by the 'sort_by=' query when provided", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      });
      test("the 'articles' array is returned filtered by the 'topic=' query when provided", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test("responds with status code 404 'not found' if there are no articles with a matching topic", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided a query with an illegal column name or order direction", () => {
        return request(app)
          .get("/api/articles?sort_by=not-a-column")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .get("/api/articles?order=not-a-direction")
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
    });
    describe("GET /api/articles/:article_id", () => {
      test("responds with status code 200 and an object in expected format", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.author).toEqual(expect.any(String));
            expect(article.title).toEqual(expect.any(String));
            expect(article.article_id).toBe(1);
            expect(article.body).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.article_img_url).toEqual(expect.any(String));
            expect(article.vote_history).toEqual(expect.any(Array));
          });
      });
      test("the returned object has a key of 'comment_count'", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.comment_count).toEqual(expect.any(String));
          });
      });
      test("responds with status code 404 'not found' if there are no articles with a matching comment_id", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
        return request(app)
          .get("/api/articles/not-a-number")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("GET /api/articles/:article_id/comments", () => {
      test("responds with status code 200 and an object in expected format", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBeGreaterThan(0);
            comments.forEach((comment) => {
              expect(comment.comment_id).toEqual(expect.any(Number));
              expect(comment.votes).toEqual(expect.any(Number));
              expect(comment.created_at).toEqual(expect.any(String));
              expect(comment.author).toEqual(expect.any(String));
              expect(comment.body).toEqual(expect.any(String));
              expect(comment.article_id).toBe(1);
              expect(comment.vote_history).toEqual(expect.any(Array));
            });
          });
      });
      test("the 'comments' array is returned in descending date order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBeGreaterThan(0);
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("responds with status code 404 'not found' if there are no comments with a matching article_id", () => {
        return request(app)
          .get("/api/articles/9999/comments")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
        return request(app)
          .get("/api/articles/not-a-number/comments")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("GET /api/users", () => {
      test("responds with status code 200 and an array of user objects in the expected format", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users.length).toBeGreaterThan(0);
            users.forEach((user) => {
              expect(user.username).toEqual(expect.any(String));
              expect(user.name).toEqual(expect.any(String));
              expect(user.avatar_url).toEqual(expect.any(String));
              expect(user.permission).toEqual(expect.any(Boolean));
            });
          });
      });
    });
    describe("GET /api/users/:username", () => {
      test("reponds with status code 200 and an object in the expected format", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const { user } = body;
            expect(user.username).toBe("butter_bridge");
            expect(user.name).toBe("jonny");
            expect(user.avatar_url).toBe(
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            );
            expect(user.match).toBe(undefined);
            expect(user.permission).toBe(true);
          });
      });
      test("responds with status code 404 'not found' if there are no users with a matching username", () => {
        return request(app)
          .get("/api/users/not-a-user")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
    });
    describe("GET /api/comments/:comment_id", () => {
      test("reponds with status code 200 and an object in the expected format", () => {
        return request(app)
          .get("/api/comments/1")
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
            expect(comment.article_id).toEqual(expect.any(Number));
            expect(comment.vote_history).toEqual(expect.any(Array));
          });
      });
      test("responds with status code 404 'not found' if there are no comments with a matching comment_id", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided a comment_id that is not a number", () => {
        return request(app)
          .patch("/api/comments/not-a-number")
          .send({ inc_votes: 100 })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
  });

  describe("POST requests", () => {
    describe("POST /api/articles/:article_id/comments", () => {
      test("responds with status code 201 and the posted object in expected format", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "test" })
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toBe("butter_bridge");
            expect(comment.body).toBe("test");
            expect(comment.article_id).toBe(1);
            expect(comment.vote_history).toEqual(expect.any(Array));
          });
      });
      test("responds with status code 404 'not found' if no article found with article_id", () => {
        return request(app)
          .post("/api/articles/9999/comments")
          .send({ username: "rogersop", body: "test3" })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 404 'not found' if no user found with username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "not-a-user", body: "test4" })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided an article_id that is not a number", () => {
        return request(app)
          .post("/api/articles/not-a-number/comments")
          .send({ username: "lurker", body: "test5" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
      test("responds with status code 400 'bad request' if not provided with keys of 'username' and 'body'", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ body: "test6" })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
    });
    describe("POST /api/users/:username", () => {
      test("responds with status code 201 and the the posted user in expected format", () => {
        return request(app)
          .post("/api/users/new-user")
          .send({ name: "test", password: "test", avatar_url: "test" })
          .expect(201)
          .then(({ body: { user } }) => {
            const { username, password, name, avatar_url, permission } = user;
            expect(username).toBe("new-user");
            expect(password).toEqual(expect.any(String));
            expect(password.length).toBe(60);
            expect(password).not.toBe("test");
            expect(name).toBe("test");
            expect(avatar_url).toBe("test");
            expect(permission).toEqual(expect.any(Boolean));
          });
      });
      test("responds with status code 400 'bad request' if the username already exists", () => {
        return request(app)
          .post("/api/users/butter_bridge")
          .send({ name: "test", password: "test", avatar_url: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
      test("responds with status code 400 'bad request' if not provided with keys of 'password', 'name' and 'avatar_url'", () => {
        return request(app)
          .post("/api/users/new-user")
          .send({ password: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .post("/api/users/new-user")
              .send({ name: "test" })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              })
              .then(() => {
                return request(app)
                  .post("/api/users/new-user")
                  .send({ avatar_url: "test" })
                  .expect(400)
                  .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("bad request");
                  });
              });
          });
      });
    });
  });

  describe("PATCH requests", () => {
    describe("PATCH /api/articles/:article_id", () => {
      test("responds with status code 201 and the patched object in expected format", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 100, username: "test" })
          .expect(201)
          .then(({ body }) => {
            const { article } = body;
            expect(article.author).toEqual(expect.any(String));
            expect(article.title).toEqual(expect.any(String));
            expect(article.article_id).toBe(1);
            expect(article.body).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.article_img_url).toEqual(expect.any(String));
            expect(article.vote_history).toEqual(expect.any(Array));
          });
      });
      test("increments the article votes by the correct amount", () => {
        let previousVotes;

        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { votes } = body.article;
            previousVotes = votes;
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 100, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { votes } = body.article;
                expect(votes).toBe(previousVotes + 100);
              });
          });
      });
      test("decrements the article votes by the correct amount", () => {
        let previousVotes;

        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { votes } = body.article;
            previousVotes = votes;
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -50, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { votes } = body.article;
                expect(votes).toBe(previousVotes - 50);
              });
          });
      });
      test("appends the username to the vote_history array", () => {
        let previousVoteHistory;

        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { vote_history } = body.article;
            previousVoteHistory = vote_history;
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 100, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { vote_history } = body.article;
                expect(vote_history).toEqual([...previousVoteHistory, "test"]);
              });
          });
      });
      test("responds with status code 404 'not found' if there are no articles with a matching article_id", () => {
        return request(app)
          .patch("/api/articles/9999")
          .send({ inc_votes: 100, username: "test" })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided an article_id or inc_votes that is not a number", () => {
        return request(app)
          .patch("/api/articles/not-a-number")
          .send({ inc_votes: 100, username: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "not-a-number" })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
      test("responds with status code 400 'bad request' if not provided with the key 'inc_votes' or 'username'", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ username: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 100 })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
    });
    describe("PATCH /api/comments/:comment_id", () => {
      test("responds with status code 201 and the patched object in expected format", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 100, username: "test" })
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
            expect(comment.article_id).toEqual(expect.any(Number));
            expect(comment.vote_history).toEqual(["test"]);
          });
      });
      test("increments the comment votes by the correct amount", () => {
        let previousVotes;

        return request(app)
          .get("/api/comments/1")
          .expect(200)
          .then(({ body }) => {
            const { votes } = body.comment;
            previousVotes = votes;
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 100, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { votes } = body.comment;
                expect(votes).toBe(previousVotes + 100);
              });
          });
      });
      test("decrements the comment votes by the correct amount", () => {
        let previousVotes;

        return request(app)
          .get("/api/comments/1")
          .expect(200)
          .then(({ body }) => {
            const { votes } = body.comment;
            previousVotes = votes;
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: -50, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { votes } = body.comment;
                expect(votes).toBe(previousVotes - 50);
              });
          });
      });
      test("appends the username to the vote_history array", () => {
        let previousVoteHistory;

        return request(app)
          .get("/api/comments/1")
          .expect(200)
          .then(({ body }) => {
            const { vote_history } = body.comment;
            previousVoteHistory = vote_history;
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 50, username: "test" })
              .expect(201)
              .then(({ body }) => {
                const { vote_history } = body.comment;
                expect(vote_history).toEqual([...previousVoteHistory, "test"]);
              });
          });
      });
      test("responds with status code 404 'not found' if there are no comments with a matching comment_id", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided an comment_id or inc_votes that is not a number", () => {
        return request(app)
          .patch("/api/comments/not-a-number")
          .send({ inc_votes: 100, username: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "not-a-number" })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
      test("responds with status code 400 'bad request' if not provided with the key 'inc_votes' or 'username'", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ username: "test" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 50 })
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
      });
    });
    describe("PATCH /api/users/:username", () => {
      test("responds with status code 201 and the patched object in expected format", () => {
        return request(app)
          .patch("/api/users/butter_bridge")
          .send({
            password: "new_password",
            name: "new_name",
            avatar_url: "new_url",
            permission: false,
          })
          .expect(201)
          .then(({ body }) => {
            const { user } = body;
            expect(user.name).toBe("new_name");
            expect(user.avatar_url).toBe("new_url");
            expect(user.permission).toBe(false);
            return checkHash("new_password", user.password);
          })
          .then((match) => {
            expect(match).toBe(true);
          });
      });
      test("responds with status code 404 'not found' if there are no users with a matching username", () => {
        return request(app)
          .patch("/api/users/not-a-user")
          .send({
            password: "new_password",
            name: "new_name",
            avatar_url: "new_url",
            permission: false,
          })
          .expect(404)
          .then(({ body }) => {
            console.log(body);
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' if not provided with at least one relevant key", () => {
        return request(app)
          .patch("/api/users/butter_bridge")
          .send({})
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("PATCH /api/login", () => {
      test("responds with statis code 201 and the object in the expected format", () => {
        return request(app)
          .patch("/api/login")
          .send({ username: "butter_bridge", password: "test" })
          .expect(201)
          .then(({ body }) => {
            const { match } = body;
            expect(match).toBe(true);
          });
      });
      test("responds with status code 404 'not found' if there are no users with a matching username", () => {
        return request(app)
          .patch("/api/login")
          .send({ username: "not-a-user", password: "test" })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' if not provided with the key 'password'", () => {
        return request(app)
          .patch("/api/login")
          .send({ username: "butter_bridge" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
  });

  describe("DELETE requests", () => {
    describe("DELETE /api/comments/:comment_id", () => {
      test("responds with status code 204", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("deletes the comment from the database", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(() => {
            return request(app).get("/api/comments/1").expect(404);
          });
      });
      test("responds with status code 404 'not found' if there are no comments with a matching comment_id", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
      test("responds with status code 400 'bad request' when provided a comment_id that is not a number", () => {
        return request(app)
          .delete("/api/comments/not-a-number")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
    });
  });
});
