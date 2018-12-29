/// <reference path="./cell.ts" />
interface IGame{
  init(): void;
  draw(cell: Cell): void;
}

class Game implements IGame {
    readonly Rows: number = 24;
    readonly Columns = 24;
    readonly CanvasRectWidth: number;
    readonly CanvasRectHeight: number;
    readonly CanvasFillStyleActiveCells = "#194A8D";
    readonly CanvasFillStyleInActiveCells = "white";
    readonly CanvasStrokeStyle = "#495F75";
    readonly CountNeghboursForActiveCell: number = 3;
    readonly point: number = 1;
    private cells: Cell[][] = [];
    private generationCount: number;
    private updatedCells: Cell[][] = [];
    private timer: number;
    private element: HTMLCanvasElement;
    private context: any;

    constructor(element: HTMLCanvasElement, context: any, canvasRectWidth: number, canvasRectHeight: number, timer: number) {
        this.CanvasRectHeight = canvasRectHeight;
        this.CanvasRectWidth = canvasRectWidth;
        this.element = element;
        this.context = context;
        this.timer = timer;
        this.init();
    }

    init(): void {
        for (var row = 0; row < this.Rows; row++) {
            this.cells[row] = [];
            for (var column = 0; column < this.Columns; column++) {
                var x = this.CanvasRectWidth * row;
                var y = this.CanvasRectHeight * column;

                this.cells[row][column] = { x: x, y: y, active: false };
            }
        }
        this.displayGrid();
        this.generationCount = 0;
        document.getElementById("#generation").innerHTML = this.generationCount.toString();
    }

    hasCellActiveNeighbour(x: number, y: number): boolean {
        if (!this.cells[x] || !this.cells[x][y])
            return false;

        return this.cells[x][y].active;
    }

    countCellsNeighbours(x: number, y: number): number {
        var neighbours = 0;
        if (this.hasCellActiveNeighbour(x - this.point, y)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x + this.point, y)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x - this.point, y - this.point)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x + this.point, y - this.point)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x, y - this.point)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x - this.point, y + this.point)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x + this.point, y + this.point)) {
            neighbours++;
        }
        if (this.hasCellActiveNeighbour(x, y + this.point)) {
            neighbours++;
        }

        return neighbours;
    }

    draw(cell: Cell): void {
        this.context.beginPath();
        this.context.rect(cell.x, cell.y, this.CanvasRectWidth, this.CanvasRectHeight);

        if (cell.active) {
            this.context.fillStyle = this.CanvasFillStyleActiveCells;
            this.context.fill();
        }
        else {
            this.context.fillStyle = this.CanvasFillStyleInActiveCells;
            this.context.strokeStyle = this.CanvasStrokeStyle;
            this.context.fill();
            this.context.stroke();
        }

        this.context.closePath();
    }

    displayGrid(): void {
        var self = this;
        this.cells.forEach(function (element, row, array) {
            element.forEach(function (element2d, column, array2d) {
                self.draw(element2d);
            });
        });
    }

    updateCells(): void {
        this.generationCount++;
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.displayGrid();

        if (!this.isCellsActive()) {
            this.init();
            return;
        }

        this.updatedCells = [];

        this.cells.forEach(function (element, row, array) {
            this.updatedCells[row] = [];

            element.forEach(function (element2d, column, array2d) {

                var isActive = false;
                var neighbours = this.countCellsNeighbours(row, column);

                if (element2d.active)
                    isActive = neighbours == (this.CountNeghboursForActiveCell - 1) || neighbours == this.CountNeghboursForActiveCell ? true : false;
                else
                    isActive = neighbours == this.CountNeghboursForActiveCell ? true : false;

                var x = this.cells[row][column].x;
                var y = this.cells[row][column].y;
                this.updatedCells[row][column] = { x: x, y: y, active: isActive };
            }.bind(this));
            document.getElementById("#generation").innerHTML = this.generationCount.toString();
        }.bind(this));

        this.cells = this.updatedCells;
    }

    isCellsActive(): boolean {
        var isActiveCellsExist = this.cells.some(x => x.some(cell => cell.active == true));
        return isActiveCellsExist;
    };

    changeStatuses(x, y, canvasRectWidth, canvasRectHeight): void {
        this.cells[x / canvasRectWidth][y / canvasRectHeight].active = this.cells[x / canvasRectWidth][y / canvasRectHeight].active ? false : true;
    }
}