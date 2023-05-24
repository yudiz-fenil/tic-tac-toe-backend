let bPlayerTurn = true;
const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let nCountMove = 0;
const board = ["", "", "", "", "", "", "", "", ""];
const changePlayerTurn = () => {
  bPlayerTurn = !bPlayerTurn;
};

const checkWinner = (board) => {
  for (let i = 0; i < win.length; i++) {
    const [a, b, c] = win[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return "draw";
};

const playMove = (nIndex) => {
  if (board[nIndex] == "") {
    board[nIndex] = bPlayerTurn ? "cross" : "zero";
    nCountMove++;
    if (nCountMove > 4) {
      const nWinner = checkWinner(board);
      if (nCountMove == 9 && nWinner == "draw") {
        return "draw";
      }
      if (nWinner != "draw") {
        return nWinner;
      } else {
        if (nCountMove <= 8) changePlayerTurn();
      }
    } else {
      if (nCountMove <= 8) changePlayerTurn();
    }
    console.log(board);
    changePlayerTurn();
  } else {
    console.log("error");
  }
};

module.exports = { playMove };
