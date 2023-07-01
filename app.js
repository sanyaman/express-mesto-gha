const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();

//причем тут вообще мангусты??
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/mestodb ", {
  family: 4,
  //useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: falseconst http = require("http");
});

// захардкодили идентификатор пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "64a020c888d555c2be2e0dfc",
  };
  next();
});

// http://localhost:3000/app
app.use("/app", function (req, res) {
  res.status(503).send({ 503: "Ведутся технические работы." });
});

//http://localhost:3000/users
app.use("/users", require("./routes/users"));

//http://localhost:3000/cards
app.use("/cards", require("./routes/cards"));


// если всё ок , то бозон Хиггса получен
app.listen(PORT, () => {
  console.log(`Запуск адронного коллайдера : ${PORT}`);
});
