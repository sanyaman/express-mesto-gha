module.exports = errors = (res, err) => {
  switch (err.name) {
    case "ValidationError":
      res.status(400).send({ message : " Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля" });
      break;
    case "CastError":
      res.status(404).send({ message : "Запрашиваемый пользователь не найден." });
      break;
    default:
      res.status(500).send({ message : "Сервер не отвечает , повторите запрос позднее"});
  }

}
