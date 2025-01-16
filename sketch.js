// Major Project
// Avery Walker
// January 15th 2025
//
//
//(currentLevel['aLevel'])[0][0].rows <- figured out how to access stuff from my 3d array. cool
// constrain();


//TO DO LIST//

// background music

//attacks



//gameStates
let gameState = "start";
let levelArea = "onLevel";

//player
let you;

//player stats
let levelsCompleted = 0;
let enemysDefeated = 0;
let points = 0;

let money = 0;

//enemies
let amountOfEnemies = 1;
let enemyArray = [];
let tutorialEnemy;

//BUTTONS
let instructionButton;
let startButton;
let menuButton;
let returnButton;
let restButton;
let toggleSoundButton;

let showDebug
let toggleDebugButton;

let toggleBGMButton;

//GRIDS
const CELL_SIZE = 100;
// max cols  8 // min 4
// max rows 7 // min 4
let gridOfLevel = [0, 0];

//LEVELS
let currentLevel;

let tutorialOver = false;
let tutorialPart = 1;
let tutorialLevel;
let homeLevel;

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
  height: 600,
  state: "closed",
};



function preload() {
  buttonClickedSound = loadSound("zipclick.flac");

  cyanTurf = loadImage("cyanturf.png");
  greyTile = loadImage("greyTile.png");
  homeBed = loadImage("bed.png");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  you = new Player(width/2, height/2);
  

  // LEVELS
  tutorialLevel = new Level([[2, 3, 2],[4, "g"]]);
  homeLevel =  new Level([[3, 1]]);

  //changing this to 'aLevel' breaks it idk why eslint wants me to do that
  tutorialLevel.level = tutorialLevel.generateLevel();
  homeLevel.level = homeLevel.generateLevel();

  currentLevel = tutorialLevel;
  tutorialEnemy = new Enemy();
  enemyArray.push(tutorialEnemy);

  // BUTTONS
  createButtons();
}



class Player {
  constructor(x, y) {
    //sprite should be about (40x15)2
    //this.height = 80;
    this.height = 30;
    this.width = 30;

    this.x = x-this.width/2;
    this.y = y-this.height/2;

    //used to pause player input during dialouge ect.
    this.canMove = true;
    this.speed = 10;

    this.maxHP = 100;
    this.currentHP = 50;

    this.lastHit = 0;
    this.hitWait = 1000;

    this.lastAttacked = 0;
    this.attackWait =  1500;

    this.state = "alive";

    this.DMG = 10;

    this.exitLeft = false;
    this.exitRight = false;
    this.exitTop = false;
    this.exitBottom = false;

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

    if (levelArea === "onLevel") {
      this.moveBetweenGrids(); 
    }
  }

  checkExits() {
    //exit Right
    try {
      if (currentLevel.level[gridOfLevel[0]][gridOfLevel[1]+1].canEnter) {
        this.exitRight = true;
      }
    }
    catch(err) {
      this.exitRight = false;
    }

    //exit left
    try {
      if (currentLevel.level[gridOfLevel[0]][gridOfLevel[1]-1].canEnter) {
        this.exitLeft = true;
      }
    }
    catch(err) {
      this.exitLeft = false;
    }

    //exit top
    try {
      if (currentLevel.level[gridOfLevel[0]-1][gridOfLevel[1]].canEnter) {
        this.exitTop = true;
      }
    }
    catch(err) {
      this.exitTop = false;
    }

    //exit bottom
    try {
      if (currentLevel.level[gridOfLevel[0]+1][gridOfLevel[1]].canEnter) {
        this.exitBottom = true;
      }
    }
    catch(err) {
      this.exitBottom = false;
    }
  }

  checkState() {
    if (this.currentHP <= 0) {
      this.state = "dead";
      returnButton.display();
    }
  }

  attack() {
    if (dist(mouseX, mouseY, this.x, this.y) < 150){ //&& (millis() > this.lastAttacked + this.attackWait || this.lastAttacked <= 0)) {
      this.meleeAttack();
    }
    else {
      this.rangedAttack();
    }
    // else if (millis() < this.lastAttacked + this.attackWait) {
    //   this.meleeAttackAnim = "end";
    // }
  }

  meleeAttack() {
    fill(255, 255, 255, 50);
    circle(mouseX, mouseY, 100);

    //for enemy of enemyArray if collide enemy take damage 
  }

  rangedAttack() {

  }

  moveBetweenGrids() {

    this.checkExits();
    
    let theGridX = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX;
    let theGridY = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY;
    let theGridH = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridHeight;
    let theGridW = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridWidth;

    //LEFT AND RIGHT EXITS
    //is y in middle
    if (this.y  > height/2 - CELL_SIZE/2 &&   this.y < height/2 + CELL_SIZE/2-this.height) {
      if (this.exitLeft && this.exitRight) {
        this.x = constrain(this.x, 
          this.width*-1, //min
          width+this.width); //max
      }
      else if (!this.exitLeft && !this.exitRight) {
        this.x = constrain(this.x, 
          theGridX + CELL_SIZE, //min
          theGridX + theGridW - CELL_SIZE-this.width); //max
      }
      else if (this.exitRight) {
        this.x = constrain(this.x, 
          theGridX + CELL_SIZE, //min
          width+this.width); //max
      }
      else if (this.exitLeft) {
        this.x = constrain(this.x, 
          this.width*-1, //min
          theGridX + theGridW - CELL_SIZE-this.width); //max
      }

    }
    else { 
      this.x = constrain(this.x, 
        theGridX + CELL_SIZE, //min
        theGridX + theGridW - CELL_SIZE-this.width); //max
      
    }


    //TOP AND BOTTOM
    //is x in middle
    if (this.x  > width/2 - CELL_SIZE/2 &&   this.x < width/2 + CELL_SIZE/2 - this.width) {
      if (this.exitTop && this.exitBottom) {
        this.y = constrain(this.y, 
          this.height*-1, //min
          height+this.height); //max
      }
      else if (!this.exitTop && !this.exitBottom) {
        this.y = constrain(this.y,
          theGridY + CELL_SIZE, //min
          theGridY + theGridH - CELL_SIZE-this.height); //max
      }
      else if (this.exitBottom) {
        this.y = constrain(this.y, 
          theGridY + CELL_SIZE, //min
          height+this.height); //max
      }
      else if (this.exitTop) {
        this.y = constrain(this.y, 
          this.height*-1, //min
          theGridY + theGridH - CELL_SIZE-this.height); //max
      }
    }
    else { 
      this.y = constrain(this.y,
        theGridY + CELL_SIZE, //min
        theGridY + theGridH - CELL_SIZE-this.height); //max  
    }


    //updates coords when you move
    //right
    if ( keyIsDown(68) && this.x > theGridX + theGridW + this.width && currentLevel.level[gridOfLevel[0]][gridOfLevel[1]+1].canEnter) {
      gridOfLevel[1] += 1;
      this.x = theGridX;
    }
    //left
    else if (keyIsDown(65) && this.x < theGridX - this.width && currentLevel.level[gridOfLevel[0]][gridOfLevel[1]-1].canEnter) {
      gridOfLevel[1] -= 1;
      this.x = theGridX+theGridW;
    }
    //bottom
    else if (this.y > height && currentLevel.level[gridOfLevel[0]+1][gridOfLevel[1]].canEnter) {
      gridOfLevel[0] += 1;
      this.y = 0;
    }
    else if (this.y < 0 && currentLevel.level[gridOfLevel[0]-1][gridOfLevel[1]].canEnter) {
      gridOfLevel[0] -= 1;
      this.y = height;
    }
  }

}

class Enemy {
  constructor() {
    this.x = random(currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + CELL_SIZE, currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridWidth);  
    this.y = random(currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + CELL_SIZE, currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridHeight);
    this.r = 30;

    this.currentHP = 50;
    this.maxHP = 100;

    this.DMG = 10;
  }

  display() {
    if (this.currentHP > 0) {
      fill("red");
      circle(this.x, this.y, this.r*2);
      
      if (collidePointCircle(mouseX, mouseY, this.x, this.y, this.r*2) || dist(this.x, this.y, you.x, you.y) < 150) {
        this.displayHealth();
      }

      this.damagePlayer();
    }
  }

  displayHealth() {
    fill(255);
    textSize(10);
    text(`${this.currentHP}/${this.maxHP}HP`, this.x, this.y + this.r*2);
  }

  damagePlayer(){
    //melee
    if (collideRectCircle(you.x, you.y, you.width, you.height, this.x, this.y, this.r*2) ) {
      you.currentHP - this.DMG;
    }

    // if (collideRectRect(you.x, you.y, you.width, you.height,    width/2+50, height/2+50, 30, 30)   &&   (millis() > you.lastHit + you.hitWait || you.lastHit <= 0)){
    //   you.currentHP -= 10;
    //   you.currentHP = constrain(you.currentHP, 0, you.maxHP);
    //   you.lastHit = millis();
    //   //console.log(millis() > you.lastHit + you.hitWait);
    // }
  }
}

class Bullet {
  constructor(){
    this.x;
    this.y;
    this.direction; //playerx&y/mouseX&Y from when clicked? as an angle erm math
  }
  //particle
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

    this.gridX =  width/2 - (this.gridWidth/2-CELL_SIZE/2) - CELL_SIZE/2;

    this.gridY =  height/2 - (this.gridHeight/2-CELL_SIZE/2) - CELL_SIZE/2;

    this.canEnter = true;
    this.goalCompleted = false;
    this.goalCounted = false;
    
    this.generateGrid();
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

  displayGoal() {
    fill(200);
    if (collideRectCircle(you.x, you.y, you.width, you.height, width/2, height/2, 100)) {
      this.goalCompleted = true;
      if (!this.goalCounted) {
        currentLevel.completedGoals += 1;
        this.goalCounted = true;
      }
    }
    if (this.goalCompleted) {
      fill("green");
    }
    
    circle(width/2, height/2, 100);

  }

  displayGridExits(right, left, top, bottom, tile) {
    if (right) {
      image(tile, this.gridX + this.gridWidth - CELL_SIZE, height/2 - CELL_SIZE/2, CELL_SIZE, CELL_SIZE); 
    }
    if (left) {
      image(tile, this.gridX, height/2 - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
    }
    if (top) {
      image(tile, width/2 - CELL_SIZE/2, this.gridY, CELL_SIZE, CELL_SIZE);
    }
    if (bottom) {
      image(tile, width/2 - CELL_SIZE/2, this.gridY + this.gridHeight - CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  displayGrid(tile) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        
        if (this.grid[y][x] === 0) {
          // fill(36, 115, 113);
          image(tile, x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE + height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
 
        }
        if (this.grid[y][x] === 1) {
          fill(0);
          noStroke();
          rect(x*CELL_SIZE + width/2 - this.gridWidth/2, y*CELL_SIZE+ height/2 - this.gridHeight/2, CELL_SIZE, CELL_SIZE);
        }
      }
    }
    this.displayGridExits(you.exitRight, you.exitLeft, you.exitTop, you.exitBottom, tile);

    if (currentLevel.template[gridOfLevel[0]][gridOfLevel[1]] === "g") {
      this.displayGoal();
    }
  }
}

class Level  {
  constructor(template) {
    //temporary
    this.template = template;

    this.completedGoals = 0;
    this.totalGoals = 0;

  }

  generateLevel() {
    //takes each value from the template and turns it into a grid
    //key: 1=3x3, 2=4x4, 3=5x5 ect, g=3x3 "goal" grid, // (r not yet set) r = random(3, 9)x random(3, 8)

    this.aLevel = [];
    for (let y = 0; y < this.template.length; y ++) {
      this.aLevel.push([]);
      for (let x = 0; x < this.template[y].length; x++) {
        //console.log(this.template[y][x]);
        if (this.template[y][x] === "g") {
          this.totalGoals +=1;
          let aGrid = new SingleGrid(5, 5);
          this.aLevel[y].push(aGrid);
        }
        else {  
          let aGrid = new SingleGrid(this.template[y][x]+4, this.template[y][x]+4);
          this.aLevel[y].push(aGrid);
        }
        
      }
    }
    return this.aLevel;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw Loop Start
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  changeLevel();
  if (gameState === "start") {
    displayStartScreen();
    
  }
  else if (gameState === "ongoing") {
    background(0);
    removeDeadEnemies();
    

    if (currentLevel === homeLevel) {
      homeLevel.level[gridOfLevel[0]][gridOfLevel[1]].displayGrid(greyTile);
      displayHomeStuff();
    }
    else if (currentLevel === tutorialLevel && (gridOfLevel[0] === 0 && gridOfLevel[1] === 1 || gridOfLevel[0] === 1 && gridOfLevel[1] === 0)) {    
      tutorialLevel.level[gridOfLevel[0]][gridOfLevel[1]].displayGrid(cyanTurf);
      tutorialEnemy.display();
    }
    else {
      currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].displayGrid(cyanTurf);
    }
    

    you.move();
    you.display();

    displayOngoingUI();

    

    if (!tutorialOver){
      tutorial();
    }
  }
}

function tutorial() {
  
    textSize(15);
    textAlign(CENTER);

    if (tutorialPart === 1) {
      fill(120);
    }
    else {
      fill(80);
    }

    text("press 'x' to skip tutorial", width-150, 30);

    fill(255);

  if (tutorialPart === 1) {
    text("Use the WASD keys to move", width/2, 100);
  }
  else if (tutorialPart === 2) {
    text("exit the grid (down or right) to continue", width/2, 100);
    if (currentLevel === tutorialLevel && (gridOfLevel[0] === 0 && gridOfLevel[1] === 1 || gridOfLevel[0] === 1 && gridOfLevel[1] === 0)) {    
      tutorialPart = 3; 
    }
  }
  else if (tutorialPart === 3){
    //keep player in grid untill enemy is defeated
    you.x = constrain(you.x, currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + CELL_SIZE,  currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridWidth - CELL_SIZE - you.width);
    you.y = constrain(you.y, currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + CELL_SIZE,  currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridHeight -  CELL_SIZE - you.height);
    text("Hover with your mouse to see an enemy's HP", width/2, 100);
    if (collidePointCircle(mouseX, mouseY, tutorialEnemy.x, tutorialEnemy.y, tutorialEnemy.r*2)) {
      tutorialPart = 4;
    }
  }
  else if (tutorialPart === 4) {
    text("Use left click to attack", width/2, 100);
    if (tutorialEnemy.currentHP <= 0) {
      tutorialPart = 5;
    }
  }
  else if (tutorialPart === 5) {
    text("Continue searching the level to find the goal points", width/2, 100);
    if (tutorialLevel.completedGoals === tutorialLevel.totalGoals) {
      tutorialPart = 6;
    }
  }
  else if (tutorialPart === 6) {
    text("Click to return to base", width/2, 100);
    if (currentLevel === homeLevel) {
      tutorialPart = 7;
    }
  }
  else if(tutorialPart === 7) {
    text("rest in bed in order to regain health", width/2, 100);
    if(you.currentHP === you.maxHP) {
      tutorialPart = 8;
    }
  }
  else if(tutorialPart === 8) {
    text("When your ready, exit right to go to a new level", width/2, 100);
    if (currentLevel !== homeLevel) {
      tutorialOver = true;
    }
  }
  
}


function displayHomeStuff() {
  let bedX = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + CELL_SIZE*2;
  let bedY = currentLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + CELL_SIZE;
  let bedW = 86;
  let bedH = 163;

  if (gridOfLevel[0] === 0 && gridOfLevel[1] === 0) {
    image(homeBed, bedX, bedY, bedW, bedH);

    if (you.currentHP !== you.maxHP && collideRectRect(bedX, bedY, bedW, bedH,    you.x, you.y, you.width, you.height)) {
      restButton.display();
    }
  }
}

function changeLevel() {
  if (currentLevel.completedGoals === currentLevel.totalGoals && !tutorialLevel){
    // tutorialOver = true;
    returnButton.display();
  }
}

function createTemplate(cols, rows) {
  // let theRows = rows;
  // let theCols = cols;
  let theRows = 3;
  let theCols = 3;
  let theTemplate = [];

  for(let y = 0; y < theCols; y++){

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

  if (currentLevel.completedGoals === currentLevel.totalGoals && currentLevel.totalGoals !== 0){
    returnButton.display();
  }

  //TEMPORARY
  if (currentLevel !== homeLevel) {
    if (showDebug) {
      textSize(12);
      text(`${gridOfLevel[0]}, ${gridOfLevel[1]}`, 200, 200);
      text(`${currentLevel.completedGoals}/${currentLevel.totalGoals} goals completed`, 200, 230);
    }
  }
  if(currentLevel === homeLevel) {

  }
}



function animateSideMenu() {
  
  //OPENING
  if (sideMenu.state === "opening") {
    if (sideMenu.x <= 0) {
      
      //
      if (dist(sideMenu.x, 0, 0, 0) < 70) { 
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

  //buttons always adjustable
  toggleSoundButton.x = sideMenu.x + sideMenu.width/2 - toggleSoundButton.w/2; 
  toggleSoundButton.display();

  toggleDebugButton.x = sideMenu.x + sideMenu.width/2 - toggleDebugButton.w/2; 
  toggleDebugButton.display();

  toggleBGMButton.x = sideMenu.x + sideMenu.width/2 - toggleBGMButton.w/2; 
  toggleBGMButton.display();
  //only adjustable in....

  textAlign(CENTER);
  fill(255);
  stroke(0);
  text("Press SPACE to close", sideMenu.x + sideMenu.width/2, height-10);
  textAlign(LEFT);
  noStroke();
}

function removeDeadEnemies() {
  for (let enemy of enemyArray) {
    if (enemy.currentHP <= 0) {
      enemyArray.splice(enemyArray.indexOf(enemy), 1);
    }
  }
}

function displayInstructions() {
  if (instructions.state === "opening") {
    //opening animation if i add one
    instructions.state = "open";
  }
  if (instructions.state === "open") {

    //main box
    rectMode(CENTER);
    fill(27, 5, 43);
    stroke(0);
    strokeWeight(10);
    rect(width/2, height/2, instructions.width, instructions.height);
    rectMode(CORNER);
    strokeWeight(2);

    //header and footer
    textAlign(CENTER);
    fill(255);
    stroke(0);
    textSize(12);
    text("Press SPACE to close", width/2, height/2 +instructions.height/2-20);

    textSize(30);
    text("- - - - INSTRUCTIONS - - - - ", width/2, height/2 - instructions.height/2 + 25);
  
    textSize(22);
    text("Movement use WASD keys \n \n Left click to Attack \n \n hover over enemies or get within range to see their health \n \n Objectives: find all goal points on each level to move on, \n defeat enemies to gain points", width/2, height/2 - instructions.height/2 + 215);
    textAlign(LEFT);
    noStroke();
  }
  if (instructions.state === "closing") {
    instructions.state = "closed";
  }
}


//not currently in use
function damageSquare() {
  //like a spike or something to be decided

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

function spawnEnemy(amountOfEnemies){
  for (let i = amountOfEnemies; i > 0; i++) {
    let someEnemy = new Enemy();
    enemyArray.push(someEnemy);
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


  returnButton = new Button(width/2, height-175, 200, 50,          27, 5, 43,   `Level Complete \n {{ return to base }}` , 15, "notToggle");
  //when level is completed pressing this button brings you to homeLevel

  restButton = new Button(homeLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridX + CELL_SIZE*2 + 43, homeLevel.level[gridOfLevel[0]][gridOfLevel[1]].gridY + CELL_SIZE + 180,
    80, 20,        27, 5, 43,      "rest?",  15, "notToggle");
    
  toggleSoundButton = new Button(sideMenu.width/2, 50, 100, 40,    58, 38, 84,    "Sounds:", 15, "on");

  toggleBGMButton = new Button(sideMenu.width/2, 100, 150, 40,   58, 38, 84,     "background Music:", 15, "on");
  
  toggleDebugButton = new Button(sideMenu.width/2, 150, 175, 40,    58, 38, 84, "Show Debug Menu:", 15, "off");
}



function mousePressed() {

  if (menuButton.isClicked()) {
    if (sideMenu.state === "closed") {
      sideMenu.state = "opening";
    }
    if (sideMenu.state === "open") {
      sideMenu.state = "closing";
    }
  }


  //side menu buttons
  if (toggleSoundButton.isClicked()) {
    isSoundOn = !isSoundOn;
  }

  if (toggleDebugButton.isClicked()) {
    showDebug = !showDebug;
  }

  if(toggleBGMButton.isClicked()) {
    isMusicOn = !isMusicOn;
  }


  if (gameState === "start") {
    if (instructions.state !== "open" && instructions.state !== "opening" ) {
      //start game
      if (startButton.isClicked()) {
        gameState = "ongoing";
        currentLevel = tutorialLevel;
      }
      
      if (instructionButton.isClicked()) {
        //displayInstructions();
        if (instructions.state === "closed") {
          instructions.state = "opening";
        }

        sideMenu.state = "closing";
      }
    }
  }

  if (gameState === "ongoing") {

    if (returnButton.isClicked() && currentLevel.completedGoals === currentLevel.totalGoals && currentLevel.totalGoals !== 0) {
      currentLevel = homeLevel;
      gridOfLevel[0] = 0;
      gridOfLevel[1] = 0;
      you.x = width/2 - you.width/2;
      you.y = width/2 - you.height/2;
    }
    else if (restButton.isClicked()) {
      //blink screen
      you.currentHP = you.maxHP;
    }
    else {
      //if (mouseX < you.x-100 && mouseX > you.x + 100)
      //you.attack();
      for (let enemy of enemyArray) {
        if (collidePointCircle(mouseX, mouseY, enemy.x, enemy.y, enemy.r*2)) {
          enemy.currentHP -= you.DMG;
        }
      }
    }
  }
}
  



function keyPressed() {
  if (tutorialPart === 1 && (keyIsDown(87) || keyIsDown(83) || keyIsDown(68) || keyIsDown(65))) {
    tutorialPart = 2;
  }

  if (!tutorialOver && key === "x") {
    tutorialOver = true;
  }
  
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