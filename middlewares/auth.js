const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../errors/401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
  }
  req.user = payload._id;
  next();
};
