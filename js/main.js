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
        
        let marked = false;
        const isMarked = () => marked;
        const mark = (newSymbol) => {
            marked = true;
            symbol = newSymbol;
        };

        return { isMarked, mark, getSymbol };
    }

    const getIndexOfPosition = (position) => positions.indexOf(position);
    const getPositionByIndex = (index) => positions[index];

    return { getPositionByIndex, getIndexOfPosition };
})();

//GAME

const game = ((gameboard) => {
    function mark(index, symbol){
        const position = gameboard.getPositionByIndex(index);
        position.mark(symbol);

        connectsRow = getConnection(symbol);
        if (connectsRow){
            gameOver();
        }
    }

    function gameOver(){
        console.log('game over');
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
                
                console.log(pos.getSymbol())
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
})(gameboard);

//PLAYERS 
function playerFactory(name){
    let score = 0;
    return { name, score }
}

const player1 = playerFactory('Cesar');
const player2 = playerFactory('Abraham');