console.log('test')

const gameboard = (() => {
    const positions = [];

    for (let i = 0; i < 9; i++) {
        const position = positionFactory();
        positions.push(position);
    }
    
    console.log(positions);

    function positionFactory(){
        marked = false;

        
        
        return { marked };
    }
})()

function playerFactory(name){
    let score = 0;
    return { name, score }
}

const player1 = playerFactory('Cesar');
const player2 = playerFactory('Abraham');

console.log(player1, player2)