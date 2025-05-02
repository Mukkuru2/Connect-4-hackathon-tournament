// Register your AIs
const redAI = CalculateMove; // Your AI function
const yellowAI = RandomAI;   // Another AI (or the same)

const results = simulateMatch(redAI, yellowAI, 100);
console.log(results);



function simulateMatch(ai1, ai2, numGames = 100) {
    const results = { ai1Wins: 0, ai2Wins: 0, draws: 0 };

    for (let i = 0; i < numGames; i++) {
        const game = new Game();
        let move, result;

        while (game.status === GameStatus.START || game.status === GameStatus.IN_PROGRESS) {
            const boardCopy = Game.deepBoardCopy(game.currentBoard);
            const isAi1Turn = game.currentTurn === PlayerColor.RED;
            const ai = isAi1Turn ? ai1 : ai2;
            move = ai(boardCopy, game.currentTurn);
            result = game.playMove(move);

            if (result.status === MoveStatus.INVALID) {
                // Forfeit if AI makes illegal move
                if (isAi1Turn) {
                    results.ai2Wins++;
                } else {
                    results.ai1Wins++;
                }
                break;
            }
        }

        if (result.status === MoveStatus.WIN) {
            if (result.winner === PlayerColor.RED) results.ai1Wins++;
            else results.ai2Wins++;
        } else if (result.status === MoveStatus.DRAW) {
            results.draws++;
        }
    }

    return results;
}
