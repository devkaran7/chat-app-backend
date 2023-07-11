const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an username"],
    unique: true,
    minLength: [4, "Please provide an username of atleast 4 characters"],
    maxLength: [12, "Please provide an username of atmaxt 12 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please enter your email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password should be atleast 8 characters long"],
    maxlength: [16, "Password should be less than 16 characters long"],
    select: false,
  },
  avatar: {
    url: {
      type: String,
      default: "",
      // required: true,
    },
    isSet: {
      type: Boolean,
      default: false,
      // required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isCorrectPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
