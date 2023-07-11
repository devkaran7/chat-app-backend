require("dotenv").config();
const app = require("./app");
const { Server } = require("socket.io");
const connectWithDb = require("./config/db");

const cloudinary = require("cloudinary").v2;

//connect with database
connectWithDb();

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.COULDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log("server is running on port : " + process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId.toString(), socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to.toString());
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });
});
