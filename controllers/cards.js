const card = require('../models/card');
// eslint-disable-next-line import/order, no-unused-vars
const { ObjectId } = require('mongoose').Types;
const NOT_FOUND_ERROR = require('../errors/404');
const FORBIDDEN = require('../errors/403');

module.exports.createCard = (req, res, next) => {
  const {
    name, link, owner = req.user, likes = [], createAt,
  } = req.body;
  card
    .create({
      name,
      link,
      owner,
      likes,
      createAt,
    })
    // eslint-disable-next-line no-shadow
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Некорректные данные при создании карточки');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .populate('owner')
    .then((cards) => {
      if (!cards) {
        throw new NOT_FOUND_ERROR('Карты не найдены');
      }
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.cardId)
    .then((dbCard) => {
      if (!dbCard) {
        throw new NOT_FOUND_ERROR('Карта с данным _id не найдена');
      }
      if (dbCard.owner.toString() !== req.user) {
        throw new FORBIDDEN(
          'Невозможно удалить карту с другим _id пользователя',
        );
      }
      return card
        .deleteOne({ _id: dbCard._id })
        // eslint-disable-next-line consistent-return
        .then((c) => {
          if (c.deletedCount === 1) {
            return dbCard;
          }
        })
        .then((removedCard) => res.send({ data: removedCard }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user } })
    .then((cards) => {
      if (cards) {
        res.send({ data: cards });
      } else if (!cards) {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user } })
    .then((cards) => {
      if (cards) {
        res.send({ data: cards });
      } else {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};
