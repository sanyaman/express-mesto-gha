const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getCurrentUser,
  getUserById,
  setAvatar,
  setUserInfo,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.get("/", getUsers);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/(http|https)\:\/\/[a-zA-Z0-9\-\.\/\_]+/),
    }),
  }),
  setAvatar
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  setUserInfo
);

module.exports = router;
