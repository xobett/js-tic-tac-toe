//GAMEBOARD
const gameboard = (() => {
    const positions = [];

    for (let i = 0; i < 9; i++) {
        const position = positionFactory();
        positions.push(position);
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

    const getIndexOfPosition = (position) => positions.indexOf(position);
    const getPositionByIndex = (index) => positions[index];
    const checkTie = () => {
        let allPositionsMarked = true;
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            
            if (!pos.isMarked()){
                allPositionsMarked = false;
                break;
            }
        }
        return allPositionsMarked;
    };

    const reset = () => {
        positions.forEach((pos) => pos.clear());
    }

    return { getPositionByIndex, getIndexOfPosition, checkTie, reset };
})();

//GAME

const game = ((gameboard) => {
    let gameOver = false;

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
        if (gameOver) return;

        markPosition(position, getActivePlayer());
        switchActivePlayer();
    }

    const resetGame = () => {
        gameboard.reset();
        players.forEach((player) => player.clearScore());
    }

    function markPosition(index, player){
        const position = gameboard.getPositionByIndex(index);
        if (position.isMarked()){
            console.log('Can\'t place a mark on a marked position.')
            return;
        }

        position.mark(player);

        connectsRow = getConnection(player.getSymbol());
        isATie = gameboard.checkTie();

        if (connectsRow){

        }
        else if(isATie){
            console.log('It\'s a tie');
        }
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

    return { playRound, getActivePlayer, resetGame };
})(gameboard);

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
