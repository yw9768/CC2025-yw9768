let buttonX = 160;
let buttonY = 80;
let buttonD = 80;
let hovering = false; 
// boolean variable that tracks whether the mouse is 
// hovering over my button

let r = 0; // variable to hold red amount
let g = 0; // variable to hold green amount
let b = 0; // variable to hold blue amount

let ballX = 0; // var to remember ball x position
let ballSpeed = 0.5;
let ballDiameter = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  ballX = ballDiameter/2;
}

function draw() {
  background(r, g, b); // use r g and b variables for bg color
  strokeWeight(1); // resets strokeweight to 1
  fill(0, 255, 0); // green fill
  text("x: " + mouseX + " y: " + mouseY, 15, 15);
  let distance = dist(mouseX, mouseY, buttonX, buttonY);
  text("dist: " + distance, 15, 30);

  stroke(255); //white stroke
  noFill(); // resets fill to none

  if (distance < buttonD / 2) {
    // IS the distance between the mouse and the
    // center of the button LESS THAN the radius?
    fill(50);
    hovering = true; // FLIPPED hovering variable
    if (mouseIsPressed) {
      strokeWeight(3);
    }
    ballX = ballX+ballSpeed;
  } else {
    hovering = false;
  }
  circle(buttonX, buttonY, buttonD);

  fill("red");
  noStroke();

  if(ballX>width-(ballDiameter/2) || ballX < ballDiameter/2){
    ballSpeed = -ballSpeed;
  }

  circle(ballX,200,30); // circle uses ballx for x pos
}

function mousePressed() {
  // the mousePressed function runs enclosed code
  // ONCE when the mouse is pressed down
  if (hovering == true) {
    r = random(255);
    g = random(255);
    b = random(255);
    ballSpeed = -ballSpeed;
  }
}
