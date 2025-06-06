// FUNCTIONALITY

function createPlayer(name, marker) {
  return { name, marker };
}

function createBoard(n) {
  const gameBoard = [];

  for(let i = 0; i < n; i++){
    gameBoard.push(null);
  }
  return gameBoard;
}

function checkWinner(array, player) {
  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for(const combo of combinations){
    const [first, second, third] = combo;
    if(array[first] === player.marker && array[second] === player.marker && array[third] === player.marker){
      // WINNER CHECKED !!
      console.log(combo);
      return combo;
    }
  }
  return null;
}

function gamePlay(name1, name2) {
  const gameBoard = createBoard(9);
  let player1 = createPlayer(name1, "o");
  let player2 = createPlayer(name2, "x");
  let activePlayer = player1;
  let winningCombo = null;
  let draw = false;

  const getBoard = () => [...gameBoard];
  const getActivePlayer = () => activePlayer;
  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
  const getWinningCombo = () => winningCombo;
  const isDraw = () => draw;

  const playRound = (index) => {
    index = Number(index);
    if (!gameBoard[index]) {
      gameBoard[index] = activePlayer.marker;
      const winner = checkWinner(gameBoard, activePlayer);
      if (!winner) {
        if (!gameBoard.includes(null)) {
          draw = true;
          // DRAW !!!
          console.log(`The draw is ${draw}`);
        } else {
          activePlayer === player1
            ? (activePlayer = player2)
            : (activePlayer = player1);
        }
      } else {
        winningCombo = winner;
        // WINNER !!!
        console.log(
          `The winner is ${activePlayer.name}, winning combo ${winningCombo}!!`
        );
      }
    }
  };

  return {
    playRound,
    getBoard,
    getActivePlayer,
    getPlayer1,
    getPlayer2,
    getWinningCombo,
    isDraw,
  };
}

// INIT

function init() {
  const dialog = document.querySelector("dialog");
  const submitBtn = document.querySelector("#submit");
  const newGameBtn = document.querySelector("#new-game");
  const rematchBtn = document.querySelector("#rematch");
  const grid = document.querySelector(".grid-container");

  dialog.showModal();

  let game;
  let name1;
  let name2;

  submitBtn.addEventListener("click", () => {
    name1 = document.querySelector('input[name="player1"]').value;
    name2 = document.querySelector('input[name="player2"]').value;
    game = gamePlay(name1, name2);
    createGrid(9);
    screenInfo(game);
    grid.addEventListener("click", shot);
  });

  newGameBtn.addEventListener("click", () => {
    dialog.showModal();
    document.querySelector('input[name="player1"]').value = "";
    document.querySelector('input[name="player2"]').value = "";
  });

  rematchBtn.addEventListener("click", () => {
    const rev1 = game.getPlayer1();
    const rev2 = game.getPlayer2();
    game = gamePlay(rev2.name, rev1.name);
    createGrid(9);
    screenInfo(game);
    grid.addEventListener("click", shot);
  });

  const shot = (event) => {
    try {
      const cell = event.target.closest(".available");
      if (!cell) {
        throw new Error("Cell taken");
      }
      const id = Number(cell.getAttribute("data-id"));
      game.playRound(id);
      cell.classList.remove("available");
      screenInfo(game);
      updateGrid(game);
    } catch (error) {
      console.error("error", error.message);
    }

    const isWinner = game.getWinningCombo();
    const isDraw = game.isDraw();
    const cells = document.querySelectorAll(".cell");
    if (isWinner || isDraw) {
      grid.removeEventListener("click", shot);
      cells.forEach((cell) => {
        cell.classList.remove("available");
      });
    }
  };
}

// UI

function screenInfo(object) {
  const displayMsg = document.querySelector("#display-message");
  const player1 = object.getPlayer1();
  const player2 = object.getPlayer2();
  const activePlayer = object.getActivePlayer();
  const winningCombo = object.getWinningCombo();
  const draw = object.isDraw();

  if (!winningCombo && !draw) {
    displayMsg.classList.remove("bounce");
    activePlayer.marker === "o"
      ? (displayMsg.innerHTML = `<span>${player1.name}</span> vs. ${player2.name}`)
      : (displayMsg.innerHTML = `${player1.name} vs. <span>${player2.name}</span>`);
  } else if (winningCombo) {
    displayMsg.textContent = `${activePlayer.name} wins!`;
    displayMsg.classList.add("bounce");
  } else if (draw) {
    displayMsg.textContent = `draw!`;
    displayMsg.classList.add("bounce");
  }
}

function createGrid(n) {
  const container = document.querySelector(".grid-container");
  container.textContent = "";
  for (let i = 0; i < n; i++) {
    const cell = document.createElement("button");
    cell.setAttribute("data-id", i);
    cell.classList.add("cell");
    cell.classList.add("available");
    container.appendChild(cell);
  }
}

function updateGrid(object) {
  const board = object.getBoard();
  const cells = document.querySelectorAll(".cell");
  const draw = object.isDraw();
  const combo = object.getWinningCombo();

  cells.forEach((cell) => {
    const dataId = Number(cell.getAttribute("data-id"));
    cell.textContent = board[dataId];
    if (draw) {
      cell.classList.add("blink");
    }
    if (combo) {
      [first, second, third] = combo;
      if (dataId === first || dataId === second || dataId === third) {
        cell.classList.add("blink");
      }
    }
  });
}

init();
