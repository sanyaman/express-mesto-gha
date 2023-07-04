const card = require("../models/card");
const sendErrorMessage = require("../utils/errors");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link, owner = req.user._id } = req.body;

  card
    .create({
      name,
      link,
      owner,
      likes,
      createAt,
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => sendErrorMessage(res, err));
};

module.exports.getCards = (req, res) => {
  card
    .find({})
    .populate("owner")
    .then((cards) => res.send({ data: cards }))
    .catch((err) => sendErrorMessage(res, err));
};

module.exports.deleteCard = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    card
      .findByIdAndRemove(req.params.cardId)
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
        } else {
          return Promise.reject({ name: "CastError" });
        }
      })
      .catch((err) => sendErrorMessage(res, err));
  } else {
    res.status(ERROR_INCORRECT).sendErrorMessage(res, { name: "ValidationError" });
  }
};

module.exports.likeCard = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    card
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        {
          new: true,
          //runValidators: true,
        }
      )
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
        } else {
          return Promise.reject({ name: "CastError" });
        }
      })
      .catch((err) => sendErrorMessage(res, err));
  } else {
    res.status(ERROR_INCORRECT).sendErrorMessage(res, { name: "ValidationError" });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    card
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        {
          new: true,
          //runValidators: true,
        }
      )
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
        } else {
          return Promise.reject({ name: "CastError" });
        }
      })
      .catch((err) => sendErrorMessage(res, err));
  } else {
    res.status(ERROR_INCORRECT).sendErrorMessage(res, { name: "ValidationError" });
  }
};
