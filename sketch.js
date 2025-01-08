// Major Project
// Avery Walker
// December 9th 2024
//
// Extra for Experts:
//(currentLevel['aLevel'])[0][0].rows <- figured out how to access stuff from my 3d array. cool


//TO DO LIST//

// make a temporary way to go between grids [ ]

// use Collide2d to give each grid in a level a polygon that the player must stay within [ ]

//think of something to use maps for??

//have player.x && player.y be dependant on the xy of the grid in so 
//that when windowResized() the player stays in a consistant spot within the  grid  [ ]

//replace displayOneGrid with something more relevant (egLevel.currentGrid ect)[ ]



//gameStates
let gameState = "start";

//player
let you;

//BUTTONS
let instructionButton;
let startButton;
let menuButton;

//GRIDS
const CELL_SIZE = 100;
// max colsmax  8 // min 4
// max 7 // min 4

//LEVELS
let currentLevel;
let testingLevel;

//sound/music
let isSoundOn = true;

let buttonClickedSound; //set
let swordSlash; //not set
let gunBlast; //not set

let isMusicOn = true;

let BackgroundMusic; //not set


//MENUS
let sideMenu = {
  width: 300,
  x: -300,
  y: 0,
  dx: 20,
  state: "closed",
};

//instructions
let instructions = {
  width: 750,
  height: 650,
  movement: "WASD",
  attack: "...",
  goal: "...",
  state: "closed",
};

function preload() {
  buttonClickedSound = loadSound("zipclick.flac");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  you = new Player(width/2, height/2);

  // BUTTONS
  createButtons();

  // LEVELS
  testingLevel = new Level();
  //changing this to 'aLevel' breaks it idk why eslint wants me to do that
  testingLevel.level = testingLevel.generateLevel();

  currentLevel = testingLevel;
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

    this.maxHP = 100;
    this.currentHP = 100;

    this.lastHit = 0;
    this.hitWait = 1000;

    this.state = "alive";
    this.lives = 3;

    this.meleeDMG = 10;
    this.rangedDMG = 5;
    
  }

  display() {
    noStroke();
    fill(168, 132, 207);
    rect(this.x, this.y, this.width, this.height, 50);
  }

  displayHealthBar() {
    if (this.currentHP > 0) {
      //grey bar
      let greyBarWidth = 132;
      let greyX = 30;
      let greyY = 30;
  
      noStroke();
      fill(100);
      rect(greyX, greyY, greyBarWidth, 36);
  
      //health is green
      if (this.currentHP >= this.maxHP/2){
        fill(80, 230, 120);
      }
      //health is red
      else if (this.currentHP <= this.maxHP/5){
        fill(255, 120, 80);
      }
      //health is yellow
      else {
        fill(210, 210, 80);
      }
      
      rect(greyX+6, greyY+6, this.currentHP/this.maxHP*120, 24);
    }
  }
  
  move() {
    if (this.canMove) {


      // ^
      if (keyIsDown(87) && !keyIsDown(83) && !keyIsDown(68) && !keyIsDown(65)) {
        this.y -= this.speed;
        //this.y = constrain(this.y - this.speed, currentLevel.level[0][0].gridY, currentLevel.level[0][0].gridY + currentLevel.level[0][0].gridHeight);
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
    //replace with currentLevel.currentGrid whatevers
    this.y = constrain(this.y, currentLevel.level[0][0].gridY + CELL_SIZE, currentLevel.level[0][0].gridY + currentLevel.level[0][0].gridHeight - CELL_SIZE - this.height);
    this.x = constrain(this.x, currentLevel.level[0][0].gridX + CELL_SIZE,currentLevel.level[0][0].gridX + currentLevel.level[0][0].gridWidth - CELL_SIZE-this.width);
  }

  checkState() {
    if (this.currentHP <= 0) {
      this.state = "dead";
    }
  }

  meleeAttack() {
    // constrain function my beloved

    //where ever you click with left mouse a circle (hitbox marker (temporary)) appears, anything touching the circle will take dmg
  }
}

class Button {
  constructor(x, y, w, h, r, g, b, theText, tSize, toggle) {
    this.w = w;
    this.h = h;

    this.x = x - this.w / 2;
    this.y = y - this.h / 2;
    this.c = color(r, g, b);
    this.text = theText;
    this.tSize = tSize;
    this.state = toggle; //"on"/"off" || "notToggle" (anything not on/off)

  }

  display(){
    //shape
    noStroke();
    fill(this.c);

    if (this.isHoveredOn()){
      fill(red(this.c) - 20, green(this.c) - 20, blue(this.c) - 20);
    }

    if (gameState === "start") {
      stroke(this.c);
    }
    else {
      stroke(255);
    }


    rect(this.x, this.y, this.w, this.h, this.h/1.2);

    //text
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(this.tSize);
    noStroke();

    if (this.state === "notToggle") {
      text(`${this.text}`, this.x + this.w/2, this.y + this.h/2);
    }

    else {
      text(`${this.text} ${this.state}`, this.x + this.w/2, this.y + this.h/2);
    }
    
  }

  isHoveredOn() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h ;
  }

  isClicked() {

    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {

      
      if (this.state === "on") {
        this.state = "off";
      }
      else if(this.state === "off"){
        this.state = "on";
      }

      if (isSoundOn) {
        buttonClickedSound.play();
      }

      return true;
    }
    else {
      return false;
    }
  }
}

class SingleGrid {
  constructor(cols, rows) {
    this.rows = rows;
    this.cols = cols;
    this.gridWidth = this.cols*CELL_SIZE;
    this.gridHeight = this.rows*CELL_SIZE;

    //values for the whole grid
    // this.gridX;
    // this.gridY;

    this.gridX =  width/2 - (this.gridWidth/2-CELL_SIZE/2) - CELL_SIZE/2;

    this.gridY =  height/2 - (this.gridHeight/2-CELL_SIZE/2) - CELL_SIZE/2;



    this.exitMap = new Map();
    this.GeneratedExits = false; //to make sure it only happens once per grid
    //top
    //this.exitMap.set("topExit", random(1, this.cols-1));
    //bottom //if true it matches top
    //this.exitMap.set("bottomExit", this.exitMap.get("topExit"));

    //left
    // this.exitMap.set("leftExit", random(1, rows-1));
    //right // match left
    //this.exitMap.set("rightExit", this.exitMap.get("leftExit"));



    this.generateGrid();

    //for grid boundaries
    //this.top = this.gridY;
    //this.bottom = this.gridY+this.gridHeight;
  }

  generateGrid() {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      this.grid.push([]);
      for (let x = 0; x < this.cols; x++) {

        //top border   //bottom border   //left border    //right border
        if (y === 0 || y === this.rows-1 || x === 0 || x === this.cols-1) {
          this.grid[y].push(1);
        }
        else {
          this.grid[y].push(0);
        }

      }
    }
  }

  generateExits() {
    //based on where grid is on current level
  }

  displayGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        
        if (this.grid[y][x] === 0) {
          //fill(200);
          //stroke(180);
          fill(36, 115, 113);
          stroke(26, 105, 103);
        }
        if (this.grid[y][x] === 1) {
          fill(0);
          // noStroke();
          stroke(45);
        }

        
        if (y === 0 && x === 0) {
          //this.gridX =  width/2 - this.gridWidth/2 - CELL_SIZE/2;
          //this.gridY =  height/2 - this.gridHeight/2 - CELL_SIZE/2;
          //console.log(y*CELL_SIZE+ height/2 - this.gridHeight/2);
          //82.5
        }
        
        rect(x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
        //rect(x*CELL_SIZE + width/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
      }
    }
    
  }

  // boundaries() {
  //   for (let y = 0; y < this.rows; y++){
  //     for (let x = 0; x < this.cols; x++) {
  //       if (this.grid[y][x] === 1) {
  //         //do nothing
  //       }

  //       //
  //       else if (this.grid[y][x] === 0) {         

  //       }
  //     }
  //   }
  // }


}

class Level  {
  constructor() {
    //temporary
    // this.template = [[1, 1],
    //                  [1, 1]]; // 4 3x3 Grids
    this.template = [[2, 2],
    // eslint-disable-next-line indent
                     [2, 2]];


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
    displayStartScreen();
    
  }
  else if (gameState === "ongoing") {
    background(0);

    // currentLevel.currentGrid = [1, 0];
    
    //               these access from currentGrid to change the grid change the values in currentGrid NOT change the [0] and [1]
    // currentLevel.level[   currentLevel.currentGrid[0]  ]  [  currentLevel.currentGrid[1]  ].displayGrid();
    currentLevel.level[0][0].displayGrid();

    damageSquare();
    healSquare();

    you.move();
    you.display();

    //markers for grid boundaries (reference)
    // fill(20);
    // rect(currentLevel.level[0][0].gridX, currentLevel.level[0][0].gridY, 100, 100);
    // rect(currentLevel.level[0][0].gridX + currentLevel.level[0][0].gridWidth, currentLevel.level[0][0].gridY + currentLevel.level[0][0].gridHeight, 100, 100);
    

    displayOngoingUI();
  }
}




function displayStartScreen() {
  //background(47, 87, 99); //teal
  background(58, 38, 84); //dark-medium purple)

  fill(255);
  textAlign(CENTER);
  you.CanMove = true;



  //buttons
  startButton.display();
  instructionButton.display();
  menuButton.display();



  //image border
  fill(0);
  rect(width/2 - 350, 110, 700, 400);

  //replace with image
  //fill(10);
  fill(27, 5, 43); //dark purple
  rect(width/2 - 345, 115, 690, 390);

  //side bars
  // fill(12, 25, 43); // Navy
  //fill(27, 5, 43); //dark purple
  fill(0);
  rect(0, 0, width/2-500, height);
  rect(width/2+500, 0, width, height);

  displayInstructions();

  animateSideMenu();

  if (sideMenu.state === "open") {
    //display setting/menu buttons
    toggleSoundButton.display();
  }
}

function displayOngoingUI() {
  //while gameState === "ongoing";
  //change the x & y for menu button
  menuButton.x = width-40;
  menuButton.y = 15;

  you.displayHealthBar();
  

  menuButton.display();

  displayInstructions();

  animateSideMenu();
  if (sideMenu.state === "open") {
    //display setting/menu buttons
    toggleSoundButton.display();
  }
}

function animateSideMenu() {
  
  //OPENING
  if (sideMenu.state === "opening") {
    if (sideMenu.x <= 0) {
      
      //
      if (dist(sideMenu.x, 0, 0, 0) < 70) { //change it to be based on percentages of sideMenu's width
        sideMenu.dx = 12;
      }
      else if (dist(sideMenu.x, 0, 0, 0) < 40) { 
        sideMenu.dx = 2;
      }
      else {
        sideMenu.dx = 30;
      }


      sideMenu.x += sideMenu.dx;
      
    }
    if (sideMenu.x > 0  && sideMenu.state === "opening") {
      sideMenu.x = 0;
      sideMenu.state = "open";
    }
  }

  //CLOSING
  if (sideMenu.state === "closing") {
    if (sideMenu.x > -350 ) {
      sideMenu.x -= sideMenu.dx;
    }
    else{
      sideMenu.x = -350;
      sideMenu.state = "closed";
    }
  }

  displaySideMenu();
}

function displaySideMenu() {
  //fill(100);
  fill(27, 5, 43); //dark purple

  rect(sideMenu.x, sideMenu.y, sideMenu.width, height);
}

function displayInstructions() {
  if (instructions.state === "opening") {
    //opening animation
    instructions.state = "open";
  }
  if (instructions.state === "open") {

    //main box
    rectMode(CENTER);
    fill(27, 5, 43);
    stroke(0);
    strokeWeight(10);
    rect(width/2, height/2, instructions.width, instructions.height);

    //control segment
    //rect(width/2-(width-700)/2, height/2, (width-700)/2, height-100);


    rectMode(CORNER);
    noStroke();
    strokeWeight(2);
  }
  if (instructions.state === "closing") {
    instructions.state = "closed";
  }
}


function damageSquare() {
  //like a spike or something to be decided

  // if (currentColor === "green" && millis() > lastSwitchedTime + waitTime) {
  //   currentColor = "yellow";
  //   lastSwitchedTime = millis();
  //   console.log(currentColor);
  // }

  fill("red");
  noStroke();
  rect(width/2+50, height/2+50, 30, 30);
  
  console.log();
  if (collideRectRect(you.x, you.y, you.width, you.height,    width/2+50, height/2+50, 30, 30)   &&   (millis() > you.lastHit + you.hitWait || you.lastHit <= 0)){
    you.currentHP -= 10;
    you.currentHP = constrain(you.currentHP, 0, you.maxHP);
    you.lastHit = millis();
    //console.log(millis() > you.lastHit + you.hitWait);
  }
}

function healSquare() {
  //heals
  let i = 0;

  fill("green");
  noStroke();
  rect(width/2-50, height/2-50, 30, 30);

  if (collideRectRect(you.x, you.y, you.width, you.height,    width/2-50, height/2-50, 30, 30)){
    you.currentHP += 10;
    you.currentHP = constrain(you.currentHP, 0, you.maxHP);
    
  }
}

function createButtons() {
//  button format:              x // y // width // height //   r // g // b //    "text"    //  textsize // "toggle"


  //purple
  menuButton = new Button(width/2 + 80, height-75, 25, 25,        27, 5, 43,   "☰", 14, "notToggle");

  instructionButton = new Button(width/2, height-75, 100, 25,     27, 5, 43,   "Instructions", 15, "notToggle");

  startButton = new Button(width/2, height-150, 150, 50,          27, 5, 43,   "Start" , 35, "notToggle");



  toggleSoundButton = new Button(sideMenu.width/2, 50, 100, 40,    58, 38, 84,    "Sounds:", 15, "on");
  //sound volume (amp) adjuster button when
}



function mousePressed() {
  if (gameState === "start") {

    if (instructions.state !== "open" && instructions.state !== "opening" ) {
      //start game
      if (startButton.isClicked()) {
        gameState = "ongoing";
        currentLevel = testingLevel;
      }
      
      if (instructionButton.isClicked()) {
        //displayInstructions();
        if (instructions.state === "closed") {
          instructions.state = "opening";
        }

        sideMenu.state = "closing";
      }
    

    //settings
    if (menuButton.isClicked()) {
      if (sideMenu.state === "closed") {
        sideMenu.state = "opening";
      }
      if (sideMenu.state === "open") {
        sideMenu.state = "closing";
      }
    }

    if (toggleSoundButton.isClicked()) {
      isSoundOn = !isSoundOn;
    }
  }
}

}

function keyPressed() {
  // put this in keypressed
  if (keyCode === 32) {
    if (sideMenu.state === "open") {
      sideMenu.state = "closing";
    }
    else if (instructions.state === "open") {
      instructions.state = "closing";
    }
  }

}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (gameState === "start") {

    startButton.x = width/2 - startButton.w/2;
    instructionButton.x = width/2 - instructionButton.w/2;
    menuButton.x = width/2 - menuButton.w/2 + 80;
  }

  if (gameState === "ongoing") {
    menuButton.x = width-40;
    menuButton.y = 15;
  }
}