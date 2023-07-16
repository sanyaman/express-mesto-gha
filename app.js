const express = require("express");
const mongoose = require("mongoose");
const requestLimit = require("express-rate-limit");
const { login, createUser } = require("./controllers/users");
const { celebrate, Joi, errors } = require("celebrate");
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { PORT, MESTODB } = process.env;

const NOT_FOUND_ERROR = require("./errors/404");
const errorServer = require("./middlewares/errorServer");

const app = express();
app.use(express.json());
mongoose.connect(MESTODB, {
  family: 4,
});

const limiter = requestLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message:
    "Превышено количество запросов на сервер, попробуйте выполнить запрос позднее",
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30).email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/(http|https)\:\/\/[a-zA-Z0-9\-\.\/\_]+/),
      email: Joi.string().required().min(2).max(30).email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser
);

// захардкодили идентификатор пользователя
//app.use((req, res, next) => {
//  req.user = {
//    _id: "64a020c888d555c2be2e0dfc",
//  };
// next();
//});

app.use(cookieParser());
app.use(limiter);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.use("/*", () => {
  throw new NOT_FOUND_ERROR("Запрашиваемый пользователь не найден");
});

app.use(errors());
app.use(errorServer);
// если всё ок , то бозон Хиггса получен
app.listen(PORT, () => {
  console.log(`Запуск адронного коллайдера : ${PORT}`);
});
