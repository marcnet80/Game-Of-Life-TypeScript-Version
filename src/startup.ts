/// <reference path="./game.ts" />

var canvasRectWidth = 25;
var canvasRectHeight = 25;
var timer: number;

var element = <HTMLCanvasElement>document.getElementById("canvas");
var context = element.getContext("2d");
element.addEventListener("click", handleClick);

var game = new Game(element, context, canvasRectWidth, canvasRectHeight, timer);

function startGame(): void {
    timer = setInterval(function () {
        game.updateCells();
    }, 20);
}

function stopGame(): void {
    if (timer)
        clearInterval(timer);
}

function clearGrid(): void {
    stopGame();
    game.init();
}

function handleClick(event: any): void {
    var x = Math.floor(event.offsetX / canvasRectWidth) * canvasRectWidth;
    var y = Math.floor(event.offsetY / canvasRectHeight) * canvasRectHeight;
    game.changeStatuses(x, y, canvasRectWidth, canvasRectHeight);
    game.displayGrid();
}