// Major Project
// Avery Walker
// December 5th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//TO DO LIST//

// make 'Map' into a class
// make a temporary way to go between grids
// use Collide2d to give each grid in a map a polygon that the player must stay within

let gameState = "start";
let you;
let instructionButton;
let startButton;
let soundButton;

let gridOne; 

let gridTwo;


//array of grids
let map;

//hard coded Map
let homeMapTemplate = [[0, 1, 0],
  // eslint-disable-next-line indent
                       [1, 3, 1],
  // eslint-disable-next-line indent
                       [0, 1, 0]];

//homeMap = generateMap(homeMapTemplate);

let grid;
let cols = 8; // max 8 // min 4
let rows = 7; // max 7 // min 4
const CELL_SIZE = 100;
let gridWidth = cols*CELL_SIZE;
let gridHeight = rows*CELL_SIZE;

let currentGrid = 1;
let someGrid;
let help = (1,1);

function setup() {
  createCanvas(windowWidth, windowHeight);
  you = new Player(width/2, height/2);

  // BUTTONS
  // all buttons made should have rgb values (each) > 20

  //  button format:              x // y // width // height //   r // g // b //    "text"    //  textsize

  instructionButton = new Button(width/2, height-75, 100, 25,   100, 100, 100,   "Instructions", 15);
  //help button brings up the same menu but can be accessed while gameState = "ongoing"

  startButton = new Button(width/2, height-150, 150, 50,        120, 120, 120,   "Start" ,       35);

  soundButton = new Button(width/2 + 80, height-75, 25, 25,     100, 100, 100,   "🕪", 20);
  
  
  // GRIDS
  // grid =  generateEmptyGrid(cols, rows);


  // CREATE CLASS MAP -- basically make it so it does this but for everyspot in the template now.
  //the reason the + 4 is there is becuase 3= 5x5 so 3+2 = 5, and the borders take up 2 so    template = 3 (+2) -> 5 + border (+2)   so instead (+2)+(+2)
  someGrid = new SingleGrid(Number(homeMapTemplate[1][1]+4), Number(homeMapTemplate[1][1]+4));
  //it is not making a grid lol
  //someGrid.generateGrid();

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
  }
}

class Map {
  constructor(arrayOfGrids) {
    this.cols = arrayOfGrids.length;
    this.rows = arrayOfGrids[0].length;

    this.currentGrid;
    this.gridArray = arrayOfGrids;
  }

  generateMap() {
    newMap = [];
    for (let y= 0; y < arrayOfGrids.length; y++) {
      newMap.push([]);
      for (let x = 0; x < arrayOfGrids[y].length; x++) {
  
        if (Number(arrayOfGrids[y][x]) === 0) {
          //no grid, stays as a zero
          newMap[y].push(0);
        }
  
        //unique map inputs need to go above this one 
        // if [y][x] = r then generate a random sized grid
        // if [x][x] = g then generate a grid that contains one of the goals
  
        else {
          someGrid = new SingleGrid(Number(arrayOfGrids[y][x]+2), Number(arrayOfGrids[y][x]+2));
  
          // newMap[y].push(generateGrid(Number(mapTemplate[y][x]+2), Number(mapTemplate[y][x]+2)));
  
          newMap[y].push(someGrid);
        }
      }
    }
  }

  transferBetweenGrids() {

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
          stroke(45);
        }

        rect(x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}


function draw() {
  if (gameState === "start") {
    background(60);
    displayStartScreen();
  }
  else if (gameState === "ongoing") {
    background(0);

    displayGrid();

    //ok
    // for (let grid of )
    //someGrid.displayGrid();


    //displayOneGrid();

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

// erm
// add to map class
function generateMap(mapTemplate) {
  newMap = [];
  for (let y= 0; y < mapTemplate.length; y++) {
    newMap.push([]);
    for (let x = 0; x < mapTemplate[y].length; x++) {

      if (Number(mapTemplate[y][x]) === 0) {
        //no grid, stays as a zero
        newMap[y].push(0);
      }

      //unique map inputs need to go above this one 
      // if [y][x] = r then generate a random sized grid
      // if [x][x] = g then generate a grid that contains one of the goals

      else {
        //huh             ---------------------------------------------------------------
        let aGrid = new SingleGrid(Number(mapTemplate[y][x]), Number(mapTemplate[y][x]));

        // newMap[y].push(generateGrid(Number(mapTemplate[y][x]+2), Number(mapTemplate[y][x]+2)));

        newMap[y].push(aGrid);
      }
    }
  }
  return aGrid;
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