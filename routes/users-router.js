const {
  getUsers,
  getUserById,
  postUserById,
  patchUserById,
} = require("../app/app.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

usersRouter
  .route("/:username")
  .get(getUserById)
  .post(postUserById)
  .patch(patchUserById);

module.exports = usersRouter;
