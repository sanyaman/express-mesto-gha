const user = require("../models/user");
const sendErrorMessage = require("../utils/errors");
//const ObjectId = require("mongoose").Types.ObjectId;
const ERROR_INCORRECT = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;


module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendErrorMessage(res, err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => sendErrorMessage(res, err));
};

module.exports.getUserById = (req, res) => {
  User.findById(id)
    .orFail(new Error('ValidationError'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else if (err.message === 'ValidationError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Сервер не отвечает , повторите запрос позднее' });
      }
    });
};




module.exports.setUserInfo = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      }
    )
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => sendErrorMessage(res, err));
};

module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      }
    )
    .then((users) => res.send({ data: users }))
    .catch((err) => sendErrorMessage(res, err));
};
