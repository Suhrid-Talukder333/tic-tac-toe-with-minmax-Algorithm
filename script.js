const STARTGAMEBOX = document.querySelector('.start_game');
var orginalBoard;
var player;
var ai;
var check = false;
const WINCOMBO = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
];
const CELLS = document.querySelectorAll('.cell');

function startGame() {
    orginalBoard = Array.from(Array(9).keys());
    for(let i=0; i<CELLS.length; i++) {
        CELLS[i].innerHTML = "";
        CELLS[i].style.removeProperty('background-color');
        CELLS[i].addEventListener('click',turnClick,false);
    }
    // if(player == 'X') {
    //     turn(emptySquares()[0],ai);
    // }
}

function declareWinner(string) {
    console.log(string);
    document.querySelector('.endgame').style.display = 'block';
    document.getElementById('result').innerText = string;
}

function turnClick(obj) {
    if(typeof orginalBoard[obj.target.id]== 'number'){
        
        turn(obj.target.id,player);
        if(check) {
            return;
        }
        if(!checkTie()) {
            
            turn(bestSpot(),ai);
            checkTie();
        }
    }
}

function minmax(board,clicker) {
    var availSpots = emptySquares(board);
    if(checkwin(orginalBoard,player)) {
        return {score: -10};
    }else if(checkwin(orginalBoard,ai)) {
        return {score: 10};
    }else if(availSpots.length == 0) {
        return {score: 0};
    }

    var moves = [];
    for(let i=0; i<availSpots.length; i++) {
        var move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = clicker;

        if(clicker == ai) {
            var result = minmax(board,player);
            move.score = result.score;
        }else {
            var result = minmax(board,ai);
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player == ai) {
        var bestScore = -10000;
        for(let i=0; i<moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else {
        var bestScore = 10000;
        for(let i=0; i<moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function emptySquares() {
    return orginalBoard.filter(elem => typeof elem == 'number');
}

function bestSpot() {
    return minmax(orginalBoard,ai).index;
}

function checkTie() {
    
    if(emptySquares().length == 0) {
        for(let i=0; i<CELLS.length; i++) {
            CELLS[i].style.backgroundColor = 'yellow';
            CELLS[i].removeEventListener('click',turnClick,false);
        }
        declareWinner("Tie Game");
        return true;
    }
    
    return false;
}

function turn(objId,clicker) {
    
    orginalBoard[objId] = clicker;
    document.getElementById(objId).innerText = clicker;
    let gameWon = checkwin(orginalBoard,clicker);
    if(gameWon) {
        gameOver(gameWon);
        check = true;
    }
}

function checkwin(board,clicker) {
    let plays = board.reduce((a,e,i) => (e === clicker) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index,win] of WINCOMBO.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index:index,clicker:clicker};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for(let index of WINCOMBO[gameWon.index]) {
        
        document.getElementById(index).style.backgroundColor = gameWon.clicker == player ? 'green' : 'red';
    }
    for(let i=0; i<CELLS.length; i++) {
        CELLS[i].removeEventListener('click',turnClick,false);
    }
    
    declareWinner(gameWon.clicker == player ? "You Win!" : "You Lose!");
}

function choose(obj) {
    if(obj == 'x') {
        player = "X";
        ai = "O"
    }else {
        player = "O";
        ai = "X";
    }
    STARTGAMEBOX.style.display = 'none';
    startGame();
}

function start() {
    document.querySelector('.endgame').style.display = 'none';
    document.querySelector('.start_game').style.display = 'block';
    check = false;
    document.querySelector('.start_game').style.display = 'block';
}