// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

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
}

let gameState = "start";
let you;
let grid; 
let cols;
let rows;
const CELL_SIZE = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  you = new Player(width/2, height/2);

  //obsolete in future
  cols = Math.floor(width/CELL_SIZE);
  rows = Math.floor(height/CELL_SIZE);

  grid =  generateEmptyGrid(cols, rows);
}

function draw() {
  background(220);
  displayGrid();

  if (gameState === "start") {
    text("start screen", width/2, height/2);
  }
  else if (gameState === "ongoing") {
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
      square(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE);
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