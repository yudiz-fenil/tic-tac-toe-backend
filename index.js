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

const resPlayerTurn = (iPlayerId, aMoves) => {
  const oData = {};
  oData.iPlayerId = iPlayerId;
  oData.aMoves = aMoves;
  return { sEventName: "resPlayerTurn", oData };
};

const resMove = (nIndex) => {
  const oData = {};
  oData.nIndex = nIndex;
  return { sEventName: "resMove", oData };
};

const resBoardState = (aPlayers) => {
  const oData = {};
  oData.aPlayers = aPlayers;
  return { sEventName: "resBoardState", oData };
};

const resBoardFull = () => {
  const oData = {};
  oData.sMessage = "Board is Full";
  return { sEventName: "resBoardFull", oData };
};

const oPlayersByRoom = [];
io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  let iPlayerId = socket.id;
  let iBoardId = "";
  let isGameOver = false;

  const emitToSocketId = (id, event) => {
    io.to(id).emit(iBoardId, event);
  };

  const emit = (event) => {
    socket.to(iBoardId).emit(iBoardId, event);
  };

  const emitToAll = (event) => {
    io.in(iBoardId).emit(iBoardId, event);
  };

  socket.on("reqJoinBoard", (data) => {
    iBoardId = data.sBoard;
    if (!oPlayersByRoom[iBoardId]) {
      oPlayersByRoom[iBoardId] = [];
    }
    if (oPlayersByRoom[iBoardId].length < 2) {
      socket.join(iBoardId);
      oPlayersByRoom[iBoardId].push(iPlayerId);

      emitToSocketId(iPlayerId, resBoardState(oPlayersByRoom[iBoardId]));

      socket.on(iBoardId, (data) => {
        console.log(data);
        if (!isGameOver && data.sEventName == "reqMove") {
          emit(resMove(data.oData.nIndex));
          const move = player.playMove(data.oData.nIndex);
          if (typeof move != "string") {
            emitToAll(resPlayerTurn(iPlayerId, move));
          } else {
            emitToAll(resResult(move));
            isGameOver = true;
          }
        }
      });
    } else {
      emitToSocketId(iPlayerId, resBoardFull());
      return;
    }
    emit(resPlayerJoined(iPlayerId));
    
  });
});

server.listen(3001, () => {
  console.log("SERVER STARTED");
});
