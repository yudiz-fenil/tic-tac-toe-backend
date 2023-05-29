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
let aBoard = [null, null, null, null, null, null, null, null, null];
const changePlayerTurn = () => {
  bPlayerTurn = !bPlayerTurn;
};

const checkWinner = (aBoard) => {
  for (let i = 0; i < win.length; i++) {
    const [a, b, c] = win[i];
    if (aBoard[a] && aBoard[a] === aBoard[b] && aBoard[a] === aBoard[c]) {
      return aBoard[a];
    }
  }
  return "draw";
};

const availableMoves = (aBoard) => {
  const emptyIndexes = [];
  aBoard.forEach((value, index) => {
    if (value === null) {
      emptyIndexes.push(index);
    }
  });
  return emptyIndexes;
};

const playMove = (nIndex) => {
  if (aBoard[nIndex] == null) {
    aBoard[nIndex] = bPlayerTurn ? "cross" : "zero";
    nCountMove++;
    if (nCountMove > 4) {
      const nWinner = checkWinner(aBoard);
      if (nCountMove == 9 && nWinner == "draw") {
        return "draw";
      }
      if (nWinner != "draw") {
        aBoard = [null, null, null, null, null, null, null, null, null];
        return nWinner;
      } else {
        if (nCountMove <= 8) changePlayerTurn();
        return availableMoves(aBoard);
      }
    } else {
      if (nCountMove <= 8) changePlayerTurn();
      return availableMoves(aBoard);
    }
  } else {
    return "Invalid Move";
  }
};

module.exports = { playMove };
