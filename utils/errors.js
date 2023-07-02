const ERROR_INCORRECT = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

module.exports = sendError = (res, err) => {
  switch (err.name) {
    case "ValidationError":
      res
        .status(ERROR_INCORRECT)
        .send({ message: "Переданы некорректные данные" });
      break;
    case "CastError":
      res
        .status(ERROR_NOTFOUND)
        .send({
          message: "Объект найден или был запрошен несуществующий роут",
        });
      break;
    default:
      res
        .status(ERROR_DEFAULT)
        .send({ message: "На сервере произошла ошибка" });
  }
};
