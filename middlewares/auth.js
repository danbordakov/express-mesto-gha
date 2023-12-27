const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const validToken = token.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
};
