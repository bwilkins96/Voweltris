// variable initiation

let board, score, letter1, letter2;
let current = 1;

// game logic

const getBoard = size => {
    const vowels = "aeiouy";
    const board = [];

    for (let i = 0; i < size; i++) {
        let row = [];

        for (let j = 0; j < size; j++) {
            let randIdx = Math.floor(Math.random() * 6);
            row.push(vowels[randIdx]);
        }

        board.push(row);
    }

    return board;
}

const buildBoard = board => {
    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = "";
    
    updateScore();

    for (let i = 0; i < board.length; i++) {
        let htmlRow = document.createElement('div');

        for (let j = 0; j < board.length; j++) {
            let piece = document.createElement('p');
            piece.innerText = board[i][j];
            piece.setAttribute('id', `${i},${j}`);
            
            if (board[i][j] === '-') {
                piece.classList.add('empty');
            } else {
                piece.classList.add(`${board[i][j]}`);
            }

            piece.addEventListener('click', handleClick);
            
            htmlRow.append(piece);
        }

        htmlBoard.append(htmlRow);
    }
}

const getId = (l1, l2) => {
    let id1 = l1.id;
    let id2 = l2.id;

    let [i, j] = id1.split(',');
    let [i2, j2] = id2.split(',');

    return [Number(i), Number(j), Number(i2), Number(j2)];
}

const isAdjacent = () => {
    if (letter1 === letter2) { return false }
    let [i, j, i2, j2] = getId(letter1, letter2);

    if (i !== i2) {
        if (board[i][j] === '-' || board[i2][j2] === '-') {
            return false;
        }
    }

    let cases = [
        i === i2+1 && j === j2,
        i === i2-1 && j === j2, 
        j === j2+1 && i === i2, 
        j === j2-1 && i === i2
    ]

    for (let i = 0; i < cases.length; i++) {
        if (cases[i]) {
            return true;
        }
    }

    return false;
}

const clearHorizontal = () => {
    let cleared = false;
    
    for (let i = 0; i < board.length; i++) {
        let count = 1;

        for (let j = 0; j < board.length-1; j++) {
            if ((board[i][j] == board[i][j+1]) && (j+1 !== board.length-1)) {
                count++;
            } else {
                if ((j+1 === board.length-1) && (board[i][j] == board[i][j+1])) { 
                    count++; 
                    j++;
                }

                if (count >= 3 && board[i][j] !== '-') {
                    for (let n = j; n > j - count; n--) {
                        board[i][n] = "-";
                        score += (count*100);
                    }

                    cleared = true;
                } 

                count = 1;
            }
        }
    }

    return cleared;
}

const clearVerticle = () => {
    let cleared = false;
    
    for (let i = 0; i < board.length; i++) {
        let count = 1;

        for (let j = 0; j < board.length-1; j++) {
            if ((board[j][i] == board[j+1][i]) && (j+1 !== board.length-1)) {
                count++;
            } else {
                if ((j+1 === board.length-1) && (board[j][i] == board[j+1][i])) { 
                    count++;
                    j++; 
                }

                if (count >= 3 && board[j][i] !== '-') {
                    for (let n = j; n > j - count; n--) {
                        board[n][i] = "-";
                        score += (count*100);
                    }

                    cleared = true;
                } 

                count = 1;
            }
        }
    }

    return cleared;
}

const clearBoard = () => {
    let h = clearHorizontal();
    let v = clearVerticle();

    return (h || v);
}

const incrementDown = () => {
    let incremented = false;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length-1; j++) {
            if (board[j+1][i] === '-' && board[j][i] !== '-') {
                for (let n = j; n >= 0; n--) {
                    board[n+1][i] = board[n][i];
                }

                board[0][i] = '-';
                incremented = true;
                break;
            }

        }

    }

    return incremented;
}

const shiftDown = (incremented, timeout) => {
    if (incremented) {
        incremented = incrementDown();
        clearBoard();
        buildBoard(board);

        setTimeout(() => {
            shiftDown(incremented, timeout);
        }, timeout);
    } else {
        uncoverScreen();
        saveGame();
    }
}


const handleClick = event => {
    let letter = event.target;

    if (current === 1) {
        letter1 = letter;
        letter.classList.add('active');
        current++;
    } else if (current === 2) {
        letter2 = letter;

        if (isAdjacent()) {
            current++;
        } else {
            letter1.classList.remove('active');
            letter1 = letter;
            letter1.classList.add('active');
        }
    }

    if (current >= 3) {
        handleMove();
        current = 1;
    }
}

const handleMove = () => {
    let [i, j, i2, j2] = getId(letter1, letter2);

    let temp = board[i][j];
    board[i][j] = board[i2][j2];
    board[i2][j2] = temp;

    let cleared = clearBoard();
    buildBoard(board);

    
    if (cleared || letter1.innerText === '-' || letter2.innerText === '-') {
        coverScreen();

        setTimeout(() => {
            shiftDown(true, 250);
        }, 500);
    }
}

const coverScreen = () => {
    let cover = document.createElement('div');
    cover.setAttribute('id', 'cover');
    document.body.append(cover);
}

const uncoverScreen = () => {
    let cover = document.getElementById('cover');
    cover.remove();
}

const updateScore = () => {
    let scoreElement = document.getElementById('score');
    let previousScore = Number(localStorage.getItem('score'));

    if (score > 0) {
        scoreElement.innerText = `Score: ${score} (+${score - previousScore})`;
    } else {
        scoreElement.innerText = `Score: ${score}`;
    }
}

const newGame = size => {
    board = getBoard(size);
    score = 0;
    buildBoard(board);
    saveGame();    
}

const saveGame = () => {
    localStorage.setItem('board', board);
    localStorage.setItem('boardSize', board.length);
    localStorage.setItem('score', score);
}

const restoreBoard = () => {
    const boardValues = localStorage.getItem('board');
    const size = localStorage.getItem('boardSize');

    const boardValsArray = boardValues.split(',');
    board = [];
    
    for (let i = 0; i < size; i++) {
        let row = [];

        for (let j = 0; j < size; j++) {
            let idx = j + (i*12);
            row.push(boardValsArray[idx]);
        }

        board.push(row);
    }
}

const restoreGame = () => {
    score = Number(localStorage.getItem('score'));
    updateScore();
    restoreBoard();
    buildBoard(board);
}

// update background

const changeBackground = () => {
    let body = document.body;

    if (body.classList.contains('background1')) {
        body.classList.remove('background1');
        body.classList.add('background2');
    } else {
        body.classList.remove('background2');
        body.classList.add('background1');
    }
}
 
// game set-up and running

if (localStorage.getItem('boardSize')) {
    restoreGame()
} else {
    newGame(12);
}

let newGameButton = document.getElementById('newGame');
newGameButton.addEventListener('click', () => {
    changeBackground();
    newGame(12);
});