//GAMEBOARD
const gameboard = (() => {
    const board = [];

    for (let i = 0; i < 9; i++) {
        const position = positionFactory();
        board.push(position);
    }

    function positionFactory(){
        let symbol = "";
        const getSymbol = () => symbol;
        
        let owner;
        const getOwner = () => owner;

        let marked = false;
        const isMarked = () => marked;
        const mark = (player) => {
            marked = true;
            owner = player;
            symbol = owner.getSymbol();
        };

        const clear = () => {
            marked = false;
            owner = null;
            symbol = null;
        }

        return { isMarked, mark, getSymbol, getOwner, clear };
    }

    const getBoard = () => board;

    const getIndexOfPosition = (position) => board.indexOf(position);
    const getPositionByIndex = (index) => board[index];
    const checkTie = () => {
        let allPositionsMarked = true;
        for (let i = 0; i < board.length; i++) {
            const pos = board[i];
            
            if (!pos.isMarked()){
                allPositionsMarked = false;
                break;
            }
        }
        return allPositionsMarked;
    };

    const reset = () => {
        board.forEach((pos) => pos.clear());
    }

    return { getBoard, getPositionByIndex, getIndexOfPosition, checkTie, reset };
})();

//GAME

const game = ((gameboard) => {
    let result = null;
    
    let gameOver = false;
    const getGameResult = () => {
        return {
            result: result,
        };
    }

    const players = [
        playerFactory('Cesar', 'X'),
        playerFactory('Abraham', 'O'),
    ];
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (position) => {
        if (gameOver){
            return;
        };

        let canPlaceMark = markPosition(position, getActivePlayer());
        
        if (canPlaceMark){
            switchActivePlayer();
        }
    }

    const resetGame = () => {
        gameboard.reset();
        players.forEach((player) => player.clearScore());
    }

    function markPosition(index, player){
        const position = gameboard.getPositionByIndex(index);
        let canPlaceMark = true;

        if (position.isMarked()){
            console.log('Can\'t place a mark on a marked position.')
            return false;
        }

        position.mark(player);
        connectsRow = getConnection(player.getSymbol());
        isATie = gameboard.checkTie();

        if (connectsRow){
            gameOver = true;
            resultMessage = `${position.getOwner()} wins`;
            console.log(`${position.getOwner()} wins`);
        }
        else if(isATie){
            gameOver = true;
            resultMessage = "It\'s a tie!";
            console.log('It\'s a tie');
        }

        return canPlaceMark;
    }

    function getConnection(symbol){
        let connects;

        const horizontalConnections = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
        connects = testConnections(horizontalConnections, symbol);

        if (connects){
            return connects;
        }

        const verticalConnections = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
        ];
        connects = testConnections(verticalConnections, symbol);

        if (connects){
            return connects;
        }

        const diagonalConnections = [
            [0, 4, 8],
            [2, 4, 6],
        ];
        connects = testConnections(diagonalConnections, symbol);

        return connects;
    }

    function testConnections(connectionsArr, symbol) {
        let connects;

        for (let i = 0; i < connectionsArr.length; i++) {
            const positions = connectionsArr[i];

            connects = true;
            for (let j = 0; j < positions.length; j++) {
                const pos = gameboard.getPositionByIndex(positions[j]);
                
                if (!pos.isMarked() || pos.getSymbol() != symbol){
                    connects = false;
                }
            }

            if (connects){
                console.log(
                    "connected on " + positions
                );
                break;
            }
        }

        return connects;
    }
    //PLAYERS

    function playerFactory(name, symbol){
        let score = 0;
        const sumScore = (amount) => {
            score += amount;
        };
    
        const getScore = () => score;
        const getSymbol = () => symbol;
        const clearScore = () => score = 0;
    
        return { name, sumScore, getScore, getSymbol, clearScore };
    }

    return { playRound, getActivePlayer, resetGame, getBoard:gameboard.getBoard };
})(gameboard);

const screenController = ((game) => {
    const board = game.getBoard();
    const positions = document.querySelectorAll('.position');
    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        position.addEventListener('click', () => {
            game.playRound(i);
            updateBoard();
        });
    }

    function updateBoard(){
        for (let i = 0; i < board.length; i++) {
            const boardPosition = board[i];
            const owner = boardPosition.getOwner();

            if (owner){
                let symbol = owner.getSymbol()
                positions[i].setAttribute('data-symbol', symbol);
            }
        }
    }


})(game);
