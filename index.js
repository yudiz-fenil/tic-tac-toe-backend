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

const randomTurn = () => {
  return Math.random() < 0.5;
};

const resResult = (sWinner, aCombination) => {
  const oData = {};
  oData.sWinner = sWinner;
  oData.aCombination = aCombination;
  return { sEventName: "resResult", oData };
};

const resPlayerJoined = (iPlayerId, iBoardId) => {
  const oData = {};
  oData.iBoardId = iBoardId;
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

const resBoardState = (aPlayers, iBoardId) => {
  const oData = {};
  oData.iBoardId = iBoardId;
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

      emitToSocketId(
        iPlayerId,
        resBoardState(oPlayersByRoom[iBoardId], iBoardId)
      );

      socket.on(iBoardId, (data) => {
        console.log(data);
        if (!isGameOver && data.sEventName == "reqMove") {
          emit(resMove(data.oData.nIndex));
          const move = new player.playMove(data.oData.nIndex);
          if (typeof move != "string") {
            console.log(move);
            if (move.sWinner) {
              emitToAll(resResult(move.sWinner, move.aCombination));
            } else {
              emitToAll(resPlayerTurn(iPlayerId, move));
            }
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
    emit(resPlayerJoined(iPlayerId, iBoardId));
    if (oPlayersByRoom[iBoardId].length === 2) {
      const aMoves = player.playMove(-1);
      emitToAll(resPlayerTurn(iPlayerId, aMoves));
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER STARTED");
});
