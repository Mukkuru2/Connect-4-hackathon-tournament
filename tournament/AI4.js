function CalculateMove(boardState) {
    const ROWS = 7;
    const COLS = 7;
    const AI = 2; // Red
    const PLAYER = 1; // Yellow

    // Check if a column has space
    function isValidMove(board, col) {
        return board[0][col] === 0;
    }

    // Make a simulated move and return the new board
    function simulateMove(board, col, token) {
        const newBoard = board.map(row => Uint8Array.from(row));
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][col] === 0) {
                newBoard[row][col] = token;
                break;
            }
        }
        return newBoard;
    }

    // Check if a board has a win for a player
    function isWinningBoard(board, token) {
        const checkDir = (r, c, dr, dc) => {
            for (let i = 0; i < 4; i++) {
                let nr = r + dr * i;
                let nc = c + dc * i;
                if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== token) {
                    return false;
                }
            }
            return true;
        };

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] !== token) continue;
                if (checkDir(r, c, 0, 1) || checkDir(r, c, 1, 0) || checkDir(r, c, 1, 1) || checkDir(r, c, 1, -1)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Try winning move
    for (let col = 0; col < COLS; col++) {
        if (isValidMove(boardState, col)) {
            const newBoard = simulateMove(boardState, col, AI);
            if (isWinningBoard(newBoard, AI)) {
                return col;
            }
        }
    }

    // Try to block opponent
    for (let col = 0; col < COLS; col++) {
        if (isValidMove(boardState, col)) {
            const newBoard = simulateMove(boardState, col, PLAYER);
            if (isWinningBoard(newBoard, PLAYER)) {
                return col;
            }
        }
    }

    // Fallback: random valid move
    const validMoves = [];
    for (let col = 0; col < COLS; col++) {
        if (isValidMove(boardState, col)) {
            validMoves.push(col);
        }
    }

    return validMoves[Math.floor(Math.random() * validMoves.length)];
}
