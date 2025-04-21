import { Game, GameStatus } from "./four-in-a-row.js";
let playing = false;
let game;
let canvasSize;
let canvas;
let circleSize = 75;
let playerFirst;
let aiTurn;
let resetButton;
let mousedown = false;
function setup(){
     canvasSize = createVector(windowWidth, windowHeight);
     canvas = createCanvas(canvasSize.x, canvasSize.y);
    resetButton = createButton('reset');
    resetButton.position(canvasSize.x/2, 25);
    resetButton.mousePressed(ResetBoard);
}

function draw(){
    background("Grey");
    UpdateBoard();
    if(game.status !== GameStatus.DRAW && game.status !== GameStatus.WIN){
        if(aiTurn){
            game.playMove(CalculateMove(game.currentBoard));
            aiTurn = false;
        }
        else{
            PlayerTurn();
        }
    }
    else if(game.status === GameStatus.WIN){
        textAlign(CENTER);
        textSize(75);
        fill("Black");
        if(aiTurn && playerFirst){
        text("Yellow wins!", canvasSize.x/2, canvasSize.y/2)
        print("yellow")
        }
        else if(aiTurn && !playerFirst){
            text("Red wins!", canvasSize.x/2, canvasSize.y/2);
            print("red")
        }
        else if(!aiTurn && playerFirst){
            text("Red wins!", canvasSize.x/2, canvasSize.y/2);
            print("red")
        }
        else if(!aiTurn && !playerFirst){

            text("Yellow wins!", canvasSize.x/2, canvasSize.y/2)
        print("yellow")
            }
        }
    }
function ResetBoard(){
    playing = false;
}

function PlayerTurn(){
    print("player turn");
    let mousepos = createVector(mouseX, mouseY);
    let selectedRow;
    if(mousepos.x >= canvasSize.x /2 - (circleSize * 3.5) && mousepos.y >= canvasSize.y/2 - (circleSize * 3.5)){
        for(let i = 0; i <= game.currentBoard.length +1; i +=1){
        if(mousepos.x >= (canvasSize.x /2 - circleSize * 3.5) + (circleSize * i) -circleSize && mousepos.x <= (canvasSize.x /2 - circleSize * 3.5) + (circleSize+5  ) * i){
            selectedRow = i -1;
        }
    }
    print(selectedRow);
    }
    if(mouseIsPressed && !mousedown){
        mousedown = true;
        if(selectedRow !== undefined){
            game.playMove(selectedRow);
            aiTurn = true;  
        }
    }
    else if (!mouseIsPressed){
        mousedown = false;
    }
}

function UpdateBoard(){
    if(!playing){
        game = new Game();
        playing = true;
        let num = round(random(0,1));
        
        if(num == 0){
            playerFirst = false;
            aiTurn = true;
        }
        else{
            playerFirst = true;
            aiTurn = false;
        } 
    }
    else{
    noStroke();
    fill("Blue");
    rect(canvasSize.x /2 - circleSize * 3.6, canvasSize.y/2 - (circleSize * 3.6), circleSize * game.currentBoard[1].length + circleSize *0.6, circleSize * game.currentBoard.length + circleSize *0.6);
    for(let i = 0; i <= game.currentBoard.length -1; i+=1){
        for(let j = 0; j <= game.currentBoard[i].length-1; j+=1){
            let col = "White";
            if(game.currentBoard[i][j] == 1){
                col = "Yellow";
            }
            else if (game.currentBoard[i][j] == 2){
                col = "Red";
            }
            fill(col);
            circle((canvasSize.x /2 - circleSize * 3) + ((circleSize + 5) * j), canvasSize.y/2 - (circleSize * 3) + ((circleSize+5) * i), circleSize );
            }
        }
    }
}

window.setup = setup; 
window.draw = draw;