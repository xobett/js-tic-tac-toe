//GAMEBOARD
const gameboard = (() => {
    const positions = [];

    for (let i = 0; i < 9; i++) {
        const position = positionFactory();
        positions.push(position);
    }

    function positionFactory(){
        let symbol = "X";
        const getSymbol = () => symbol;
        
        let marked = false;
        const isMarked = () => marked;
        const mark = () => {
            marked = true;
        };

        return { isMarked, mark, getSymbol };
    }

    function getPositionByIndex(index){
        return positions[index];
    }

    return { getPositionByIndex };
})();

const game = ((gameboard) => {
    //PLAYERS 
    function playerFactory(name){
        let score = 0;
        return { name, score }
    }
    
    const player1 = playerFactory('Cesar');
    const player2 = playerFactory('Abraham');

    function checkForConnection(index){
        const position = gameboard.getPositionByIndex(index);
        position.mark();

        const radiusChecks = [
            index - 1,
            index + 1,
            index - 3,
            index + 3,
        ];
    }
})(gameboard);