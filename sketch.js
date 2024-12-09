// Major Project
// Avery Walker
// December 9th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//TO DO LIST//

// make a temporary way to go between grids [ ]

// use Collide2d to give each grid in a level a polygon that the player must stay within [ ]

//think of something to use maps for??

//have player.x && player.y be dependant on the xy of the grid in so 
//that when windowResized() the player stays in a consistant spot within the  grid  [ ]

//replace displayOneGrid with something more relevant (egLevel.currentGrid ect)[ ]

let gameState = "start";

//player
let you;


//buttons
let instructionButton;
let startButton;
let soundButton;

let testingLevel;
let currentLevel = 0;
//let currentGrid = 1;

const CELL_SIZE = 100;

//for testing (to be deleted)
let grid;
let cols = 8; // max 8 // min 4
let rows = 7; // max 7 // min 4
let gridWidth = cols*CELL_SIZE;
let gridHeight = rows*CELL_SIZE;

//sound/music
let buttonClickedSound;

function preload() {
  buttonClickedSound = loadSound("zipclick.flac");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  you = new Player(width/2, height/2);

  // BUTTONS
  createButtons();

  // GRIDS
  grid =  generateEmptyGrid(cols, rows);

  // LEVELS
  testingLevel = new Level();
  testingLevel.level = testingLevel.generateLevel();
  //testingLevel.generateEachGrid();
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
    this.tSize = tSize;
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
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h ;
  }

  isClicked() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h ;
    //put clicking sound effect here
  }
}

class SingleGrid {
  constructor(cols, rows) {
    this.rows = rows;
    this.cols = cols;
    this.gridWidth = this.cols*CELL_SIZE;
    this.gridHeight = this.rows*CELL_SIZE;

    this.generateGrid();
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
          stroke(45);
        }

        rect(x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

class Level  {
  constructor() {
    //temporary
    // this.template = [[1, 1],
    //                  [1, 1]]; // 4 3x3 Grids
    this.template = [[1, 2]]; //1 3x3 grid


    this.currentGrid;

    //choses the first grid with this.template[y][x] > 0
    this.chosenStartingGrid = false;                 
  }

  generateLevel() {
    //takes each value from the template and turns it into a grid
    //key: 1=3x3, 2=4x4, 3=5x5 ect, g=5x5 "goal" grid, r = random(3, 9)x random(3, 8)

    this.aLevel = [];
    for (let y = 0; y < this.template.length; y ++) {
      this.aLevel.push([]);
      for (let x = 0; x < this.template[y].length; x++) {

        //if [y][x]=0 push 0
        //else if [y][x]=g push goal
        //else if [y][x]=r push random

        //else                                         v ((+2 for translating the template) + (+2 for grid border allowance))
        let aGrid = new SingleGrid(this.template[y][x]+4, this.template[y][x]+4);

        this.aLevel[y].push(aGrid);

        if (!this.chosenStartingGrid && this.template[y][x] > 0) { // add ! for letters later
          this.currentGrid = [y, x];
          this.chosenStartingGrid = true;
        }
      }
    }
    return this.aLevel;
  }
}



function draw() {
  if (gameState === "start") {
    background(60);
    displayStartScreen();
  }
  else if (gameState === "ongoing") {
    background(0);

    testingLevel.level[   testingLevel.currentGrid[0]  ]  [  testingLevel.currentGrid[1]  ].displayGrid();

    you.move();
    you.display();
  }
}

function displayStartScreen() {

  fill(255);
  textAlign(CENTER);

  //buttons
  startButton.display();
  instructionButton.display();
  soundButton.display();

  //image border
  fill(240);
  rect(width/2 - 350, 110, 700, 400);

  //replace with image
  fill(10);
  rect(width/2 - 345, 115, 690, 390);

  //side bars
  rect(0, 0, width/2-500, height);
  rect(width/2+500, 0, width, height);
}


//replace with function that works with my new level system...
function displayOneGrid() {
  if (currentGrid === 1) {
    gridOne.displayGrid();
  }
}

function createButtons() {
  // all buttons made should have rgb values (each) > 20

  //  button format:              x // y // width // height //   r // g // b //    "text"    //  textsize
  instructionButton = new Button(width/2, height-75, 100, 25,   100, 100, 100,   "Instructions", 15);

  startButton = new Button(width/2, height-150, 150, 50,        120, 120, 120,   "Start" , 35);

  soundButton = new Button(width/2 + 80, height-75, 25, 25,     100, 100, 100,   "🕪", 20);
}




function mousePressed() {
  if (gameState === "start" && startButton.isClicked()) {
    gameState = "ongoing";
  }
}

function keyPressed() {
}



//not being used for anything except that random hard coded grid that is also not being used for anything
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

//same as above
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



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (gameState === "start") {
    startButton.x = width/2 - startButton.w/2;
    instructionButton.x = width/2 - instructionButton.w/2;
    soundButton.x = width/2 - soundButton.w/2 + 80;
  }
}