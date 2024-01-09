const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError("Необходима авторизация1");
  }

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    next(new UnauthorizedError("Необходима авторизация2"));
  }

  req.user = payload;

  next();
};
