gameBoard = [];

function Player(name, weapon) {
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
        console.log('running update');
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

    return { setValue, getValue };
}

function GameController() {
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
    let weapons = ['O', 'X', '!', '*'];
    let players = [];
    
    for (let i = 0; i < 2; i++) {
        const playerName = prompt("Enter Username: ", `Player ${i + 1}`);
        const playerWeapon = prompt("Choose Weapon: ");

        players.push(Player(playerName, playerWeapon));
    }

    const gameBoard = GameState();
    gameBoard.setBoard();

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const displayBoard = () => {
        gameBoard.logBoard();
        console.log(`${getActivePlayer().name}'s Turn!`)
    }

    const playRound = () => {
        const row = +(prompt("Enter Row: "));
        const column = +(prompt("Enter Column"));

        const isBoardUpdated = gameBoard.updateBoard(row, column, activePlayer);
        
        if (checkColumnWinner()) {
            console.log('You Won!');
        }
        else {
            console.log('No win yet');
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
                    console.log(`current cell is ${row[col].getValue()}`);
                    return row[col].getValue() === currentColumnParent;
                });
                
                if (threeStrikes) return true;
            }
        }
        return false;
    }

    const endGame = function() {
        
    }
    
    const resetGame = function() {

    }

    playRound();

    return { playRound, displayBoard, getBoard: gameBoard.getBoard,resetGame }
}



game = GameController();
