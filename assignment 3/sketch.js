

// Outer circle/ circular petals
let outerCount = 12;// The number of petals on the outer circle
let radiusX = 250; // Outer circle radius
let circleDiameter = 100; // The diameter of the outer petal 

// Middle circle (rectangular petal)
let middleCount = 18; // The number of rectangular petals in the middle circle
let radiusY = 130; // Center circle radius
let rectWeight = 24;// The width of the rectangular petal in the center circle
let rectHeight = 40;  // The height of the rectangular petal in the center circle

// Philandering (inverted triangle
let triSide = 100; // Side length of this inverted triangle

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}// When the size of the browser window changes,
//  reset the canvas size to fit the new size

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);//Convenient rectangle at the back to rotate around themselves

}

function draw() {
  background(248, 248, 232); 


  // Start doing the outer loop (circular petals)
  //It will reflect for second（） after that, with the outer petal pulsating once per second
  fill(236, 168, 196); // petal color
  for (let i = 0; i < outerCount; i++) { //loop 12 times (outerCount= 12 = number of petals)
    let thetaX = i * (360 / outerCount); //Calculate the angle of petals    
    let circleX = width /2 + cos(radians(thetaX)) * radiusX;
    let circleY = height/2 + sin(radians(thetaX)) * radiusX;

    circle(circleX, circleY, circleDiameter);
  }

  // start doing the Middle circle loop (rectangular petal)
    //It will reflect for minute（） after that, the middle circle’s color shifts once per minute 
  fill(210, 115, 165); 
  for (let j = 0; j < middleCount; j++) { // loop 18 times (middleCount= 18 = number of rectangular petals)
    let thetaM = j * (360 / middleCount); 
    let rectX = width / 2 + cos(radians(thetaM)) * radiusY;
    let rectY = height/ 2 + sin(radians(thetaM)) * radiusY;

    push();
    translate(rectX, rectY);
    rotate(radians(thetaM)); //Rotate according to the angle and the center of the rectangle itself
    rect(0, 0, rectWeight, rectHeight, 6);
    pop();
  }

  // start drawing a inverted triangle
  fill(70, 145, 245); // fill the inverted triangle
  let h = triSide * sqrt(3) / 2; // height of an equilateral triangle ≈ side * √3 / 2
  //Regarding sqrt(), I found it on the webpage of p5.js reference. 
  // This function is used to calculate the square root of a number.
  //  More detailed comments are in rename.

  push();
  translate(width/2, height/2); // move the origin(0,0) to the center of the canvas

  push();
  rotate(PI);//Rotate the entire regular triangle by 180 degrees to invert it

  //draw the regular triangle (symmetric around 0,0)
  //I provided a more detailed explanation of how to draw this triangle in the rename file
  triangle(
    -triSide/2,  h/2,   // left point
     triSide/2,  h/2,   // right point
     0,         -h/2    // top point
  );
  pop();

pop();

}
