// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameState = "start";
let you;

//make grid into a class because i will need to make lots of them of different sizes.
// v grid for class
let gridOne; 

//grid that works rn ( not an object)
let grid;
let cols = 4;
let rows = 6;
const CELL_SIZE = 100;
let gridWidth = cols*CELL_SIZE;
let gridHeight = rows*CELL_SIZE;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // cant use you.width and you. height because they dont exist yet...???

  // you = new Player(gridWidth/2-15, gridHeight/2-40);

  you = new Player(width/2-15, height/2 - 40);

  grid =  generateEmptyGrid(cols, rows);

  // gridOne = new SingleGrid(6, 4);
  // gridOne.generateGrid();
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 30;
    this.canMove = true;
    this.speed = 10;
  }

  display() {
    noStroke();
    fill(150, 200, 230);
    rect(this.x, this.y, this.width, this.height);
  }

  move() {

    //           MAIN FOUR DIRECTIONS
    //forwards / north
    if (this.north && !this.south && !this.east && !this.west) {
      this.y -= this.speed;
    }

    // backwards / south
    else if (this.south && !this.north && !this.east && !this.west) {
      this.y += this.speed;
    }

    // right / east
    else if (this.east && !this.north && !this.south && !this.west) {
      this.x += this.speed;
    }

    // left / west
    else if (this.west && !this.north && !this.south && !this.east) {
      this.x -= this.speed;
    }

    //           DIAGNOLS
    // forwards/right / northeast
    if (this.north && !this.south && this.east && !this.west) {
      this.y -= this.speed-sqrt(2)/2;
      this.x += this.speed-sqrt(2)/2;
    }

    // forwards/left / northwest
    if (this.north && !this.south && !this.east && this.west) {
      this.y -= this.speed-sqrt(2)/2;
      this.x -= this.speed-sqrt(2)/2;
    }

    // backwards/right / southeast
    if (!this.north && this.south && this.east && !this.west) {
      this.y += this.speed-sqrt(2)/2;
      this.x += this.speed-sqrt(2)/2;
    }

    //backwards/ left / southwest
    if (!this.north && this.south && !this.east && this.west) {
      this.y += this.speed-sqrt(2)/2;
      this.x -= this.speed-sqrt(2)/2;
    }
  }

  // stayWithinGrid() {
  //   if (this.x < ) {
  //   }
  // }
}


// grid exists // current problem is with the display of the grid... [ ]
class SingleGrid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = 100;
    this.gridWidth = this.cols*this.cellSize;
    this.gridHeight = this.rows*this.cellSize;

  }

  generateGrid() {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      this.grid.push([]);
      for (let x = 0; x < this.cols; x++) {
        this.grid[y].push(0);
      }
    }
  }

  displayGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        fill(200);
        stroke(180);
        //rect(x*cellSize + width/2 - cellSize*PASSWORD_LENGTH/2, y*cellSize +100, cellSize, cellSize);
        rect(x*this.cellSize + width/2 - this.gridWidth/2, y*this.cellSize + this.height/2 - this.gridHeight/2, this.cellSize, this.cellSize);
      }
    }
  }
}


function draw() {
  background(60);

  if (gameState === "start") {
    fill(255);
    text("start screen", width/2, height/2);
  }
  else if (gameState === "ongoing") {
    displayGrid();
    // gridOne.displayGrid();
    you.move();
    you.display();
  }
}




function mousePressed() {
  if (gameState === "start") {
    gameState = "ongoing";
  }
}

function keyPressed() {

  // player movement
  if (you.canMove) {
    if (key === "w") {
      you.north = true;
    }
    if (key === "s") {
      you.south = true;
    }
    if (key === "d") {
      you.east = true;
    }
    if (key === "a") {
      you.west = true;
    }
  }
}

function movePlayerBetweenGrids() {

}

function keyReleased() {

  //player Movement
  if (you.canMove) {
    if (key === "w") {
      you.north = false;
    }
    if (key === "s") {
      you.south = false;
    }
    if (key === "d") {
      you.east = false;
    }
    if (key === "a") {
      you.west = false;
    }
  }
}



function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      fill(200);
      stroke(180);
      //rect(x*cellSize + width/2 - cellSize*PASSWORD_LENGTH/2, y*cellSize +100, cellSize, cellSize);
      rect(x*CELL_SIZE + width/2 - gridWidth/2, y*CELL_SIZE + height/2 - gridHeight/2, CELL_SIZE);
    }
  }
}


function generateEmptyGrid(theCols, theRows) {
  let newGrid = [];
  for (let y = 0; y < theRows; y++) {
    newGrid.push([]);
    for (let x = 0; x < theCols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}