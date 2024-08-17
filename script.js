gameBoard = [];

const Player = function(name, weapon) {
    let score = 0;

    const resetScore = () => score = 0;
    const setScore = () => score++;
    const getScore = () => score;

    const getWeapon = () => weapon;

    return { name, resetScore, setScore, getScore, getWeapon };
}

function GameState() {
    /*
    Create Board
    Update Board With Player Choice
    Return Board State
    Log Board State (For Console Debugging Purpose)
    Reset Board State
    */

    //tic-tac-toe has a 3x3 game-board
    let board = [];

    const setBoard = () => {
        for (let i = 0; i < 3; i++) {
            board.push([]);
            for (let j = 0; j < 3; j++) {
                board[i].push(Cell());
            }
        }
    }

    const getBoard = () => board;

    const resetBoard = () => {
        board = [];
        setBoard();
    }

    const updateBoard = (rw, clm, player) => {
        // Check Valid Move?
        // Use Choice From Player To Update Cell
        if (board[rw][clm].getValue()) return false;
        board[rw][clm].setValue(player);
        return true;
    }

    const logBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, setBoard, resetBoard, updateBoard, logBoard };
}

const Cell = function() {
    let value = '';

    const setValue = (player) => {
        value = player.getWeapon();
    }
    const getValue = () => value;

    const resetValue = () => value = '';

    return { setValue, getValue, resetValue };
}

function GameController(userOneName, userOneWeapon, userTwoName, userTwoWeapon) {
    /*
    //Prompt For Name, Weapon Selection
    //Setup Users
    //Initialize The Board Process
    //Setup Active Player
    //Setup Player Turns
    //Display Board Before Turn
    //Play Rounds
    //Check For Winner After Every Round
    //If No Winner Display Board Again
    */
    let players = [];

    const playerOneName = `${userOneName.value || 'Player One'}`;
    const playerOneWeapon = `${userOneWeapon.value || 'X'}`;
    players.push(Player(playerOneName, playerOneWeapon));

    const playerTwoName = `${userTwoName.value || 'Player Two'}`;
    const playerTwoWeapon = `${userTwoWeapon.value || 'O'}`;
    players.push(Player(playerTwoName, playerTwoWeapon));

    const gameBoard = GameState();
    gameBoard.setBoard();

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const setActivePlayer = () => activePlayer = players[0];

    const displayBoard = () => {
        gameBoard.logBoard();
    }

    const playRound = (row, col, game) => {
        //const row = +(prompt("Enter Row: "));
        //const column = +(prompt("Enter Column"));
        let isBoardUpdated = gameBoard.updateBoard(row, col, game.getActivePlayer());
        
        if (checkColumnWinner() || checkRowWinner()) {
            game.getActivePlayer().setScore();
            console.log('You Won!');
        }

        if (isBoardUpdated) {
            switchPlayerTurn();
            displayBoard();
        }
    }

    const checkRowWinner = function() {
        const currentRoundBoard = gameBoard.getBoard();
        for (let rw = 0; rw < currentRoundBoard.length; rw++) {

            let currentRowParent = currentRoundBoard[rw][0].getValue();
            if (currentRowParent) {
                const threeStrikes = currentRoundBoard[rw].every((cell) => {
                    return cell.getValue() === currentRowParent;
                });

                if (threeStrikes) return true
            }
        }
        return false
    }

    const checkColumnWinner = function() {
        const currentRoundBoard = gameBoard.getBoard();
        for (let col = 0; col < currentRoundBoard[0].length; col++) {

            const currentColumnParent = currentRoundBoard[0][col].getValue();
            if (currentColumnParent !== '') {
                const threeStrikes = currentRoundBoard.every((row) => {
                    return row[col].getValue() === currentColumnParent;
                });
                
                if (threeStrikes) return true;
            }
        }
        return false;
    }
    
    const resetGame = function() {
        setActivePlayer();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameBoard.getBoard()[i][j].resetValue();
            }
        }
        game.players[0].resetScore();
        game.players[0].resetScore();
    }

    return { players, getActivePlayer, playRound, getBoard: gameBoard.getBoard, resetGame }
}

const screenController = function() {
    const startBtn = document.getElementById('start-game');
    const playerOneInput = document.getElementById('player1-name');
    const playerTwoInput = document.getElementById('player2-name');
    const playerOneWeapon = document.getElementById('player1-weapon');
    const playerTwoWeapon = document.getElementById('player2-weapon');


    const closeForm = function() {
        const gameStartForm = document.getElementById('player-setup');
        gameStartForm.style.display = 'none';
    }

    const initializeBoard = function() {
        const container = document.getElementById('game-board');
        container.style.display = 'grid';
        const activeBox = document.createElement('div');
        const buttonsBox = document.createElement('div');
        const gridBox = document.createElement('div');
        const playerScreen = document.createElement('div');

        for (let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const gridCell = document.createElement('button');
                gridCell.classList.add('grid-cell');
                gridCell.setAttribute('grid-row', `${i}`);
                gridCell.setAttribute('grid-col', `${j}`);
                gridBox.append(gridCell);
            }
        }

        //create and attach elements to buttonsBox
        const retryBtn = document.createElement('button');
        buttonsBox.append(retryBtn);

        //create and attach player score boxes to playerScreen
        const playerOne = document.createElement('div');
        const playerTwo = document.createElement('div');
        playerScreen.append(playerOne, playerTwo);
        
        //attach elements to grid
        container.append(activeBox, buttonsBox, gridBox, playerScreen);

        //setup classes
        container.id = 'game-board';
        gridBox.id = 'grid-box';
        activeBox.id = 'active-box';
        buttonsBox.id = 'buttons-box';
        playerScreen.id = 'player-screen';
        retryBtn.id = 'retry-btn';
        playerOne.id = 'player1-screen';
        playerTwo.id = 'player2-screen';

        return {container, activeBox, gridBox, retryBtn, playerOne, playerTwo};
    }

    const initializeText = function(game, activeBox, playerOne, playerOneBox, playerTwo, playerTwoBox, retryBtn) {
        activeBox.textContent = `It's ${game.getActivePlayer().name}'s Turn Now!`
        retryBtn.textContent = 'Retry!'
        playerOneBox.textContent = `P1: ${playerOne.getScore()}`;
        playerTwoBox.textContent = `P2: ${playerTwo.getScore()}`;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const displayCell = document.querySelector(`[grid-row="${i}"][grid-col="${j}"]`);
                displayCell.textContent = `${game.getBoard()[i][j].getValue()}`;
            }
        }
    }

    function playCell(e, game, boardUi) {
        if (e.target.tagName === 'BUTTON') {
            const cellRow = e.target.getAttribute('grid-row');
            const cellCol = e.target.getAttribute('grid-col');
            
            game.playRound(cellRow, cellCol, game);
            textUpdate = initializeText(game, boardUi.activeBox, game.players[0], boardUi.playerOne, game.players[1], boardUi.playerTwo, boardUi.retryBtn)
        }
    }

    function resetGameScreen(game, boardUi) {
        game.resetGame();
        textUpdate = initializeText(game, boardUi.activeBox, game.players[0], boardUi.playerOne, game.players[1], boardUi.playerTwo, boardUi.retryBtn)
    }

    startBtn.addEventListener('click', () => {
        closeForm();
        game = GameController(playerOneInput, playerOneWeapon, playerTwoInput, playerTwoWeapon);
        boardUi = initializeBoard();
        textUi = initializeText(game, boardUi.activeBox, game.players[0], boardUi.playerOne, game.players[1], boardUi.playerTwo, boardUi.retryBtn);

        const gridEvent = boardUi.gridBox;
        gridEvent.addEventListener('click', (e) => {
            playCell(e, game, boardUi)
        });

        boardUi.retryBtn.addEventListener('click', () => {
            resetGameScreen(game, boardUi);
        })
    });
}

playBoard = screenController();
