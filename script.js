// script.js
document.addEventListener('DOMContentLoaded', function () {
  const boardSize = 25;
  const numMines = 50;

  const board = document.getElementById('board');
  const gameStatus = document.getElementById('game-status');
  const restartButton = document.getElementById('restart-button');
  let gameActive = true;

  // Initialize the board
  function initializeBoard() {
      gameStatus.textContent = 'Game in progress';

      for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
              const cell = document.createElement('div');
              cell.classList.add('cell');
              cell.dataset.row = i;
              cell.dataset.col = j;
              cell.addEventListener('click', revealCell);
              cell.addEventListener('contextmenu', toggleFlag);
              board.appendChild(cell);
          }
      }

      // Add mines randomly
      for (let i = 0; i < numMines; i++) {
          let randomRow, randomCol;
          do {
              randomRow = Math.floor(Math.random() * boardSize);
              randomCol = Math.floor(Math.random() * boardSize);
          } while (board.querySelector(`[data-row="${randomRow}"][data-col="${randomCol}"].mine`));

          const mineCell = board.querySelector(`[data-row="${randomRow}"][data-col="${randomCol}"]`);
          mineCell.classList.add('mine');
      }
  }

  function restartGame() {
      // Clear the board
      board.innerHTML = '';

      // Reinitialize the board
      initializeBoard();

      // Reset game state
      gameActive = true;
  }

  function revealCell(event) {
      if (!gameActive) return;

      const cell = event.target;
      if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
          return;
      }

      if (cell.classList.contains('mine')) {
          // Game over: reveal all mines
          revealMines();
          cell.classList.add('clicked-mine');
          gameStatus.textContent = 'Game Over';
          gameActive = false;
      } else {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          const mineCount = countAdjacentMines(row, col);
          cell.classList.add('revealed');
          if (mineCount > 0) {
              cell.textContent = mineCount;
          } else {
              // If there are no adjacent mines, recursively reveal neighbors
              revealNeighbors(row, col);
          }
      }
  }

  function toggleFlag(event) {
      event.preventDefault();
      const cell = event.target;
      if (!cell.classList.contains('revealed')) {
          cell.classList.toggle('flagged');
      }
  }

  function countAdjacentMines(row, col) {
      let mineCount = 0;
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                  const neighborCell = board.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                  if (neighborCell.classList.contains('mine')) {
                      mineCount++;
                  }
              }
          }
      }
      return mineCount;
  }

  function revealNeighbors(row, col) {
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                  const neighborCell = board.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                  if (!neighborCell.classList.contains('revealed')) {
                      neighborCell.classList.add('revealed');
                      const mineCount = countAdjacentMines(newRow, newCol);
                      if (mineCount > 0) {
                          neighborCell.textContent = mineCount;
                      } else {
                          revealNeighbors(newRow, newCol);
                      }
                  }
              }
          }
      }
  }

  function revealMines() {
      const mineCells = board.querySelectorAll('.mine');
      mineCells.forEach(cell => cell.classList.add('revealed'));
  }

  // Initialize the board when the page is loaded
  initializeBoard();

  // Add event listener for the restart button
  restartButton.addEventListener('click', restartGame);
});
