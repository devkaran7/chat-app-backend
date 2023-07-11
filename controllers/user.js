const User = require("../models/user");
const CustomError = require("../utils/CustomError");

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(
        new CustomError(
          "username, email and password are required for registration",
          400
        )
      );
    }
    let user = await User.findOne({ email });
    if (user) {
      return next(new CustomError("email already exists", 400));
    }
    user = await User.findOne({ username });
    if (user) {
      return next(new CustomError("username already exists", 400));
    }
    user = await User.create({ username, email, password });
    //also send json token
    user.password = undefined;
    const token = user.getJWT();
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    next(new CustomError("something went wrong", 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(
        new CustomError("username and password are required to login!", 400)
      );
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(new CustomError("user not found!", 404));
    }
    const result = await user.isCorrectPassword(password);
    if (result === false) {
      return next(new CustomError("incorrect username or password", 401));
    }
    const token = user.getJWT();
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    return next(new CustomError("something went wrong", 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    return next(new CustomError("something went wrong", 500));
  }
};

exports.setAvatar = async (req, res, next) => {
  const { avatarurl } = req.body;
  if (!avatarurl) {
    return next(new CustomError("avatar url is required", 400));
  }
  const user = await User.findById(req.user._id);
  user.avatar = { url: avatarurl, isSet: true };
  await user.save();
  res.status(200).json({ success: true, user });
};

exports.getOneUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new CustomError("user not found!", 404));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new CustomError("something went wrong", 500));
  }
};
