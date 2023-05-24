const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const player = require("./player");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);

  socket.on("reqJoinBoard", (data) => {
    console.log(data);
  });

  socket.on("reqMove", (data) => {
    console.log(data.nIndex);
    // console.log(player.playMove(data.nIndex));
    socket.broadcast.emit("resMove", { nIndex: data.nIndex });
  });
});

// io.on("connection", (socket) => {
//   console.log("socket.id", socket.id);

//   socket.on("reqJoinBoard", (data) => {
//     socket.join(data.sBoard);
//   });

//   socket.on("reqMove", (data) => {
//     console.log(data);
//     socket.to(data.sBoard).emit("resMove", data);
//   });
// });

server.listen(3001, () => {
  console.log("SERVER STARTED");
});
