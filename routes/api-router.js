const apiRouter = require("express").Router()
const articlesRouter = require("../routes/articles-router")
const usersRouter = require("../routes/users-router")
const topicsRouter = require("../routes/topics-router")
const commentsRouter = require("../routes/comments-router")

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter