const ERROR_INCORRECT = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;



module.exports = sendErrorMessage = (res, err) => {
  switch ( err.name === "ValidationError") {
    case "ValidationError":
      res.status(ERROR_INCORRECT).send({
        message:
          " Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля"
      });
      break;
    case "CastError":
      res
        .status(ERROR_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден." });
      break;
    default:
      res
        .status(ERROR_DEFAULT)
        .send({ message: "Сервер не отвечает , повторите запрос позднее" });
  }
};
