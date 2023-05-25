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

// io.on("connection", (socket) => {
//   console.log("socket.id", socket.id);

//   socket.on("reqJoinBoard", (data) => {
//     console.log(data);
//   });

//   socket.on("reqMove", (data) => {
//     console.log(data.nIndex);
//     // console.log(player.playMove(data.nIndex));
//     socket.broadcast.emit("resMove", { nIndex: data.nIndex });
//   });
// });

const resResult = (sWinner) => {
  const oData = {};
  oData.sWinner = sWinner;
  return { sEventName: "resResult", oData };
};

const resPlayerJoined = (iPlayerId) => {
  const oData = {};
  oData.iPlayerId = iPlayerId;
  return { sEventName: "resPlayerJoined", oData };
};

const resPlayerTurn = (iPlayerId) => {
  const oData = {};
  oData.iPlayerId = iPlayerId;
  oData.aMoves = [];
  return { sEventName: "resPlayerTurn", oData };
};

const resMove = (nIndex) => {
  const oData = {};
  oData.nIndex = nIndex;
  return { sEventName: "resMove", oData };
};

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  let iPlayerId = socket.id;
  let iBoardId = "";
  let isGameOver = false;

  const emit = (event) => {
    socket.to(iBoardId).emit(iBoardId, event);
  };

  const emitToAll = (event) => {
    io.in(iBoardId).emit(iBoardId, event);
  };

  socket.on("reqJoinBoard", (data) => {
    console.log("reqJoinBoard", data);
    iBoardId = data.sBoard;
    socket.join(data.sBoard);

    socket.on(iBoardId, (data) => {
      console.log(data);
      if (!isGameOver) {
        switch (data.sEventName) {
          case "reqMove":
            emit(resMove(data.oData.nIndex));
            const move = player.playMove(data.oData.nIndex);
            console.log("move", move);
            if (typeof move != "string") {
              emit(resPlayerTurn(iPlayerId));
            } else {
              emitToAll(resResult(move));
              isGameOver = true;
            }
            break;

          default:
            break;
        }
      }
    });

    emit(resPlayerJoined(iPlayerId));
  });
});

server.listen(3001, () => {
  console.log("SERVER STARTED");
});
