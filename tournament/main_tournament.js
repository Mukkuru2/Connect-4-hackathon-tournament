import { Game, GameStatus, PlayerColor, MoveStatus} from "./four-in-a-row.js";
import { AI as AI1 } from "./AI1.js";
import { AI as AI2 } from "./AI2.js";
import { AI as AI3 } from "./AI3.js";
import { AI as AI4 } from "./AI4.js";
import { AI as AI5 } from "./AI1.js";
import { AI as AI6 } from "./AI2.js";
import { AI as AI7 } from "./AI3.js";
import { AI as AI8 } from "./AI4.js";
import { AI as AI9 } from "./AI1.js";
import { AI as AI10 } from "./AI2.js";
import { AI as AI11 } from "./AI3.js";
import { AI as AI12 } from "./AI4.js";



// === Config ===
const circleSize = 75;
const gamesPerPair = 100;
const matchDelayFrames = 1;
const nMatches = 10;
const nMatchesPerFrame = 10;

const aiClasses = [
    { name: "AI1", cls: AI1 },
    { name: "AI2", cls: AI2 },
    { name: "AI3", cls: AI3 },
    { name: "AI4", cls: AI4 },
    { name: "AI5", cls: AI5 },
    { name: "AI6", cls: AI6 },
    { name: "AI7", cls: AI7 },
    { name: "AI8", cls: AI8 },
    { name: "AI9", cls: AI9 },
    { name: "AI10", cls: AI10 },
    { name: "AI11", cls: AI11 },
    { name: "AI12", cls: AI12 }
];

// === State ===
let resultsMatrix = {};
let matchups = [];
let currentMatchIndex = 0;
let redAI, yellowAI;
let game;
let canvasSize;
let frameDelay = 0;
let tournamentComplete = false;
let animating = true;

// === Setup ===
function setup() {
    canvasSize = createVector(windowWidth, windowHeight);
    createCanvas(canvasSize.x, canvasSize.y);
    textFont("Arial");
    frameRate(200);
    initializeResults();
    generateMatchups();
    startNextMatch();
}

// === Main Loop ===
function draw() {
    background(230);

    if (!animating){

        drawBoard();
        drawMatchInfo();
        resolveNotAnimated();
        return;
    }

    if (!game || (game.status === GameStatus.WIN || game.status === GameStatus.DRAW)) {
        drawBoard();
        drawMatchInfo();

        if (++frameDelay > matchDelayFrames) {
            recordMatchResult();
            frameDelay = 0;

            if (currentMatchIndex < nMatches) {
                startNextMatch();
            } else {
                animating = false;
            }
        }
        return;
    }

    playAITurn();
    drawBoard();
    drawMatchInfo();
}

function resolveNotAnimated(n = 0) {
    if (currentMatchIndex >= matchups.length) {
        tournamentComplete = true;
        drawResultGrid();
        noLoop();
        return;
    }

    let [red, yellow] = matchups[currentMatchIndex];
    redAI = new red.cls(red.name, "red");
    yellowAI = new yellow.cls(yellow.name, "yellow");
    game = new Game();
    while (game.status === GameStatus.IN_PROGRESS || game.status === GameStatus.START) {
        playAITurn();
    }
    recordMatchResult();
    currentMatchIndex++;

    if (n < nMatchesPerFrame) {
        resolveNotAnimated(n + 1);
    }
}

// === Core Logic ===
function initializeResults() {
    aiClasses.forEach(ai1 => {
        resultsMatrix[ai1.name] = {};
        aiClasses.forEach(ai2 => {
            if (ai1.name !== ai2.name) {
                resultsMatrix[ai1.name][ai2.name] = { asRed: { wins: 0, total: 0 }, asYellow: { wins: 0, total: 0 } };
            }
        });
    });
}

function generateMatchups() {
    for (let i = 0; i < aiClasses.length; i++) {
        for (let j = 0; j < aiClasses.length; j++) {
            if (i === j) continue;
            for (let k = 0; k < gamesPerPair / 2; k++) {
                matchups.push([aiClasses[i], aiClasses[j]]); // ai[i] is red
            }
        }
    }
}

function startNextMatch() {
    if (currentMatchIndex >= matchups.length) return;
    let [red, yellow] = matchups[currentMatchIndex];
    redAI = new red.cls(red.name, "red");
    yellowAI = new yellow.cls(yellow.name, "yellow");
    game = new Game();
    currentMatchIndex++;
}

function playAITurn() {
    const currentAI = game.currentTurn === PlayerColor.RED ? redAI : yellowAI;
    const move = currentAI.CalculateMove(game.currentBoard);
    let result = game.playMove(move);

    // Random move if invalid
    while (result.status === MoveStatus.INVALID) {
       result = game.playMove(Math.floor(Math.random() * game.currentBoard[0].length));
    }

    // Win logic if won
    if (result.status === MoveStatus.WIN) {
        game.winner = result.winner;
    }
}

function recordMatchResult() {
    const status = game.status;
    const winner = game.winner;

    if (status === GameStatus.WIN) {
        if (winner === PlayerColor.RED) {
            resultsMatrix[redAI.name][yellowAI.name].asRed.wins++;
        } else {
            resultsMatrix[yellowAI.name][redAI.name].asYellow.wins++;
        }
    }

    // Always count total
    resultsMatrix[redAI.name][yellowAI.name].asRed.total++;
    resultsMatrix[yellowAI.name][redAI.name].asYellow.total++;
}

// === Drawing ===
function drawBoard() {
    if (!game) return;

    const board = game.currentBoard;
    fill("blue");
    noStroke();

    const boardX = 3 * canvasSize.x / 4 - circleSize * 4;
    const boardY = canvasSize.y / 2 - circleSize * 4;
    rect(boardX, boardY, circleSize * 8, circleSize * 8);

    const offset = circleSize * 0.25;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const x = boardX + (circleSize + 5) * j + circleSize / 2;
            const y = boardY + (circleSize + 5) * i + circleSize / 2;
            const cell = board[i][j];
            let color = "white";
            if (cell === 1) color = "yellow";
            if (cell === 2) color = "red";

            fill(color);
            circle(x + offset, y + offset, circleSize);
        }
    }
    drawResultGrid()
}

function drawMatchInfo() {
    fill("black");
    textSize(24);
    textAlign(CENTER);
    text(`Game ${currentMatchIndex} / ${matchups.length}`, width / 2, 40);
    text(`${redAI.name} (Red) vs ${yellowAI.name} (Yellow)`, width / 2, 70);
}

function drawResultGrid() {
    console.log("Drawing result grid...");
    const numAIs = aiClasses.length;

    const availableWidth = width / 2 - 100;
    const availableHeight = height - 200;

    const gridSize = Math.min(
        availableWidth / (numAIs + 1),
        availableHeight / (numAIs + 1),
        100
    );

    const offsetX = 50;
    const offsetY = 100;

    textAlign(CENTER, CENTER);
    textSize(gridSize * 0.25);

    const sortedAIs = Object.entries(resultsMatrix)
        .map(([aiName, opponents]) => {
            let totalWins = 0;
            for (const opponent in opponents) {
                const vs = opponents[opponent];
                totalWins += vs.asRed.wins + vs.asYellow.wins;
            }
            return { name: aiName, totalWins };
        })
        .sort((a, b) => a.totalWins - b.totalWins); // from worst to best

    for (let i = 0; i < numAIs; i++) {
        text(sortedAIs[i].name, offsetX + (i + 1) * gridSize, offsetY);
        text(sortedAIs[i].name, offsetX - gridSize / 2, offsetY + (i + 1) * gridSize);

        for (let j = 0; j < numAIs; j++) {
            const x = offsetX + (j + 1) * gridSize - gridSize / 2;
            const y = offsetY + (i + 1) * gridSize - gridSize / 2;

            if (i === j) {
                fill(220);
                rect(x, y, gridSize, gridSize);
                continue;
            }

            const ai1 = sortedAIs[i].name;
            const ai2 = sortedAIs[j].name;

            const redStats = resultsMatrix[ai1]?.[ai2]?.asRed;
            const yellowStats = resultsMatrix[ai1]?.[ai2]?.asYellow;


            let winRate = null;
            if (redStats && yellowStats) {
                const totalGames = redStats.total + yellowStats.total;
                const totalWins = redStats.wins + yellowStats.wins;
                if (totalGames > 0) {
                    winRate = totalWins / totalGames;
                }
            }

            // Background color based on win rate
            if (winRate !== null) {
                const col = lerpColor(color(255, 0, 0), color(0, 200, 0), winRate);
                fill(col);
            } else {
                fill(255);
            }

            rect(x, y, gridSize, gridSize);

            fill(0);
            text(winRate !== null ? winRate.toFixed(2) : "-", x + gridSize / 2, y + gridSize / 2);
        }
    }

    textSize(gridSize * 0.35);
    fill(0);
    text("Win Rate Matrix (Row vs Column)", offsetX + (numAIs + 1) * gridSize / 2, offsetY - gridSize * 0.6);
}




// === Attach to p5 ===
window.setup = setup;
window.draw = draw;
