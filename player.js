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
const checkWinner = (aBoard) => {
  for (let i = 0; i < win.length; i++) {
    const [a, b, c] = win[i];
    if (aBoard[a] && aBoard[a] === aBoard[b] && aBoard[a] === aBoard[c]) {
      return { sWinner: aBoard[a], aCombination: [a, b, c] };
    }
  }
  return { sWinner: "draw" };
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
  let bPlayerTurn = true;
  let nCountMove = 0;
  let aBoard = [null, null, null, null, null, null, null, null, null];
  const changePlayerTurn = () => {
    bPlayerTurn = !bPlayerTurn;
  };
  if (nIndex == -1) {
    return availableMoves(aBoard);
  }
  if (aBoard[nIndex] == null) {
    aBoard[nIndex] = bPlayerTurn ? "cross" : "zero";
    nCountMove++;
    if (nCountMove > 4) {
      const oWinner = checkWinner(aBoard);
      if (nCountMove == 9 && oWinner.sWinner == "draw") {
        return "draw";
      }
      if (oWinner.sWinner != "draw") {
        aBoard = [null, null, null, null, null, null, null, null, null];
        return oWinner;
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
