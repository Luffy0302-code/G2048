document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');
    const retryBtn = document.getElementById('retry-btn');
    const gameOverScreen = document.getElementById('game-over');
    const cells = document.querySelectorAll('.grid-cell');
    
    let board = Array(16).fill(0);
    let score = 0;

    // Start Game
    function startGame() {
        gameOverScreen.classList.add('hidden');
        board = Array(16).fill(0);
        score = 0;
        updateScore(0);
        clearBoard();
        generateTile();
        generateTile();
        renderBoard();
    }

    function clearBoard() {
        document.querySelectorAll('.tile').forEach(tile => tile.remove());
    }

    // Generate a random 2 or 4 in an empty space
    function generateTile() {
        const emptyCells = board.map((val, idx) => val === 0 ? idx : null).filter(val => val !== null);
        if (emptyCells.length === 0) return;
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell] = Math.random() < 0.9 ? 2 : 4;
    }

    // Render numbers onto the visual HTML grid
    function renderBoard() {
        clearBoard();
        board.forEach((value, index) => {
            if (value > 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${value}`;
                tile.innerText = value;
                cells[index].appendChild(tile);
            }
        });
    }

    function updateScore(amount) {
        score += amount;
        scoreDisplay.innerText = score;
    }

    // Slide and Merge Logic for a single row/column array
    function slideRow(row) {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        return arr.concat(zeros);
    }

    function combineRow(row) {
        for (let i = 0; i < 3; i++) {
            if (row[i] === row[i + 1] && row[i] !== 0) {
                row[i] *= 2;
                updateScore(row[i]);
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < 16; i += 4) {
            let row = [board[i], board[i+1], board[i+2], board[i+3]];
            let slid = slideRow(row);
            let combined = combineRow(slid);
            let finalRow = slideRow(combined);
            
            if (JSON.stringify(row) !== JSON.stringify(finalRow)) moved = true;

            for (let j = 0; j < 4; j++) {
                board[i + j] = finalRow[j];
            }
        }
        return moved;
    }

    function rotateBoard() {
        let newBoard = Array(16).fill(0);
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newBoard[c * 4 + (3 - r)] = board[r * 4 + c];
            }
        }
        board = newBoard;
    }

    function handleMove(direction) {
        let moved = false;
        // 0: Left, 1: Up, 2: Right, 3: Down
        for (let i = 0; i < direction; i++) {
            rotateBoard();
        }
        
        moved = moveLeft();
        
        const rem = direction === 0 ? 0 : 4 - direction;
        for (let i = 0; i < rem; i++) {
            rotateBoard();
        }

        if (moved) {
            generateTile();
            renderBoard();
            checkGameOver();
        }
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
            // Stops your web browser window from jumping/scrolling while playing
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(0);
        else if (e.key === 'ArrowUp' || e.key === 'w') handleMove(1);
        else if (e.key === 'ArrowRight' || e.key === 'd') handleMove(2);
        else if (e.key === 'ArrowDown' || e.key === 's') handleMove(3);
    });

    function checkGameOver() {
        // Safe check: if there are any zeros left, the game is definitely not over
        if (board.includes(0)) {
            gameOverScreen.classList.add('hidden');
            return;
        }

        // Check horizontal or vertical matches
        for (let i = 0; i < 16; i++) {
            if (i % 4 < 3 && board[i] === board[i + 1]) return; 
            if (i < 12 && board[i] === board[i + 4]) return;    
        }

        gameOverScreen.classList.remove('hidden');
    }

    restartBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', startGame);

    startGame();
});
