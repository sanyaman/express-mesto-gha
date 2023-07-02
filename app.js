const express = require("express");
const mongoose = require("mongoose");
const sendErrorMessage = require("./utils/errors");
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/mestodb ", {
  family: 4,
});

// захардкодили идентификатор пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "64a020c888d555c2be2e0dfc",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use('*',function(req, res) { sendErrorMessage(res,{name:'CastError'}) });


// если всё ок , то бозон Хиггса получен
app.listen(PORT, () => {
  console.log(`Запуск адронного коллайдера : ${PORT}`);
});
