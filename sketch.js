// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameState = "start";
let you;
let instructionButton;
let startButton;

//make grid into a class because i will need to make lots of them of different sizes.
// v grid for class
// i will give hard coded grids actual names (later), random grids wont need names because they will be kept in an array.
let gridOne; 

let gridTwo;

let grid;
let cols = 4;
let rows = 6;
const CELL_SIZE = 100;
let gridWidth = cols*CELL_SIZE;
let gridHeight = rows*CELL_SIZE;


let currentGrid = 1;


//make a function that defines the walkable area based on the grid (use walkable and unwalkable tiles) that detects corners
//and puts a point there, then use the polygon that makes to control where the character walks?????? using collide 2d would porbably be for the best

function setup() {
  createCanvas(windowWidth, windowHeight);
  // cant use you.width and you.height because they dont exist yet...???
  //WAIT
  // you = new Player(gridWidth/2-15, gridHeight/2-40);

  you = new Player(width/2, height/2);

  // BUTTONS
  // all buttons made should have rgb values (each) > 20
  instructionButton = new Button(width/2, height-75, 100, 25,   100, 100, 100,   "Instructions", 10);
  startButton = new Button(width/2, height-150, 150, 50,   120, 120, 120,   "Start" , 30);
  
  
  // grid =  generateEmptyGrid(cols, rows);

  gridOne = new SingleGrid(14, 8);
  gridOne.generateGrid();
}

class Player {
  constructor(x, y) {
    this.height = 80;
    this.width = 30;

    this.x = x-this.width/2;
    this.y = y-this.height/2;

    //used to pause player input during dialouge ect.
    this.canMove = true;
    this.speed = 10;
  }

  display() {
    noStroke();
    fill(150, 200, 230);
    /////////////////////////////////////////// he pill
    rect(this.x, this.y, this.width, this.height, 50);
  }

  move() {

    // ^
    if (keyIsDown(87) && !keyIsDown(83) && !keyIsDown(68) && !keyIsDown(65)) {
      this.y -= this.speed;
    }
    // v
    else if (keyIsDown(83) && !keyIsDown(87) && !keyIsDown(68) && !keyIsDown(65)) {
      this.y += this.speed;
    }
    // <
    else if (keyIsDown(68) && !keyIsDown(65) && !keyIsDown(87) && !keyIsDown(83)) {
      this.x += this.speed;
    }
    // >
    else if (keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87) && !keyIsDown(83)) {
      this.x -= this.speed;
    }


    // v>
    if (keyIsDown(83) && keyIsDown(68) && !keyIsDown(65) && !keyIsDown(87)) {
      this.y += this.speed/sqrt(2);
      this.x += this.speed/sqrt(2);
    }
    // ^>
    else if (keyIsDown(87) && keyIsDown(68) && !keyIsDown(65) && !keyIsDown(83)) {
      this.y -= this.speed/sqrt(2);
      this.x += this.speed/sqrt(2);
    }
    //^<
    else if (keyIsDown(87) && keyIsDown(65) && !keyIsDown(68) && !keyIsDown(83)) {
      this.y -= this.speed/sqrt(2);
      this.x -= this.speed/sqrt(2);
    }
    //v<
    else if (keyIsDown(83) && keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87)) {
      this.y += this.speed/sqrt(2);
      this.x -= this.speed/sqrt(2);
    }



    // // right / east
    // if (keyIsDown(68) && !keyIsDown(65)) {
    //   this.x += this.speed;
    // }

    // // left / west
    // if (keyIsDown(65) && !keyIsDown(68)) {
    //   this.x -= this.speed;
    // }
  }

  //   checkWithinGrid(someCols, someRows) {


    // from bouncing ball demo
    // if (someBall.x > width - someBall.radius || someBall.x < 0 + someBall.radius) {
    //   someBall.dx *= -1;
    // }
    // if (someBall.y > height - someBall.radius || someBall.y < 0 + someBall.radius) {
    //   someBall.dy *= -1;
    // }


//     //               left wall                                              right wall                                    //top wall                                                             // bottom wall       o-o
//     if (this.x > width/2 - someCols * CELL_SIZE / 2   &&   this.x + this.width < width/2 + someCols * CELL_SIZE / 2   &&   this.y > height/2 - someRows * CELL_SIZE / 2   &&   this.y + this.height < height/2 + someRows * CELL_SIZE / 2) {
//       return true;
//     }
//     return false;
//   }
}

class Button {
  constructor(x, y, w, h, r, g, b, theText, tSize) {
    this.w = w;
    this.h = h;

    this.x = x - this.w / 2;
    this.y = y - this.h / 2;
    this.c = color(r, g, b);
    this.text = theText;
    this.tSize = tSize
  }

  display(){
    //shape
    noStroke();
    fill(this.c);

    if (this.isHoveredOn()){
      fill(red(this.c) - 20, green(this.c) - 20, blue(this.c) - 20);
    }

    rect(this.x, this.y, this.w, this.h, this.h/1.2);

    //text
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(this.tSize);
    text(`${this.text}`, this.x + this.w/2, this.y + this.h/2);
    
  }

  isHoveredOn() {
    return(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h );
}

  isClicked() {
    return(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h );
  }
}


class SingleGrid {
  constructor(cols, rows) {
    this.rows = rows;
    this.cols = cols;
    this.gridWidth = this.cols*CELL_SIZE;
    this.gridHeight = this.rows*CELL_SIZE;

  }

  generateGrid() {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      this.grid.push([]);
      for (let x = 0; x < this.cols; x++) {

        //top border
        if (y === 0 || y === this.rows-1 || x === 0 || x === this.cols-1) {
          this.grid[y].push(1);
        }
        else {
          this.grid[y].push(0);
        }
      }
    }
  }

  displayGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        
        if (this.grid[y][x] === 0) {
          fill(200);
          stroke(180);
        }
        if (this.grid[y][x] === 1) {
          fill(0);
          // noStroke();
          stroke(30);
        }

        rect(x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}


function draw() {
  background(60);

  if (gameState === "start") {
    displayStartScreen();
  }
  else if (gameState === "ongoing") {

    // displayGrid();

    displayOneGrid();

    you.move();
    you.display();
  }
}

function displayStartScreen() {

  fill(255);
  textAlign(CENTER);
  // text("start screen", width/2, height/2);

  startButton.display();
  instructionButton.display();
}

function displayOneGrid() {
  if (currentGrid === 1) {
    gridOne.displayGrid();
  }
}


function mousePressed() {
  if (gameState === "start" && startButton.isClicked()) {
    gameState = "ongoing";
  }
}

function keyPressed() {
}

// function movePlayerBetweenGrids() {

// }

function keyReleased() {

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