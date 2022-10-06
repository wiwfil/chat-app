const express = require("express");
const http = require('http');
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const router = express.Router();
require("dotenv").config();
connectDB();
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/messages");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");
const socket = require("socket.io");



const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors({
  optionsSuccessStatus: 200, // For legacy browser support
    credentials: true, // This is important.
    origin: "https://vagadrea-chat-app.netlify.app",
}));
app.use(express.json());

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/message", messageRoutes);
  app.use("/api/request", requestRoutes);
  app.use("/",router.get("/", (req, res) => {
    res.send({ response: "Server is up and running." }).status(200);
  }))



app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
    transports: ['websocket'] 
  },
});
io.origins('*:*')

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {

    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));