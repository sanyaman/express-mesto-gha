const user = require("../models/user");
const sendErrorMessage = require("../utils/errors");
const ObjectId = require("mongoose").Types.ObjectId;

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
  if (ObjectId.isValid(req.params.userId)) {
    user
      .findById(req.params.userId)
      .then((users) => {
        if (users) {
          res.send({ data: users });
        } else {
          return Promise.reject({ name: "CastError" });
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res.status(ERROR_INCORRECT).send({
            message: "1111111",
          });
        } else if (err.name === "CastError") {
          return res.status(ERROR_NOTFOUND).send({
            message: "П222",
          });
        } else {
          return res
            .status(ERROR_DEFAULT)
            .send({ message: "33333" });
        }
      });
}};

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
