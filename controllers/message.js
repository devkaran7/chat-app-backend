const Message = require("../models/message");
const User = require("../models/user");
const CustomError = require("../utils/CustomError");

exports.addMessage = async (req, res, next) => {
  try {
    const { text, to } = req.body;
    const userId = req.user._id;
    if (!text || !to) {
      return next(new CustomError("text and to are required fields", 400));
    }
    const receiver = await User.findById(to);
    if (!receiver) {
      return next(new CustomError("receiver does not exists", 404));
    }
    const message = await Message.create({ text, to, from: userId });
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(new CustomError("something went wrong", 500));
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { to } = req.body;
    const userId = req.user._id;
    if (!to) {
      return next(new CustomError("to is required field", 400));
    }
    const receiver = await User.findById(to);
    if (!receiver) {
      return next(new CustomError("receiver does not exists", 404));
    }
    const messages = await Message.find({
      $or: [
        { from: userId, to },
        { to: userId, from: to },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(new CustomError("something went wrong", 500));
  }
};
