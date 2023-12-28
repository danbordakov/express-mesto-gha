const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  // const validToken = token.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    next(new UnauthorizedError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};
