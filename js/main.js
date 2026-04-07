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
    let message;

    let gameOver = false;
    const eventTarget = new EventTarget();
    const gameSetEvent = new Event('gameSet');
    const gameOverEvent = new Event('gameOver');
    const switchPlayerEvent = new Event('switchPlayer');
    
    const getEventTarget = () => eventTarget;
    
    const players = [];
    let activePlayer;
    const getPlayers = () => players;
    const setPlayers = (names) => {
        players.push(playerFactory(names[0], 'X', 'player-one'));
        players.push(playerFactory(names[1], 'O', 'player-two'));
        activePlayer = players[0];

        //Initial message
        message = `It's ${activePlayer.name}\'s turn`;
        eventTarget.dispatchEvent(gameSetEvent);
    }

    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        message = `It's ${activePlayer.name}\'s turn`;
        eventTarget.dispatchEvent(switchPlayerEvent);
    };

    const getMessage = () => message;

    const playRound = (position) => {
        if (gameOver){
            return;
        };

        let success = markPosition(position, getActivePlayer());
        
        if (success && !gameOver){
            switchActivePlayer();
        }
    }

    const resetGame = () => {
        gameOver = false;
        gameboard.reset();

        switchActivePlayer();
    }

    function markPosition(index, player){
        const position = gameboard.getPositionByIndex(index);
        let success = true;

        if (position.isMarked()){
            success = false;
            return success;
        }

        position.mark(player);
        const connectsRow = getConnection(player.getSymbol());
        const isATie = gameboard.checkTie();

        if (connectsRow || isATie){
            gameOver = true;

            if (connectsRow){
                const owner = position.getOwner();
                message = `${owner.name} wins`;
                owner.sumScore(1);
            }
            else if(isATie){
                message = "It\'s a tie!";
            }

            eventTarget.dispatchEvent(gameOverEvent);
        }

        return success;
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
                break;
            }
        }

        return connects;
    }
    //PLAYERS

    function playerFactory(name, symbol, alias){
        let score = 0;
        const sumScore = (amount) => {
            score += amount;
        };
    
        const getScore = () => score;
        const getSymbol = () => symbol;
        const clearScore = () => score = 0;
        const getAlias = () => alias;

        return { name, sumScore, getScore, getSymbol, getAlias, clearScore };
    }

    return { playRound, getActivePlayer, resetGame, getMessage, getBoard:gameboard.getBoard, getEventTarget, getPlayers, setPlayers };
})(gameboard);

const screenController = ((game) => {
    const form = document.getElementById('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Array.from(formData.entries());

        for (const [key, value] of data) {
            const playerName = document.querySelector(`.${key}`);
            playerName.textContent = value;
        }

        const names = Array.from(formData.values());
        game.setPlayers(names);
    });

    const board = game.getBoard();
    const positions = document.querySelectorAll('.position');
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', () => {
        game.resetGame();

        displayMessage();
        updateUI();
    });

    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        position.addEventListener('click', () => {
            game.playRound(i);
            updateUI();
        });
    }

    function updateUI(){
        for (let i = 0; i < board.length; i++) {
            const boardPosition = board[i];
            const owner = boardPosition.getOwner();

            if (owner){
                let symbol = owner.getSymbol()
                positions[i].setAttribute('data-symbol', symbol);
            }else{
                positions[i].setAttribute('data-symbol', '');
            }
        }

        const players = game.getPlayers();
        players.forEach((player) => {
            const scoreTxt = document.querySelector(`.${player.getAlias()}-score`);
            scoreTxt.textContent = player.getScore().toString();
        })
    }

    game.getEventTarget().addEventListener('gameSet', setInitialUI);
    game.getEventTarget().addEventListener('gameOver', displayMessage);
    game.getEventTarget().addEventListener('switchPlayer', displayMessage);

    function displayMessage(){
        const message = game.getMessage();

        const resultsContainer = document.querySelector('.message-container');
        resultsContainer.textContent = message;
    }

    function setInitialUI(){
        form.reset();
        const playersInputContainer = document.querySelector('.players-input-container');
        playersInputContainer.style.setProperty('display', 'none');
        const gameContainer = document.querySelector('.game-container');
        gameContainer.style.setProperty('display', 'grid');
        displayMessage();
        updateUI();
    }

})(game);
