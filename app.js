require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error");

const app = express();

//general middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");

app.use("/api/v1", userRoutes);
app.use("/api/v1", messageRoutes);
app.use("*", errorHandler);

module.exports = app;
