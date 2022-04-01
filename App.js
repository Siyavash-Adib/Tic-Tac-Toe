"use strict"

const tickTakToe = (() => {

  const gameTable = document.querySelector('.game-table');
  const gameCell = [...document.querySelectorAll('.game-cell')];

  const gameControl = (() => {
    let gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    let gameBoardEmptySlots = []
    let gameState = 'Player X turn';
    let winningCells = [];
    let winningPlayer = '';
    let playerScore = {
      X: 0,
      O: 0
    };

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        gameBoardEmptySlots.push(j + i * gameBoard[i].length);
      }
    }

    return ({
      restartGame() {
        console.log('Game restarting');

        gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        gameBoardEmptySlots = []
        gameState = 'Player X turn';
        winningCells = [];
        winningPlayer = '';

        for (let i = 0; i < gameBoard.length; i++) {
          for (let j = 0; j < gameBoard[i].length; j++) {
            gameBoardEmptySlots.push(j + i * gameBoard[i].length);
          }
        }

        gameCell.forEach((cell) => {
          // console.log(cell.querySelector('.icon'));
          cell.querySelector('.icon').classList.remove('highlight-red');
          cell.querySelector('.icon').classList.remove('highlight-blue');
          cell.querySelector('.icon').classList.remove('icon-o');
          cell.querySelector('.icon').classList.remove('icon-x');
        });

        gameTable.removeEventListener('click', gameControl.restartGame);
      },

      getBoard() {
        return JSON.parse(JSON.stringify(gameBoard));
      },

      printBoard() {
        console.table(gameBoard);
      },

      playTurn(blockRow, blockColumn, newPlay) {
        if (newPlay.match(/^[xo]$/i)) {
          if (gameBoard[blockRow][blockColumn] === ' ') {
            gameBoard[blockRow][blockColumn] = newPlay.toUpperCase();
            // this.printBoard();

            gameBoardEmptySlots.splice(
              gameBoardEmptySlots.indexOf(
                blockRow * gameBoard[blockRow].length + blockColumn
              ), 1);
            // console.log(`gameBoardEmptySlots = ${gameBoardEmptySlots}`);

            switch (gameState) {
              case 'Player X turn':

                window.setTimeout(gameControl.computerPlayTurn, 300);
                gameState = 'Player O turn';
                break;

              case 'Player O turn':

                gameState = 'Player X turn';
                break;

              case 'Game Ended':

                break;

              default:
                console.log('What the hell is this state !?!?!?!?!?');
                break;
            }

            this.updateGameStatus(blockRow, blockColumn, newPlay);

          } else {
            console.log('Sorry this cell is full');
          }
        } else {
          console.log('Unknown Play');
        }

      },

      computerPlayTurn() {
        if (gameState !== 'Player O turn') {
          return;
        }

        let computerChoice = gameBoardEmptySlots[
          Math.floor(Math.random() * gameBoardEmptySlots.length)
        ];
        // console.log(`computerChoice = ${computerChoice}`);

        gameControl.playTurn(
          parseInt(computerChoice / 3),
          computerChoice % 3,
          'O'
        )
      },

      checkRowWinCondition(rowNum) {
        if (gameBoard[rowNum][0] === ' ') {
          return '';
        }

        let result = gameBoard[rowNum].every((element) =>
          element === gameBoard[rowNum][0]
        );

        return result ? gameBoard[rowNum][0] : '';
      },

      checkColumnWinCondition(columnNum) {
        if (gameBoard[0][columnNum] === ' ') {
          return '';
        }

        let result = gameBoard.every((row) =>
          row[columnNum] === gameBoard[0][columnNum]
        );

        return result ? gameBoard[0][columnNum] : '';
      },

      checkDiagonalWinCondition(diagonal) {
        if (diagonal === 0) {
          // if Top-Left corner is empty
          if (gameBoard[0][0] === ' ') {
            return '';
          }

          let result = gameBoard.every((row, index) =>
            row[index] === gameBoard[0][0]
          );

          return result ? gameBoard[0][0] : '';
        } else {
          // if Top-Right corner is empty
          if (gameBoard[0][gameBoard[0].length - 1] === ' ') {
            return '';
          }

          let result = gameBoard.every((row, index) =>
            row[gameBoard[0].length - 1 - index] ===
            gameBoard[0][gameBoard[0].length - 1]
          );

          return result ? gameBoard[0][gameBoard[0].length - 1] : '';
        }
      },

      updateGameStatus(updatedCellRow, updatedCellColumn, newPlay) {
        let targetCell = gameCell[updatedCellRow * 3 + updatedCellColumn];
        // console.log(targetCell.querySelector('.icon'));

        targetCell.querySelector('.icon').classList.add(
          newPlay.match(/^[x]$/i) ? 'icon-x' : 'icon-o'
        );

        for (let i = 0; i < gameBoard.length; i++) {
          let checkWinner = gameControl.checkRowWinCondition(i)
          if (checkWinner) {
            winningPlayer = checkWinner;
            console.log(`Win : Row[${i}]`);

            for (let j = 0; j < gameBoard[0].length; j++) {
              winningCells.push(
                gameCell[j + i * gameBoard[0].length]
              );
            };
            // console.log(winningCells);
          }
        }

        for (let i = 0; i < gameBoard[0].length; i++) {
          let checkWinner = gameControl.checkColumnWinCondition(i)
          if (checkWinner) {
            winningPlayer = checkWinner;
            console.log(`Win : Column[${i}]`);

            for (let j = 0; j < gameBoard.length; j++) {
              winningCells.push(
                gameCell[i + j * gameBoard[0].length]
              );
            };
            // console.log(winningCells);
          }
        }

        for (let i = 0; i < 2; i++) {
          let checkWinner = gameControl.checkDiagonalWinCondition(i)
          if (checkWinner) {
            winningPlayer = checkWinner;
            console.log(`Win : Diagonal[${i}]`);

            if (i === 0) {
              gameBoard.forEach((_, index) =>
                winningCells.push(gameCell[index * (gameBoard.length + 1)])
              );
            } else {
              gameBoard.forEach((_, index) =>
                winningCells.push(gameCell[
                  index * gameBoard.length
                  + gameBoard[0].length - 1 - index])
              );
            }
            // console.log(winningCells);
          }
        }

        if (winningPlayer) {
          gameState = 'Game Ended';

          if (winningPlayer === 'X') {
            winningCells.forEach((cell) => {
              cell.querySelector('.icon').classList.add('highlight-red');
            })

            playerScore.X += 1;
          } else {
            winningCells.forEach((cell) => {
              cell.querySelector('.icon').classList.add('highlight-blue');
            })

            playerScore.O += 1;
          }

          console.log(playerScore);

          window.setTimeout(() => {
            gameTable.addEventListener('click', gameControl.restartGame);
          }, 500);
        } else if (gameBoardEmptySlots.length === 0) {
          gameState = 'Game Ended';

          window.setTimeout(() => {
            gameTable.addEventListener('click', gameControl.restartGame);
          }, 500);
        }
      },

      handleUserInput(event) {
        // console.log(event);
        if (gameState === 'Player X turn') {
          let cellIndex = gameCell.indexOf(this);
          gameControl.playTurn(
            parseInt(cellIndex / 3),
            cellIndex % 3,
            'X'
          );
        }
      }
    });
  })();


  gameCell.forEach((cell) => cell.addEventListener('click', gameControl.handleUserInput));

  return {
  };

})();
