const { patchLogin } = require("../app/app.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").patch(patchLogin);

module.exports = usersRouter;
