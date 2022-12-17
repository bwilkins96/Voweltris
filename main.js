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

    for (let i = 0; i < board.length; i++) {
        let htmlRow = document.createElement('div');

        for (let j = 0; j < board.length; j++) {
            let piece = document.createElement('p');
            piece.innerText = board[i][j];
            piece.classList.add(`${board[i][j]}`);
            piece.setAttribute('id', `${i},${j}`);
            
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
                }

                if (count >= 3 && board[i][j] !== '-') {
                    for (let n = j; n > j - count; n--) {
                        board[i][n] = "-";
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
                }

                if (count >= 3 && board[j][i] !== '-') {
                    for (let n = j; n > j - count; n--) {
                        board[n][i] = "-";
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
        buildBoard(board);

        setTimeout(() => {
            shiftDown(incremented, timeout);
        }, timeout);
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
        setTimeout(() => {
            shiftDown(true, 250);
        }, 500);
    }
}

const newGame = size => {
    board = getBoard(size);
    score = 0;
    buildBoard(board);    
}

// game set-up and running

newGame(12);
