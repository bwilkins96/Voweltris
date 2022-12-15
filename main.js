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

const handleClick = event => {
    let letter = event.target;

    if (current === 1) {
        letter1 = letter;
        letter.classList.add('active');
        current++;
    } else if (current === 2) {
        letter2 = letter;

        if (isAdjacent()) {
            letter.classList.add('active');
            current++;
        }
    }

    if (current === 3) {
        handleMove();
        current = 1;
    }
}

const handleMove = () => {
    let [i, j, i2, j2] = getId(letter1, letter2);

    let temp = board[i][j];
    board[i][j] = board[i2][j2];
    board[i2][j2] = temp;

    buildBoard(board);
}

const newGame = size => {
    board = getBoard(size);
    score = 0;
    buildBoard(board);
}

// game set-up and running

newGame(12);
