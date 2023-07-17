const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NOT_FOUND_ERROR = require('../errors/404');
const UNAUTHORIZED = require('../errors/401');
const CONFLICT_ERROR = require('../errors/409');

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => {
      if (!users) {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .catch(() => {
      throw new CONFLICT_ERROR('Пользователь с таким email уже существует');
    })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      // eslint-disable-next-line no-shadow
      const { password, ...result } = user.toObject();
      res.send({ data: result });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user;
  user
    .findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user
    .findById(req.params.userId)
    .then((users) => {
      if (users) {
        res.send({ data: users });
      } else {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((users) => {
      if (!users) {
        throw new NOT_FOUND_ERROR(
          'Не удалось обновить информацию пользователя по указанному _id',
        );
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.user,
      { avatar },
      {
        new: true,
      },
    )
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Не удалось обновить данные аватара');
      }
      res.send({ avatar: user.avatar });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email })
    .select('+password')
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
      }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
          }
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: '7d',
          });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          });
          res.send({
            data: `${user.email} Вход выполнен , начинается телепортация в мета вселенную`,
          });
        })
        .catch(() => {
          throw new UNAUTHORIZED('Ошибка Авторизации');
        });
    })
    .catch(next);
};
