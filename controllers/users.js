const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next());
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Указан несуществующий ID пользователя");
      }
      return res.send(user);
    })
    .catch((err) => next(new BadRequestError("Указан некорректный ID")));
};

module.exports.getAdminUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Указан несуществующий ID пользователя");
      }
      return res.send(user);
    })
    .catch((err) => next(new BadRequestError("Указан некорректный ID")));
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Пользователь уже существует"));
    }
    next(
      new BadRequestError(
        "Переданы некорректные данные при создании пользователя"
      )
    );
  }
};

//общая функция обновления
function updateUserInfo(field, resEx, reqEx, badRequestMessage, nextEx) {
  User.findByIdAndUpdate(reqEx.user._id, field, {
    runValidators: true,
    returnDocument: "after",
  })
    .then((user) => resEx.send(user))
    .catch((err) => nextEx(new BadRequestError(badRequestMessage)));
}

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUserInfo(
    { name, about },
    res,
    req,
    "Переданы некорректные данные при обновлении пользователя",
    next
  );
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserInfo(
    { avatar },
    res,
    req,
    "Переданы некорректные данные при обновлении аватара пользователя",
    next
  );
};
//-------------------------------------------------------------

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }
    const token = jwt.sign({ _id: user._id }, "secret-key", {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 604800000,
      httpOnly: true,
    });
    return res.status(200).send({ token });
  } catch (error) {
    next(new UnauthorizedError("Неправильные почта или пароль"));
  }
};
